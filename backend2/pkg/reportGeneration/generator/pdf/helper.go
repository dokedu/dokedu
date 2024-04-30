package pdf

import (
	"bytes"
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/minio/minio-go/v7"

	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

func (g *Generator) UpdateReportStatus(reportId string, status db.ReportStatus) error {
	_, err := g.svc.DB.GLOBAL_ReportsUpdateStatus(context.Background(), db.GLOBAL_ReportsUpdateStatusParams{
		Status: status,
		ID:     reportId,
	})
	return err
}

func (g *Generator) UploadPDFToBucket(report db.Report, pdf []byte) error {
	ctx := context.Background()

	// bucket id is report.OrganisationID + "-" reports
	bucketName := report.OrganisationID + "-reports"

	bucket, err := g.svc.DB.BucketByName(ctx, db.BucketByNameParams{
		Name:           bucketName,
		OrganisationID: report.OrganisationID,
	})
	if errors.Is(err, pgx.ErrNoRows) {
		bucket, err = g.svc.DB.BucketCreate(ctx, db.BucketCreateParams{
			Name:           bucketName,
			OrganisationID: report.OrganisationID,
		})
	}
	if err != nil {
		return err
	}

	exists, err := g.svc.Minio.BucketExists(ctx, bucket.ID)
	if err != nil {
		return err
	}
	if !exists {
		err = g.svc.Minio.MakeBucket(ctx, bucket.ID, minio.MakeBucketOptions{})
		if err != nil {
			return err
		}
	}

	ioReader := bytes.NewReader(pdf)

	// Upload the pdf to the bucket
	_, err = g.svc.Minio.PutObject(ctx, bucket.ID, report.ID, ioReader, -1, minio.PutObjectOptions{
		ContentType: "application/pdf",
	})
	if err != nil {
		return err
	}

	file, err := g.svc.DB.FileCreate(ctx, db.FileCreateParams{
		Name:           report.ID,
		FileType:       db.FileTypeBlob,
		MimeType:       pgtype.Text{Valid: true, String: "application/pdf"},
		BucketID:       bucket.ID,
		OrganisationID: report.OrganisationID,
	})
	if err != nil {
		return err
	}

	_, err = g.svc.DB.ReportUpdateStatusDone(ctx, db.ReportUpdateStatusDoneParams{
		FileID:         file.ID,
		ID:             report.ID,
		OrganisationID: report.OrganisationID,
	})
	if err != nil {
		return err
	}

	return nil
}
