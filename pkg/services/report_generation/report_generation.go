package report_generation

import "database/sql"

type ReportGenerationServiceConfig struct {
	DB *sql.DB
}

func NewReportGenerationService(cfg ReportGenerationServiceConfig) error {
	return nil
}
