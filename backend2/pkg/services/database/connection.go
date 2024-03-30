package database

import (
	"context"
	"errors"
	"fmt"
	"sync"

	"github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

//go:generate sqlc generate
type DB struct {
	DB *pgxpool.Pool
	*db.Queries
}

type Config struct {
	Database string `env:"DB_NAME"`
	Username string `env:"DB_USER"`
	Password string `env:"DB_PASS"`
	Host     string `env:"DB_HOST"`
	Port     string `env:"DB_PORT"`
}

var typeNamesToRegister = []string{
	// enum types
	"user_lang",
}
var typesToRegister []*pgtype.Type
var typesToRegisterLock = &sync.Mutex{}

func New(cfg Config) *DB {
	ctx := context.Background()
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", cfg.Username, cfg.Password, cfg.Host, cfg.Port, cfg.Database)
	config, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		panic(err)
	}
	config.AfterConnect = func(ctx context.Context, conn *pgx.Conn) error {
		typesToRegisterLock.Lock()
		defer typesToRegisterLock.Unlock()

		if len(typesToRegister) == 0 {
			for _, s := range typeNamesToRegister {
				t, err := conn.LoadType(ctx, s)
				if err != nil {
					return fmt.Errorf("error while trying to register type %s: %w", s, err)
				}
				typesToRegister = append(typesToRegister, t)
				conn.TypeMap().RegisterType(t)

				t2, err := conn.LoadType(ctx, "_"+s)
				if err != nil {
					return fmt.Errorf("error while trying to register type _%s: %w", s, err)
				}

				typesToRegister = append(typesToRegister, t2)
				conn.TypeMap().RegisterType(t2)
			}
		} else {
			for _, t := range typesToRegister {
				conn.TypeMap().RegisterType(t)
			}
		}

		return nil
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		panic(err)
	}

	return &DB{
		DB:      pool,
		Queries: db.New(pool),
	}
}
func (d *DB) NewQueryBuilder() squirrel.StatementBuilderType {
	return squirrel.StatementBuilder.PlaceholderFormat(squirrel.Dollar)
}
func (d *DB) BeginTx(ctx context.Context) (pgx.Tx, *db.Queries, error) {
	tx, err := d.DB.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return nil, nil, err
	}

	return tx, d.Queries.WithTx(tx), nil
}
func (d *DB) InTx(ctx context.Context, fn func(ctx context.Context, q *db.Queries) error) (err error) {
	var tx pgx.Tx
	var store *db.Queries
	tx, store, err = d.BeginTx(ctx)
	if err != nil {
		return err
	}

	defer func() {
		errRollback := tx.Rollback(ctx)
		if errRollback == nil || errors.Is(errRollback, pgx.ErrTxClosed) {
			return
		}

		err = errors.Join(err, fmt.Errorf("failed to roll back transaction: %w", errRollback))
	}()

	err = fn(ctx, store)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (d *DB) Loader(ctx context.Context) *Dataloader {
	return LoaderFromContext(ctx)
}

func ExecUpdate(dbI *DB, ctx context.Context, query squirrel.UpdateBuilder) error {
	sql, args, err := query.ToSql()
	if err != nil {
		return err
	}

	_, err = dbI.DB.Exec(ctx, sql, args...)
	return err
}

func ScanUpdateOne[T any](dbI *DB, ctx context.Context, query squirrel.UpdateBuilder) (T, error) {
	var t T

	sql, args, err := query.ToSql()
	if err != nil {
		return t, err
	}

	rows, err := dbI.DB.Query(ctx, sql, args...)
	if err != nil {
		return t, err
	}

	return pgx.CollectOneRow(rows, pgx.RowToStructByName[T])
}

func ScanSelectOne[T any](dbI *DB, ctx context.Context, query squirrel.SelectBuilder) (T, error) {
	var t T

	sql, args, err := query.ToSql()
	if err != nil {
		return t, err
	}

	rows, err := dbI.DB.Query(ctx, sql, args...)
	if err != nil {
		return t, err
	}

	return pgx.CollectOneRow(rows, pgx.RowToStructByName[T])
}

func ScanSelectMany[T any](dbI *DB, ctx context.Context, query squirrel.SelectBuilder) ([]T, error) {
	sql, args, err := query.ToSql()
	if err != nil {
		return nil, err
	}

	rows, err := dbI.DB.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}

	return pgx.CollectRows(rows, pgx.RowToStructByName[T])
}
