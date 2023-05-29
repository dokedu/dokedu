package db

import (
	"database/sql"
	"encoding/json"
	"github.com/uptrace/bun"
	"time"

	"github.com/tabbed/pqtype"
)

type CompetenceType string

const (
	CompetenceTypeSubject    CompetenceType = "subject"
	CompetenceTypeGroup      CompetenceType = "group"
	CompetenceTypeCompetence CompetenceType = "competence"
)

type FileType string

const (
	FileTypeBlob   FileType = "blob"
	FileTypeFolder FileType = "folder"
)

type ReportFormat string

const (
	ReportFormatDocx ReportFormat = "docx"
	ReportFormatPdf  ReportFormat = "pdf"
	ReportFormatHtml ReportFormat = "html"
	ReportFormatCsv  ReportFormat = "csv"
	ReportFormatXlsx ReportFormat = "xlsx"
)

type NullReportFormat struct {
	bun.BaseModel

	ReportFormat ReportFormat
	Valid        bool // Valid is true if ReportFormat is not NULL
}

type ReportKind string

const (
	ReportKindReport   ReportKind = "report"
	ReportKindSubjects ReportKind = "subjects"
)

type ReportStatus string

const (
	ReportStatusPending    ReportStatus = "pending"
	ReportStatusProcessing ReportStatus = "processing"
	ReportStatusDone       ReportStatus = "done"
	ReportStatusError      ReportStatus = "error"
)

type UserRole string

const (
	UserRoleOwner    UserRole = "owner"
	UserRoleAdmin    UserRole = "admin"
	UserRoleTeacher  UserRole = "teacher"
	UserRoleEducator UserRole = "educator"
	UserRoleStudent  UserRole = "student"
	UserRoleParent   UserRole = "parent"
)

type Chat struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           sql.NullString `json:"name"`
	OrganisationID string         `json:"organisation_id"`
	UpdatedAt      bun.NullTime   `json:"updated_at"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type ChatMessage struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	ChatID         string       `json:"chat_id"`
	UserID         string       `json:"user_id"`
	Message        string       `json:"message"`
	OrganisationID string       `json:"organisation_id"`
	UpdatedAt      bun.NullTime `json:"updated_at"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
}

type ChatMessageFile struct {
	bun.BaseModel

	ID            string       `bun:",nullzero,pk" json:"id"`
	ChatID        string       `json:"chat_id"`
	UserID        string       `json:"user_id"`
	ChatMessageID string       `json:"message_id"`
	FileID        string       `json:"file_id"`
	UpdatedAt     bun.NullTime `json:"updated_at"`
	CreatedAt     time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt     bun.NullTime `bun:",soft_delete,nullzero"`
}

type ChatMessageReaction struct {
	bun.BaseModel

	ID        string       `bun:",nullzero,pk" json:"id"`
	ChatID    string       `json:"chat_id"`
	UserID    string       `json:"user_id"`
	MessageID string       `json:"message_id"`
	Reaction  string       `json:"reaction"`
	CreatedAt time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt bun.NullTime `bun:",soft_delete,nullzero"`
}

type ChatUser struct {
	bun.BaseModel

	ID             string `bun:",nullzero,pk" json:"id"`
	ChatID         string `json:"chat_id"`
	UserID         string `json:"user_id"`
	OrganisationID string `json:"organisation_id"`
}

type Competence struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           string         `json:"name"`
	CompetenceID   sql.NullString `json:"competence_id"`
	CompetenceType CompetenceType `json:"competence_type"`
	OrganisationID string         `json:"organisation_id"`
	Grades         []int          `bun:",array" json:"grades"`
	Color          sql.NullString `json:"color"`
	CurriculumID   sql.NullString `json:"curriculum_id"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type Entry struct {
	bun.BaseModel

	ID             string          `bun:",nullzero,pk" json:"id"`
	Date           time.Time       `json:"date"`
	Body           json.RawMessage `json:"body"`
	UserID         string          `json:"user_id"`
	OrganisationID string          `json:"organisation_id"`
	CreatedAt      time.Time       `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime    `bun:",soft_delete,nullzero"`
}

type EntryEvent struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	EntryID        string       `json:"entry_id"`
	EventID        string       `json:"event_id"`
	OrganisationID string       `json:"organisation_id"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
}

type EntryFile struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	EntryID        string       `json:"entry_id"`
	FileID         string       `json:"file_id"`
	OrganisationID string       `json:"organisation_id"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `json:"deleted_at"`
}

