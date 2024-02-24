package pdf

import (
	"bytes"
	"context"
	"database/sql"
	"errors"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/minio/minio-go/v7"

	"github.com/dokedu/dokedu/backend/internal/database/db"
)

func (g *Generator) UpdateReportStatus(reportId string, status db.ReportStatus) error {
	return g.cfg.DB.GLOBAL_UpdateReportStatus(context.Background(), db.GLOBAL_UpdateReportStatusParams{
		Status: status,
		ID:     reportId,
	})
}

func (g *Generator) UploadPDFToBucket(report db.Report, pdf []byte) error {
	ctx := context.Background()

	// bucket id is report.OrganisationID + "-" reports
	bucketId := report.OrganisationID + "-reports"

	//var bucket db.Bucket
	//err := g.cfg.DB.NewSelect().Model(&bucket).Where("name = ?", bucketId).Where("organisation_id = ?", report.OrganisationID).Scan(ctx)
	bucket, err := g.cfg.DB.InternalBucketByName(ctx, db.InternalBucketByNameParams{
		Name:           bucketId,
		OrganisationID: report.OrganisationID,
	})
	if errors.Is(err, sql.ErrNoRows) {
		bucket = db.Bucket{
			Name:           bucketId,
			OrganisationID: report.OrganisationID,
		}
		// Create the bucket if it doesn't exist
		//_, err = g.cfg.DB.NewInsert().Model(&bucket).Returning("*").Exec(ctx)
		_, err = g.cfg.DB.CreateBucketWithoutUser(ctx, db.CreateBucketWithoutUserParams{
			Name:           bucket.Name,
			Shared:         false,
			OrganisationID: bucket.OrganisationID,
		})
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

	//var file db.File
	//file.FileType = db.FileTypeBlob
	//file.OrganisationID = report.OrganisationID
	//file.Name = report.ID
	//file.BucketID = bucket.ID
	//file.MimeType = "application/pdf"
	//file.ID = report.ID
	//_, err = g.cfg.DB.NewInsert().Model(&file).Returning("*").Exec(context.Background())

	fileParams := db.CreateFileParams{
		Name:           report.ID,
		MimeType:       pgtype.Text{String: "application/pdf", Valid: true},
		FileType:       db.FileTypeBLOB,
		BucketID:       bucket.ID,
		ParentID:       pgtype.Text{},
		OrganisationID: report.OrganisationID,
	}

	file, err := g.cfg.DB.CreateFile(ctx, fileParams)
	if err != nil {
		return err
	}

	_, err = g.cfg.DB.UpdateReportStatusAndFileId(context.Background(), db.UpdateReportStatusAndFileIdParams{
		ID:             report.ID,
		Status:         db.ReportStatusDone,
		FileID:         pgtype.Text{String: file.ID, Valid: true},
		OrganisationID: report.OrganisationID,
	})
	return err
}
