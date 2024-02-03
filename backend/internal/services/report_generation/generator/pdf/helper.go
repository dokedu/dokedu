package pdf

import (
	"bytes"
	"context"
	"database/sql"

	"github.com/minio/minio-go/v7"

	"github.com/dokedu/dokedu/backend/internal/db"
)

func (g *Generator) UpdateReportStatus(reportId string, status db.ReportStatus) error {
	_, err := g.cfg.DB.NewUpdate().Model(&db.Report{}).Set("status = ?", status).Where("id = ?", reportId).Exec(context.Background())
	return err
}

func (g *Generator) UploadPDFToBucket(report db.Report, pdf []byte) error {
	ctx := context.Background()

	// bucket id is report.OrganisationID + "-" reports
	bucketId := report.OrganisationID + "-reports"

	var bucket db.Bucket
	err := g.cfg.DB.NewSelect().Model(&bucket).Where("name = ?", bucketId).Where("organisation_id = ?", report.OrganisationID).Scan(ctx)
	if err == sql.ErrNoRows {
		bucket = db.Bucket{
			Name:           bucketId,
			OrganisationID: report.OrganisationID,
		}
		// Create the bucket if it doesn't exist
		_, err = g.cfg.DB.NewInsert().Model(&bucket).Returning("*").Exec(ctx)
		if err != nil {
			return err
		}
	} else if err != nil {
		return err
	}

	exists, err := g.cfg.MinIO.BucketExists(ctx, bucket.ID)
	if err != nil {
		return err
	}
	if !exists {
		err = g.cfg.MinIO.MakeBucket(ctx, bucket.ID, minio.MakeBucketOptions{})
		if err != nil {
			return err
		}
	}

	ioReader := bytes.NewReader(pdf)

	// Upload the pdf to the bucket
	_, err = g.cfg.MinIO.PutObject(ctx, bucket.ID, report.ID, ioReader, -1, minio.PutObjectOptions{
		ContentType: "application/pdf",
	})
	if err != nil {
		return err
	}

	var file db.File
	file.FileType = db.FileTypeBlob
	file.OrganisationID = report.OrganisationID
	file.Name = report.ID
	file.BucketID = bucket.ID
	file.MimeType = "application/pdf"
	file.ID = report.ID
	_, err = g.cfg.DB.NewInsert().Model(&file).Returning("*").Exec(context.Background())
	if err != nil {
		return err
	}

	var reportUpdate db.Report
	reportUpdate.ID = report.ID
	reportUpdate.Status = db.ReportStatusDone
	reportUpdate.FileID = sql.NullString{String: file.ID, Valid: true}
	_, err = g.cfg.DB.NewUpdate().Column("status", "file_id").Model(&reportUpdate).Where("id = ?", report.ID).Exec(context.Background())
	if err != nil {
		return err
	}

	return nil
}
