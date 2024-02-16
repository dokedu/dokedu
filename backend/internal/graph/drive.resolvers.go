package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.40

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"mime"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/dokedu/dokedu/backend/internal/database/db"
	"github.com/dokedu/dokedu/backend/internal/dataloaders"
	"github.com/dokedu/dokedu/backend/internal/graph/model"
	"github.com/dokedu/dokedu/backend/internal/helper"
	"github.com/dokedu/dokedu/backend/internal/middleware"
	minio "github.com/minio/minio-go/v7"
	"github.com/uptrace/bun"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// User is the resolver for the user field.
func (r *bucketResolver) User(ctx context.Context, obj *db.Bucket) (*db.User, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	// If the bucket is not owned by a user, return nil.
	if !obj.UserID.Valid {
		return nil, nil
	}

	return dataloaders.GetUser(ctx, obj.UserID.String, currentUser)
}

// DeletedAt is the resolver for the deletedAt field.
func (r *bucketResolver) DeletedAt(ctx context.Context, obj *db.Bucket) (*time.Time, error) {
	panic(fmt.Errorf("not implemented: DeletedAt - deletedAt"))
}

// Permission is the resolver for the permission field.
func (r *bucketResolver) Permission(ctx context.Context, obj *db.Bucket) (*db.FilePermission, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	// If the user is the owner of the bucket, they have full access.
	if obj.UserID.String == currentUser.ID {
		permission := model.FilePermissionManager
		return &permission, nil
	}

	// Get shares for the bucket.
	var share db.Share
	err = r.DB.NewSelect().Model(&share).
		Where("bucket_id = ?", obj.ID).
		Where("shared_with = ?", currentUser.ID).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	permission := model.FilePermission(cases.Title(language.Und).String(share.Permission))
	return &permission, nil
}

// Files is the resolver for the files field.
func (r *bucketResolver) Files(ctx context.Context, obj *db.Bucket) ([]*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var files []*db.File
	err = r.DB.NewSelect().Model(&files).Where("bucket_id = ?", obj.ID).Where("organisation_id = ?", currentUser.OrganisationID).Order("name").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return files, nil
}

// MIMEType is the resolver for the MIMEType field.
func (r *fileResolver) MIMEType(ctx context.Context, obj *db.File) (string, error) {
	panic(fmt.Errorf("not implemented: MIMEType - MIMEType"))
}

