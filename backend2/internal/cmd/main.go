package main

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"
	"os"

	"github.com/golang-migrate/migrate/v4"
	driverPgx "github.com/golang-migrate/migrate/v4/database/pgx/v5"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/urfave/cli/v2"

	"github.com/dokedu/dokedu/backend/internal/config"
	"github.com/dokedu/dokedu/backend/internal/migrations"
	"github.com/dokedu/dokedu/backend/pkg/app"
	"github.com/dokedu/dokedu/backend/pkg/reportGeneration"
	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/tracing"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error("Failed to load config", "err", err)
		os.Exit(1)
	}

	s, err := services.New(cfg.Services)
	if err != nil {
		slog.Error("Failed to create services", "err", err)
		os.Exit(1)
	}

	reportService := reportGeneration.NewReportGenerationService(s, context.Background(), 3)
	if err != nil {
		slog.Error("Failed to create report generation service", "err", err)
		os.Exit(1)
	}

	cliApp := &cli.App{
		Name: "dokedu",
		Commands: []*cli.Command{
			{
				Name: "app:start",
				Action: func(c *cli.Context) error {
					tracing.InitializeTracing(cfg.Tracing)
					application := app.New(s, reportService)

					reportService.GoStartLoop()

					slog.Info("Starting server on port 8080")
					return application.Server.ListenAndServe()
				},
			},
			{
				Name: "migrate:up",
				Action: func(c *cli.Context) error {
					slog.Info("Running migrations")
					db, err := sql.Open("pgx", cfg.Services.Database.DSN)
					if err != nil {
						return err
					}

					dbDriver, err := driverPgx.WithInstance(db, &driverPgx.Config{})
					if err != nil {
						return err
					}
					migrationDriver, err := iofs.New(migrations.Migrations, ".")
					if err != nil {
						return err
					}

					m, err := migrate.NewWithInstance(
						"iofs",
						migrationDriver,
						"postgres",
						dbDriver,
					)
					if err != nil {
						return err
					}

					err = m.Up()
					if err != nil {
						// if there are no changes, we can ignore the error
						if errors.Is(err, migrate.ErrNoChange) {
							slog.Info("No migrations to run")
							return nil
						}
						return err
					}
					return nil
				},
			},
		},
	}

	err = cliApp.Run(os.Args)
	if err != nil {
		slog.Error("Failed to run app", "err", err)
		os.Exit(1)
	}
}