type EntryTag struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	EntryID        string       `json:"entry_id"`
	TagID          string       `json:"tag_id"`
	OrganisationID string       `json:"organisation_id"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
}

type EntryUser struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	EntryID        string       `json:"entry_id"`
	UserID         string       `json:"user_id"`
	OrganisationID string       `json:"organisation_id"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
}

type EntryUserCompetence struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	Level          int32        `json:"level"`
	UserID         string       `json:"user_id"`
	EntryID        string       `json:"entry_id"`
	CompetenceID   string       `json:"competence_id"`
	OrganisationID string       `json:"organisation_id"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
}

type Event struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	ImageFileID    sql.NullString `json:"image_file_id"`
	OrganisationID string         `json:"organisation_id"`
	Title          string         `json:"title"`
	Body           string         `json:"body"`
	StartsAt       time.Time      `json:"starts_at"`
	EndsAt         time.Time      `json:"ends_at"`
	Recurrence     []string       `json:"recurrence"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type EventCompetence struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	EventID        string       `json:"event_id"`
	CompetenceID   string       `json:"competence_id"`
	OrganisationID string       `json:"organisation_id"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
}

type File struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           string         `json:"name"`
	FileType       FileType       `json:"file_type"`
	OrganisationID string         `json:"organisation_id"`
	ParentID       sql.NullString `json:"parent_id"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type Organisation struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	Name           string       `json:"name"`
	LegalName      string       `json:"legal_name"`
	Website        string       `json:"website"`
	Phone          string       `json:"phone"`
	OwnerID        string       `json:"owner_id"`
	AllowedDomains []string     `json:"allowed_domains"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
}

type Report struct {
	bun.BaseModel

	ID             string                `bun:",nullzero,pk" json:"id"`
	Status         ReportStatus          `json:"status"`
	Format         ReportFormat          `json:"format"`
	Kind           ReportKind            `json:"kind"`
	From           time.Time             `json:"from"`
	To             time.Time             `json:"to"`
	Meta           pqtype.NullRawMessage `json:"meta"`
	FilterTags     []string              `json:"filter_tags"`
	FileID         sql.NullString        `json:"file_id"`
	UserID         string                `json:"user_id"`
	StudentUserID  string                `json:"student_user_id"`
	OrganisationID string                `json:"organisation_id"`
	CreatedAt      time.Time             `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime          `bun:",soft_delete,nullzero"`
}

type SharedDrive struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	Name           string       `json:"name"`
	OrganisationID string       `json:"organisation_id"`
	UpdatedAt      bun.NullTime `json:"updated_at"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
}

type SharedDriveFile struct {
	bun.BaseModel

	ID            string       `bun:",nullzero,pk" json:"id"`
	SharedDriveID string       `json:"shared_drive_id"`
	FileID        string       `json:"file_id"`
	UpdatedAt     bun.NullTime `json:"updated_at"`
	CreatedAt     time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt     bun.NullTime `bun:",soft_delete,nullzero"`
}

type SharedDriveUser struct {
	bun.BaseModel

	ID            string       `bun:",nullzero,pk" json:"id"`
	SharedDriveID string       `json:"shared_drive_id"`
	UserID        string       `json:"user_id"`
	UpdatedAt     bun.NullTime `json:"updated_at"`
	CreatedAt     time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt     bun.NullTime `bun:",soft_delete,nullzero"`
}

type Tag struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           string         `json:"name"`
	Color          sql.NullString `json:"color"`
	OrganisationID string         `json:"organisation_id"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type User struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Role           UserRole       `json:"role"`
	OrganisationID string         `json:"organisation_id"`
	FirstName      string         `json:"first_name"`
	LastName       string         `json:"last_name"`
	Email          string         `json:"email"`
	Password       sql.NullString `json:"password"`
	AvatarFileID   sql.NullString `json:"avatar_file_id"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type UserDriveFile struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	OrganisationID string       `json:"organisation_id"`
	UserID         string       `json:"user_id"`
	FileID         string       `json:"file_id"`
	UpdatedAt      bun.NullTime `json:"updated_at"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
}

type UserStudent struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	UserID         string         `json:"user_id"`
	OrganisationID string         `json:"organisation_id"`
	LeftAt         bun.NullTime   `json:"left_at"`
	Grade          int32          `json:"grade"`
	Birthday       bun.NullTime   `json:"birthday"`
	Nationality    sql.NullString `json:"nationality"`
	Comments       sql.NullString `json:"comments"`
	JoinedAt       bun.NullTime   `json:"joined_at"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}