// Bucket is the resolver for the bucket field.
func (r *fileResolver) Bucket(ctx context.Context, obj *db.File) (*db.Bucket, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var bucket db.Bucket
	err = r.DB.NewSelect().Model(&bucket).Where("id = ?", obj.BucketID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &bucket, nil
}

// Parent is the resolver for the parent field.
func (r *fileResolver) Parent(ctx context.Context, obj *db.File) (*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	if !obj.ParentID.Valid {
		return nil, nil
	}

	var parent db.File
	err = r.DB.NewSelect().Model(&parent).Where("id = ?", obj.ParentID.String).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &parent, nil
}

// DeletedAt is the resolver for the deletedAt field.
func (r *fileResolver) DeletedAt(ctx context.Context, obj *db.File) (*time.Time, error) {
	if !obj.DeletedAt.IsZero() {
		return nil, nil
	}

	deletedAt := obj.DeletedAt.Time
	return &deletedAt, nil
}

// Parents is the resolver for the parents field.
func (r *fileResolver) Parents(ctx context.Context, obj *db.File) ([]*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	query := `
WITH RECURSIVE file_parents AS (
    SELECT *, 1 AS level
    FROM files
    WHERE id = ? AND organisation_id = ?
    
    UNION ALL
    
    SELECT f.*, fp.level + 1
    FROM files f
    JOIN file_parents fp ON f.id = fp.parent_id
	WHERE f.organisation_id = ?
)
SELECT file_parents.id, file_parents.name, file_parents.file_type, file_parents.mime_type, file_parents.size, file_parents.bucket_id, file_parents.parent_id, file_parents.organisation_id, file_parents.created_at, file_parents.deleted_at
FROM file_parents
WHERE id <> ?
ORDER BY level DESC;
`

	// query without new lines
	q := strings.ReplaceAll(query, "\n", " ")

	var files []*db.File
	err = r.DB.NewRaw(q, obj.ID, currentUser.OrganisationID, currentUser.OrganisationID, obj.ID).Scan(ctx, &files)
	if err != nil {
		return nil, err
	}

	return files, nil
}

// Files is the resolver for the files field.
func (r *fileResolver) Files(ctx context.Context, obj *db.File) ([]*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var files []*db.File
	err = r.DB.NewSelect().Model(&files).Where("parent_id = ?", obj.ID).Where("organisation_id = ?", currentUser.OrganisationID).Order("name").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return files, nil
}

// UploadFile is the resolver for the uploadFile field.
func (r *mutationResolver) UploadFile(ctx context.Context, input model.FileUploadInput) (*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var file db.File
	file.Name = input.File.Filename
	file.FileType = "blob"
	file.OrganisationID = currentUser.OrganisationID
	file.Size = input.File.Size

	// parse MIME type
	mimeFileType := mime.TypeByExtension(filepath.Ext(input.File.Filename))
	file.MimeType = mimeFileType

	var bucket db.Bucket

	if input.BucketID != nil && len(*input.BucketID) > 0 {
		file.BucketID = *input.BucketID
		bucket.ID = *input.BucketID
	} else {
		err := r.DB.NewSelect().Model(&bucket).Column("id").
			Where("user_id = ?", currentUser.ID).
			Where("organisation_id = ?", currentUser.OrganisationID).
			Where("shared = false").
			Scan(ctx)

		if err != nil && err.Error() == "sql: no rows in result set" {
			// create bucket for user
			bucket.Name = "User Bucket " + currentUser.ID
			bucket.UserID = sql.NullString{String: currentUser.ID, Valid: true}
			bucket.OrganisationID = currentUser.OrganisationID
			err = r.DB.NewInsert().Model(&bucket).Returning("*").Scan(ctx)
			if err != nil {
				return nil, err
			}

			err := r.MinioClient.MakeBucket(ctx, bucket.ID, minio.MakeBucketOptions{})
			if err != nil {
				return nil, err
			}
		} else if err != nil {
			return nil, err
		}

		file.BucketID = bucket.ID
	}

	if input.ParentID != nil && len(*input.ParentID) > 0 {
		file.ParentID = sql.NullString{String: *input.ParentID, Valid: true}
	}

	err = r.DB.NewInsert().Model(&file).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Upload the file to specific bucket with the file id
	_, err = r.MinioClient.PutObject(ctx, bucket.ID, file.ID, input.File.File, input.File.Size, minio.PutObjectOptions{
		ContentType: input.File.ContentType,
	})
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// UploadFiles is the resolver for the uploadFiles field.
func (r *mutationResolver) UploadFiles(ctx context.Context, input model.FileUploadInput) (*model.UploadFilesPayload, error) {
	panic(fmt.Errorf("not implemented: UploadFiles - uploadFiles"))
}

// CreateFolder is the resolver for the createFolder field.
func (r *mutationResolver) CreateFolder(ctx context.Context, input model.CreateFolderInput) (*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var file db.File
	file.Name = input.Name
	file.FileType = "folder"
	file.OrganisationID = currentUser.OrganisationID

	if input.BucketID != nil && len(*input.BucketID) > 0 {
		file.BucketID = *input.BucketID
	} else {
		var bucket db.Bucket
		err := r.DB.NewSelect().Model(&bucket).Column("id").
			Where("user_id = ?", currentUser.ID).
			Where("organisation_id = ?", currentUser.OrganisationID).
			Where("shared = false").
			Scan(ctx)

		if err != nil && err.Error() == "sql: no rows in result set" {
			// create bucket for user
			bucket.Name = "User Bucket " + currentUser.ID
			bucket.UserID = sql.NullString{String: currentUser.ID, Valid: true}
			bucket.OrganisationID = currentUser.OrganisationID
			err = r.DB.NewInsert().Model(&bucket).Returning("*").Scan(ctx)
			if err != nil {
				return nil, err
			}
			err := r.MinioClient.MakeBucket(ctx, bucket.ID, minio.MakeBucketOptions{})
			if err != nil {
				return nil, err
			}
		} else if err != nil {
			return nil, err
		}

		file.BucketID = bucket.ID
	}

	if input.ParentID != nil && len(*input.ParentID) > 0 {
		file.ParentID = sql.NullString{String: *input.ParentID, Valid: true}
	}

	err = r.DB.NewInsert().Model(&file).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// RenameFile is the resolver for the renameFile field.
func (r *mutationResolver) RenameFile(ctx context.Context, input model.RenameFileInput) (*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var file db.File
	err = r.DB.NewSelect().Model(&file).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	file.Name = input.Name
	err = r.DB.NewUpdate().Model(&file).Column("name").WherePK().Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// MoveFile is the resolver for the moveFile field.
func (r *mutationResolver) MoveFile(ctx context.Context, input model.MoveFileInput) (*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	// input.TargetID is a pointer, so we need to check if it's nil
	var targetId string
	if input.TargetID != nil {
		targetId = *input.TargetID
	}

	// cannot move file into itself
	if input.ID == targetId {
		return nil, errors.New("cannot move file into itself")
	}

	var file db.File
	err = r.DB.NewSelect().Model(&file).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	if input.TargetID == nil {
		// move file to root
		file.ParentID = sql.NullString{String: "", Valid: false}
		err = r.DB.NewUpdate().Model(&file).Column("parent_id").WherePK().Returning("*").Scan(ctx)
		if err != nil {
			return nil, err
		}

		return &file, nil
	}

	var bucket db.Bucket
	err = r.DB.NewSelect().Model(&bucket).Where("id = ?", file.BucketID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	var shares []db.Share
	err = r.DB.NewSelect().
		Model(&shares).
		Where("bucket_id = ?", bucket.ID).
		Where("permission = ?", "manager").
		Where("organisation_id = ?", currentUser.OrganisationID).
		Where("shared_with = ?", currentUser.ID).
		Scan(ctx)

	// does user have permission to move file?
	// 1. check if user is owner of bucket
	// 2. check if user has manager permission on bucket
	// if not, return error
	if bucket.UserID.String != currentUser.ID && len(shares) == 0 {
		return nil, errors.New("you don't have permission to move this file")
	}

	var target db.File
	err = r.DB.NewSelect().Model(&target).Where("id = ?", targetId).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// ensure target is a folder
	if target.FileType != "folder" {
		return nil, errors.New("target is not a folder")
	}

	// ensure file and target are in the same bucket
	if target.BucketID != file.BucketID {
		return nil, errors.New("file and target are not in the same bucket")
	}

	// does user have permission to move file to target? check target permission
	if target.BucketID != file.BucketID {
		var targetBucket db.Bucket
		err = r.DB.NewSelect().Model(&targetBucket).Where("id = ?", target.BucketID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
		if err != nil {
			return nil, err
		}

		var targetShares []db.Share
		err = r.DB.NewSelect().
			Model(&targetShares).
			Where("bucket_id = ?", targetBucket.ID).
			Where("permission = ?", "manager").
			Where("organisation_id = ?", currentUser.OrganisationID).
			Where("shared_with = ?", currentUser.ID).
			Scan(ctx)

		// check if user is owner of target bucket or has manager permission
		if targetBucket.UserID.String != currentUser.ID && len(targetShares) == 0 {
			return nil, errors.New("you don't have permission to move this file to target")
		}
	}

	file.ParentID = sql.NullString{String: targetId, Valid: true}
	err = r.DB.NewUpdate().Model(&file).Column("parent_id").WherePK().Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// MoveFiles is the resolver for the moveFiles field.
func (r *mutationResolver) MoveFiles(ctx context.Context, input model.MoveFilesInput) (*model.MoveFilesPayload, error) {
	panic(fmt.Errorf("not implemented: MoveFiles - moveFiles"))
}

// CopyFile is the resolver for the copyFile field.
func (r *mutationResolver) CopyFile(ctx context.Context, input model.CopyFileInput) (*db.File, error) {
	panic(fmt.Errorf("not implemented: CopyFile - copyFile"))
}

// CopyFiles is the resolver for the copyFiles field.
func (r *mutationResolver) CopyFiles(ctx context.Context, input model.CopyFilesInput) (*model.CopyFilesPayload, error) {
	panic(fmt.Errorf("not implemented: CopyFiles - copyFiles"))
}

// DeleteFile is the resolver for the deleteFile field.
func (r *mutationResolver) DeleteFile(ctx context.Context, input model.DeleteFileInput) (*model.DeleteFilePayload, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var file db.File
	err = r.DB.NewSelect().Model(&file).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	_, err = r.DB.NewDelete().Model(&file).WherePK().Returning("*").Exec(ctx)
	if err != nil {
		return nil, err
	}

	// TODO: start background job that moves file to trash (cold storage)
	//err = r.MinioClient.RemoveObject(ctx, file.BucketID, file.ID, minio.RemoveObjectOptions{})
	//if err != nil {
	//	return nil, err
	//}

	return &model.DeleteFilePayload{
		Success: true,
		File:    &file,
	}, nil
}

// DeleteFiles is the resolver for the deleteFiles field.
func (r *mutationResolver) DeleteFiles(ctx context.Context, input model.DeleteFilesInput) (*model.DeleteFilesPayload, error) {
	panic(fmt.Errorf("not implemented: DeleteFiles - deleteFiles"))
}

// PreviewFile is the resolver for the previewFile field.
func (r *mutationResolver) PreviewFile(ctx context.Context, input model.PreviewFileInput) (*model.PreviewFilePayload, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var file db.File
	err = r.DB.NewSelect().Model(&file).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	presignedURL, err := r.MinioClient.PresignedGetObject(ctx, file.BucketID, file.ID, time.Second*60, nil)

	if err != nil {
		return nil, err
	}

	return &model.PreviewFilePayload{URL: presignedURL.String()}, nil
}

// DownloadFile is the resolver for the downloadFile field.
func (r *mutationResolver) DownloadFile(ctx context.Context, input model.DownloadFileInput) (*model.DownloadFilePayload, error) {
	panic(fmt.Errorf("not implemented: DownloadFile - downloadFile"))
}

// DownloadFiles is the resolver for the downloadFiles field.
func (r *mutationResolver) DownloadFiles(ctx context.Context, input model.DownloadFilesInput) (*model.DownloadFilesPayload, error) {
	panic(fmt.Errorf("not implemented: DownloadFiles - downloadFiles"))
}

// AddFileShare is the resolver for the addFileShare field.
func (r *mutationResolver) AddFileShare(ctx context.Context, input model.ShareFileInput) (*db.File, error) {
	panic(fmt.Errorf("not implemented: AddFileShare - addFileShare"))
}

// RemoveFileShare is the resolver for the removeFileShare field.
func (r *mutationResolver) RemoveFileShare(ctx context.Context, input string) (*db.File, error) {
	panic(fmt.Errorf("not implemented: RemoveFileShare - removeFileShare"))
}

// CreateSharedDrive is the resolver for the createSharedDrive field.
func (r *mutationResolver) CreateSharedDrive(ctx context.Context, name string) (*db.Bucket, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	bucket := &db.Bucket{
		Name:           name,
		UserID:         sql.NullString{String: currentUser.ID, Valid: true},
		Shared:         true,
		OrganisationID: currentUser.OrganisationID,
	}

	err = r.DB.NewInsert().Model(bucket).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Create minio bucket
	err = r.MinioClient.MakeBucket(ctx, bucket.ID, minio.MakeBucketOptions{})
	if err != nil {
		return nil, err
	}

	return bucket, nil
}

// RenameSharedDrive is the resolver for the renameSharedDrive field.
func (r *mutationResolver) RenameSharedDrive(ctx context.Context, input model.RenameSharedDriveInput) (*db.Bucket, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var bucket db.Bucket
	err = r.DB.NewSelect().Model(&bucket).Where("id = ?", input.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	if bucket.UserID.String != currentUser.ID {
		var share db.Share
		err = r.DB.NewSelect().Model(&share).Where("bucket_id = ?", input.ID).Where("shared_with = ?", currentUser.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("you don't have permission to rename this bucket")
		}
		if err != nil {
			return nil, err
		}

		if permissionToEnum(share.Permission) != model.FilePermissionManager {
			return nil, errors.New("you don't have permission to rename this bucket")
		}
	}

	bucket.Name = input.Name
	err = r.DB.NewUpdate().Model(&bucket).Column("name").WherePK().Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &bucket, nil
}

// DeleteSharedDrive is the resolver for the deleteSharedDrive field.
func (r *mutationResolver) DeleteSharedDrive(ctx context.Context, id string) (*db.Bucket, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var bucket db.Bucket
	err = r.DB.NewSelect().Model(&bucket).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	if bucket.UserID.String != currentUser.ID {
		return nil, errors.New("you don't have permission to delete this bucket")
	}

	_, err = r.DB.NewDelete().Model(&bucket).WherePK().Returning("*").Exec(ctx)
	if err != nil {
		return nil, err
	}

	return &bucket, nil
}

// CreateShare is the resolver for the createShare field.
func (r *mutationResolver) CreateShare(ctx context.Context, input model.CreateShareInput) (*model.ShareUser, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	// Get user
	var user db.User
	err = r.DB.NewSelect().Model(&user).Where("id = ?", input.User).Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Check if we have fileId or bucketId
	if input.FileID == nil && input.BucketID == nil {
		return nil, errors.New("fileId or bucketId is required")
	}

	share := db.Share{
		SharedWith:     input.User,
		SharedBy:       currentUser.ID,
		OrganisationID: currentUser.OrganisationID,
		Permission:     enumToPermission(input.Permission),
	}

	// Check permission
	// Fetch file if provided
	var file db.File
	if input.FileID != nil {
		share.FileID = *input.FileID
		err = r.DB.NewSelect().Model(&file).
			Where("id = ?", input.FileID).
			Where("organisation_id = ?", currentUser.OrganisationID).
			Scan(ctx)
	} else {
		share.BucketID = *input.BucketID
	}

	// Fetch bucket either way
	var bucket db.Bucket
	query := r.DB.NewSelect().Model(&bucket).
		Where("organisation_id = ?", currentUser.OrganisationID)

	if input.FileID != nil {
		query.Where("id = ?", file.BucketID)
	} else {
		query.Where("id = ?", input.BucketID)
	}

	err = query.Scan(ctx)
	if err != nil {
		return nil, err
	}

	// If he is not owner of bucket, fetch shares
	if bucket.UserID.Valid && bucket.UserID.String != currentUser.ID {
		var share db.Share
		query := r.DB.NewSelect().Model(&share).
			Where("shared_with = ?", currentUser.ID).
			Where("organisation_id = ?", currentUser.OrganisationID)

		if input.FileID != nil {
			query.Where("file_id = ?", input.FileID)
		} else {
			query.Where("bucket_id = ?", input.BucketID)
		}

		err = query.Scan(ctx)
		if err != nil {
			return nil, err
		}

		// Check if he has manage permission
		if permissionToEnum(share.Permission) != model.FilePermissionManager {
			return nil, errors.New("you don't have permission to share this file")
		}
	}

	// Insert share
	err = r.DB.NewInsert().Model(&share).Returning("*").Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &model.ShareUser{
		User:       &user,
		Permission: input.Permission,
	}, nil
}

// EditShare is the resolver for the editShare field.
func (r *mutationResolver) EditShare(ctx context.Context, input model.CreateShareInput) (*model.ShareUser, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	// Get share
	var share db.Share
	query := r.DB.NewSelect().Model(&share).
		Where("shared_with= ?", input.User).
		Where("organisation_id = ?", currentUser.OrganisationID)

	if input.FileID != nil {
		query.Where("file_id = ?", input.FileID)
	} else if input.BucketID != nil {
		query.Where("bucket_id = ?", input.BucketID)
	} else {
		return nil, errors.New("fileId or bucketId is required")
	}

	err = query.Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Check permission
	// Fetch file if provided
	var file db.File
	if input.FileID != nil {
		share.FileID = *input.FileID
		err = r.DB.NewSelect().Model(&file).
			Where("id = ?", input.FileID).
			Where("organisation_id = ?", currentUser.OrganisationID).
			Scan(ctx)
	} else {
		share.BucketID = *input.BucketID
	}

	// Fetch bucket either way
	var bucket db.Bucket
	query = r.DB.NewSelect().Model(&bucket).
		Where("organisation_id = ?", currentUser.OrganisationID)

	if input.FileID != nil {
		query.Where("id = ?", file.BucketID)
	} else {
		query.Where("id = ?", input.BucketID)
	}

	err = query.Scan(ctx)
	if err != nil {
		return nil, err
	}

	// If he is not owner of bucket, fetch shares
	if bucket.UserID.Valid && bucket.UserID.String != currentUser.ID {
		var share db.Share
		query := r.DB.NewSelect().Model(&share).
			Where("shared_with = ?", currentUser.ID).
			Where("organisation_id = ?", currentUser.OrganisationID)

		if input.FileID != nil {
			query.Where("file_id = ?", input.FileID)
		} else {
			query.Where("bucket_id = ?", input.BucketID)
		}

		err = query.Scan(ctx)
		if err != nil {
			return nil, err
		}

		// Check if he has manage permission
		if permissionToEnum(share.Permission) != model.FilePermissionManager {
			return nil, errors.New("you don't have permission to share this file")
		}
	}

	// Update permission
	share.Permission = strings.ToLower(string(input.Permission))
	err = r.DB.NewUpdate().Model(&share).
		WherePK().
		Where("organisation_id = ?", currentUser.OrganisationID).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Get user
	var user db.User
	err = r.DB.NewSelect().Model(&user).
		Where("id = ?", share.SharedWith).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &model.ShareUser{
		User:       &user,
		Permission: input.Permission,
	}, nil
}

// DeleteShare is the resolver for the deleteShare field.
func (r *mutationResolver) DeleteShare(ctx context.Context, input model.DeleteShareInput) (*model.ShareUser, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	// Get share
	var share db.Share
	query := r.DB.NewSelect().Model(&share).
		Where("shared_with = ?", input.User).
		Where("organisation_id = ?", currentUser.OrganisationID)

	if input.FileID != nil {
		query.Where("file_id = ?", input.FileID)
	} else if input.BucketID != nil {
		query.Where("bucket_id = ?", input.BucketID)
	} else {
		return nil, errors.New("fileId or bucketId is required")
	}

	err = query.Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Check permission
	// Fetch file if provided
	var file db.File
	if input.FileID != nil {
		share.FileID = *input.FileID
		err = r.DB.NewSelect().Model(&file).
			Where("id = ?", input.FileID).
			Where("organisation_id = ?", currentUser.OrganisationID).
			Scan(ctx)
	} else {
		share.BucketID = *input.BucketID
	}

	// Fetch bucket either way
	var bucket db.Bucket
	query = r.DB.NewSelect().Model(&bucket).
		Where("organisation_id = ?", currentUser.OrganisationID)

	if input.FileID != nil {
		query.Where("id = ?", file.BucketID)
	} else {
		query.Where("id = ?", input.BucketID)
	}

	err = query.Scan(ctx)
	if err != nil {
		return nil, err
	}

	// If he is not owner of bucket, fetch shares
	if bucket.UserID.Valid && bucket.UserID.String != currentUser.ID {
		var share db.Share
		query := r.DB.NewSelect().Model(&share).
			Where("shared_with = ?", currentUser.ID).
			Where("organisation_id = ?", currentUser.OrganisationID)

		if input.FileID != nil {
			query.Where("file_id = ?", input.FileID)
		} else {
			query.Where("bucket_id = ?", input.BucketID)
		}

		err = query.Scan(ctx)
		if err != nil {
			return nil, err
		}

		// Check if he has manage permission
		if permissionToEnum(share.Permission) != model.FilePermissionManager {
			return nil, errors.New("you don't have permission to share this file")
		}
	}

	// Delete share
	_, err = r.DB.NewDelete().Model(&share).
		WherePK().
		Where("organisation_id = ?", currentUser.OrganisationID).
		Exec(ctx)
	if err != nil {
		return nil, err
	}

	// Get user
	var user db.User
	err = r.DB.NewSelect().Model(&user).
		Where("id = ?", share.SharedWith).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &model.ShareUser{
		User:       &user,
		Permission: permissionToEnum(share.Permission),
	}, nil
}

// Buckets is the resolver for the buckets field.
func (r *queryResolver) Buckets(ctx context.Context, input *model.BucketFilterInput, limit *int, offset *int) (*model.BucketConnection, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	pageLimit, pageOffset := helper.SetPageLimits(limit, offset)

	var buckets []*db.Bucket
	query := r.DB.NewSelect().
		Model(&buckets).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Where("user_id = ?", currentUser.ID).
		Order("name ASC")

	if input != nil {
		if input.Shared != nil {
			query.Where("shared = ?", *input.Shared)
		}
	}

	count, err := query.ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	// if filter shared is true, we also need to get the buckets that are shared with the user
	if input != nil && input.Shared != nil && *input.Shared {
		var shares []*db.Share
		err = r.DB.NewSelect().
			Model(&shares).
			Where("shared_with = ?", currentUser.ID).
			Where("organisation_id = ?", currentUser.OrganisationID).
			Scan(ctx)

		// Get the bucket ids
		var bucketIDs []string
		for _, share := range shares {
			bucketIDs = append(bucketIDs, share.BucketID)
		}
		var sharedBuckets []*db.Bucket
		err = r.DB.NewSelect().
			Model(&sharedBuckets).
			Where("shared = ?", *input.Shared).
			Where("id IN (?)", bun.In(bucketIDs)).
			Where("organisation_id = ?", currentUser.OrganisationID).
			Scan(ctx)
		if err != nil {
			if err != sql.ErrNoRows {
				return nil, err
			}
		}

		buckets = append(buckets, sharedBuckets...)

		// Order by name
		sort.Slice(buckets, func(i, j int) bool {
			return buckets[i].Name < buckets[j].Name
		})
	}

	pageInfo, err := helper.CreatePageInfo(pageLimit, pageOffset, count)
	if err != nil {
		return nil, err
	}

	return &model.BucketConnection{
		Edges:      buckets,
		TotalCount: count,
		PageInfo:   pageInfo,
	}, nil
}

// Bucket is the resolver for the bucket field.
func (r *queryResolver) Bucket(ctx context.Context, id string) (*db.Bucket, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var bucket db.Bucket
	err = r.DB.NewSelect().Model(&bucket).Where("id = ?", id).Where("user_id = ?", currentUser.ID).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			var share db.Share
			err = r.DB.NewSelect().Model(&share).
				Where("bucket_id = ?", id).
				Where("shared_with = ?", currentUser.ID).
				Where("organisation_id = ?", currentUser.OrganisationID).
				Scan(ctx)
			if err != nil {
				return nil, err
			}

			// Fetch the bucket, if share exists
			if &share != nil {
				err = r.DB.NewSelect().Model(&bucket).
					Where("id = ?", share.BucketID).
					Where("organisation_id = ?", currentUser.OrganisationID).
					Scan(ctx)
				if err != nil {
					return nil, err
				}
			}
		} else {
			return nil, err
		}
	}

	return &bucket, nil
}

// File is the resolver for the file field.
func (r *queryResolver) File(ctx context.Context, id string) (*db.File, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var file db.File
	err = r.DB.NewSelect().Model(&file).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &file, nil
}

// Files is the resolver for the files field.
func (r *queryResolver) Files(ctx context.Context, input *model.FilesFilterInput, limit *int, offset *int) (*model.FileConnection, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	pageLimit, pageOffset := helper.SetPageLimits(limit, offset)

	var files []*db.File
	query := r.DB.
		NewSelect().
		Model(&files).
		Where("organisation_id = ?", currentUser.OrganisationID).
		Order("file_type DESC").
		Order("name").
		Limit(pageLimit).
		Offset(pageOffset)

	if input != nil {
		if input.ParentID != nil && len(*input.ParentID) > 0 {
			query.Where("parent_id = ?", *input.ParentID)
		} else {
			query.Where("parent_id IS NULL")
		}
		if input.BucketID != nil && len(*input.BucketID) > 0 {
			var bucket db.Bucket
			err = r.DB.NewSelect().
				Model(&bucket).
				Where("id = ?", *input.BucketID).
				Where("shared = ?", true).
				Where("organisation_id = ?", currentUser.OrganisationID).
				Scan(ctx)
			if err != nil {
				return nil, err
			}

			query.Where("bucket_id = ?", bucket.ID)
		} else if input.MyBucket != nil && *input.MyBucket {
			var bucket db.Bucket
			err = r.DB.NewSelect().Model(&bucket).
				Where("user_id = ?", currentUser.ID).
				Where("organisation_id = ?", currentUser.OrganisationID).
				Where("shared = ?", false).
				Scan(ctx)
			if err != nil {
				return nil, err
			}

			query.Where("bucket_id = ?", bucket.ID)
		} else {
			return nil, fmt.Errorf("bucket_id or my_bucket must be provided")
		}
	}

	count, err := query.ScanAndCount(ctx)
	if err != nil {
		return nil, err
	}

	pageInfo, err := helper.CreatePageInfo(pageLimit, pageOffset, count)
	if err != nil {
		return nil, err
	}

	return &model.FileConnection{
		Edges:      files,
		TotalCount: count,
		PageInfo:   pageInfo,
	}, nil
}

// Shares is the resolver for the shares field.
func (r *queryResolver) Shares(ctx context.Context, input *model.ShareInput) ([]*model.ShareUser, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, nil
	}

	var shares []*db.Share

	query := r.DB.NewSelect().Model(&shares).Where("organisation_id = ?", currentUser.OrganisationID)

	if input.FileID != nil {
		query.Where("file_id = ?", input.FileID)
	} else if input.BucketID != nil {
		query.Where("bucket_id = ?", input.BucketID)
	} else {
		return nil, fmt.Errorf("file_id or bucket_id must be provided")
	}

	err = query.Scan(ctx)
	if err != nil {
		return nil, err
	}

	// Make slice of user IDs
	var userIDs []string
	for _, share := range shares {
		userIDs = append(userIDs, share.SharedWith)
	}

	// Get the users from the shares
	var users []*db.User
	err = r.DB.NewSelect().Model(&users).Where("id in (?)", bun.In(userIDs)).Scan(ctx)
	if err != nil {
		return nil, err
	}

	var shareUsers []*model.ShareUser
	for _, user := range users {
		var shareUser model.ShareUser
		shareUser.User = user

		for _, share := range shares {
			// Make first letter uppercase
			permission := cases.Title(language.Und, cases.NoLower).String(share.Permission)

			if share.SharedWith == user.ID {
				shareUser.Permission = model.FilePermission(permission)
			}
		}
		shareUsers = append(shareUsers, &shareUser)
	}

	return shareUsers, nil
}

// Bucket returns BucketResolver implementation.
func (r *Resolver) Bucket() BucketResolver { return &bucketResolver{r} }

// File returns FileResolver implementation.
func (r *Resolver) File() FileResolver { return &fileResolver{r} }

type bucketResolver struct{ *Resolver }
type fileResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
func enumToPermission(permission model.FilePermission) string {
	return strings.ToLower(string(permission))
}
func permissionToEnum(permission string) model.FilePermission {
	return model.FilePermission(cases.Title(language.Und, cases.NoLower).String(permission))
}
