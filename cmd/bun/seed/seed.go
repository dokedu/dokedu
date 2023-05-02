package seed

import (
	"embed"
	"github.com/uptrace/bun"
)

//go:embed seed.sql
var seedFile embed.FS

func Seed(db *bun.DB) error {
	// load seed.sql

	file, _ := seedFile.ReadFile("seed.sql")

	sql := string(file)

	_, _ = db.Exec(sql)

	// run seed.sql
	return nil
}
