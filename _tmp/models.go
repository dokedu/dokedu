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
	Organisation   *Organisation  `bun:"-,rel:belongs-to"`
	UpdatedAt      bun.NullTime   `json:"updated_at"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:current_timestamp" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`

	ChatUsers    []ChatUser    `bun:"rel:has-many"`
	ChatMessages []ChatMessage `bun:"rel:has-many"`
}

type ChatMessage struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	ChatID         string        `json:"chat_id"`
	Chat           *Chat         `bun:"-,rel:belongs-to"`
	UserID         string        `json:"user_id"`
	User           *User         `bun:"-,rel:belongs-to"`
	Message        string        `json:"message"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`
	UpdatedAt      bun.NullTime  `json:"updated_at"`
	CreatedAt      time.Time     `json:"created_at"`
	DeletedAt      bun.NullTime  `bun:",soft_delete,nullzero"`

	ChatMessageFiles     []ChatMessageFile     `bun:"rel:has-many"`
	ChatMessageReactions []ChatMessageReaction `bun:"rel:has-many"`
}

type ChatMessageFile struct {
	bun.BaseModel

	ID            string       `bun:",nullzero,pk" json:"id"`
	ChatID        string       `json:"chat_id"`
	Chat          *Chat        `bun:"-,rel:belongs-to"`
	UserID        string       `json:"user_id"`
	User          *User        `bun:"-,rel:belongs-to"`
	ChatMessageID string       `json:"message_id"`
	ChatMessage   *ChatMessage `bun:"-,rel:belongs-to"`
	FileID        string       `json:"file_id"`
	File          *File        `bun:"-,rel:belongs-to"`
	UpdatedAt     bun.NullTime `json:"updated_at"`
	CreatedAt     time.Time    `json:"created_at"`
	DeletedAt     bun.NullTime `bun:",soft_delete,nullzero"`
}

type ChatMessageReaction struct {
	bun.BaseModel

	ID        string       `bun:",nullzero,pk" json:"id"`
	ChatID    string       `json:"chat_id"`
	Chat      *Chat        `bun:"-,rel:belongs-to"`
	UserID    string       `json:"user_id"`
	User      *User        `bun:"-,rel:belongs-to"`
	MessageID string       `json:"message_id"`
	Message   *ChatMessage `bun:"-,rel:belongs-to"`
	Reaction  string       `json:"reaction"`
	CreatedAt time.Time    `json:"created_at"`
	DeletedAt bun.NullTime `bun:",soft_delete,nullzero"`
}

type ChatUser struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	ChatID         string        `json:"chat_id"`
	Chat           *Chat         `bun:"-,rel:belongs-to"`
	UserID         string        `json:"user_id"`
	User           *User         `bun:"-,rel:belongs-to"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`

	ChatMessages []ChatMessage `bun:"rel:has-many"`
}

type Competence struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           string         `json:"name"`
	CompetenceID   sql.NullString `json:"competence_id"`
	Competence     *Competence    `bun:"-,rel:belongs-to"`
	CompetenceType CompetenceType `json:"competence_type"`
	OrganisationID string         `json:"organisation_id"`
	Organisation   *Organisation  `bun:"-,rel:belongs-to"`
	Grades         []int          `bun:",array" json:"grades"`
	Color          sql.NullString `json:"color"`
	CurriculumID   sql.NullString `json:"curriculum_id"`
	CreatedAt      time.Time      `json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`

	Competences []Competence `bun:"rel:has-many"`
}

type Entry struct {
	bun.BaseModel

	ID             string          `bun:",nullzero,pk" json:"id"`
	Date           time.Time       `json:"date"`
	Body           json.RawMessage `json:"body"`
	UserID         string          `json:"user_id"`
	User           *User           `bun:"-,rel:belongs-to"`
	OrganisationID string          `json:"organisation_id"`
	Organisation   *Organisation   `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time       `json:"created_at"`
	DeletedAt      bun.NullTime    `bun:",soft_delete,nullzero"`

	EntryEvents          []EntryEvent          `bun:"rel:has-many"`
	EntryFiles           []EntryFile           `bun:"rel:has-many"`
	EntryTags            []EntryTag            `bun:"rel:has-many"`
	EntryUsers           []EntryUser           `bun:"rel:has-many"`
	EntryUserCompetences []EntryUserCompetence `bun:"rel:has-many"`
}

type EntryEvent struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	EntryID        string        `json:"entry_id"`
	Entry          *Entry        `bun:"-,rel:belongs-to"`
	EventID        string        `json:"event_id"`
	Event          *Event        `bun:"-,rel:belongs-to"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time     `json:"created_at"`
	DeletedAt      bun.NullTime  `bun:",soft_delete,nullzero"`
}

type EntryFile struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	EntryID        string        `json:"entry_id"`
	Entry          *Entry        `bun:"-,rel:belongs-to"`
	FileID         string        `json:"file_id"`
	File           *File         `bun:"-,rel:belongs-to"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time     `json:"created_at"`
	DeletedAt      bun.NullTime  `json:"deleted_at"`
}

type EntryTag struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	EntryID        string        `json:"entry_id"`
	Entry          *Entry        `bun:"-,rel:belongs-to"`
	TagID          string        `json:"tag_id"`
	Tag            *Tag          `bun:"-,rel:belongs-to"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time     `json:"created_at"`
	DeletedAt      bun.NullTime  `bun:",soft_delete,nullzero"`
}

type EntryUser struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	EntryID        string        `json:"entry_id"`
	Entry          *Entry        `bun:"-,rel:belongs-to"`
	UserID         string        `json:"user_id"`
	User           *User         `bun:"-,rel:belongs-to"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time     `json:"created_at"`
	DeletedAt      bun.NullTime  `bun:",soft_delete,nullzero"`
}

type EntryUserCompetence struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	Level          int32         `json:"level"`
	UserID         string        `json:"user_id"`
	User           *User         `bun:"-,rel:belongs-to"`
	EntryID        string        `json:"entry_id"`
	Entry          *Entry        `bun:"-,rel:belongs-to"`
	CompetenceID   string        `json:"competence_id"`
	Competence     *Competence   `bun:"-,rel:belongs-to"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time     `json:"created_at"`
	DeletedAt      bun.NullTime  `bun:",soft_delete,nullzero"`
}

type Event struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	ImageFileID    sql.NullString `json:"image_file_id"`
	File           *File          `bun:"-,rel:belongs-to"`
	OrganisationID string         `json:"organisation_id"`
	Organisation   *Organisation  `bun:"-,rel:belongs-to"`
	Title          string         `json:"title"`
	Body           string         `json:"body"`
	StartsAt       time.Time      `json:"starts_at"`
	EndsAt         time.Time      `json:"ends_at"`
	Recurrence     []string       `json:"recurrence"`
	CreatedAt      time.Time      `json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`

	EventCompetences []EventCompetence `bun:"rel:has-many"`
}

type EventCompetence struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	EventID        string        `json:"event_id"`
	Event          *Event        `bun:"-,rel:belongs-to"`
	CompetenceID   string        `json:"competence_id"`
	Competence     *Competence   `bun:"-,rel:belongs-to"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time     `json:"created_at"`
	DeletedAt      bun.NullTime  `bun:",soft_delete,nullzero"`
}

type File struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           string         `json:"name"`
	FileType       FileType       `json:"file_type"`
	OrganisationID string         `json:"organisation_id"`
	Organisation   *Organisation  `bun:"-,rel:belongs-to"`
	ParentID       sql.NullString `json:"parent_id"`
	Parent         *File          `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time      `json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`

	Files []File `bun:"rel:has-many"`
}

type Organisation struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	Name           string       `json:"name"`
	LegalName      string       `json:"legal_name"`
	Website        string       `json:"website"`
	Phone          string       `json:"phone"`
	OwnerID        string       `json:"owner_id"`
	Owner          *User        `bun:"-,rel:belongs-to"`
	AllowedDomains []string     `json:"allowed_domains"`
	CreatedAt      time.Time    `json:"created_at"`
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
	File           *File                 `bun:"-,rel:belongs-to"`
	UserID         string                `json:"user_id"`
	User           *User                 `bun:"-,rel:belongs-to"`
	StudentUserID  string                `json:"student_user_id"`
	StudentUser    *User                 `bun:"-,rel:belongs-to"`
	OrganisationID string                `json:"organisation_id"`
	Organisation   *Organisation         `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time             `json:"created_at"`
	DeletedAt      bun.NullTime          `bun:",soft_delete,nullzero"`
}

type SharedDrive struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	Name           string        `json:"name"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`
	UpdatedAt      bun.NullTime  `json:"updated_at"`
	CreatedAt      time.Time     `json:"created_at"`
	DeletedAt      bun.NullTime  `bun:",soft_delete,nullzero"`

	SharedDriveFiles []SharedDriveFile `bun:"rel:has-many"`
	SharedDriveUsers []SharedDriveUser `bun:"rel:has-many"`
}

type SharedDriveFile struct {
	bun.BaseModel

	ID            string       `bun:",nullzero,pk" json:"id"`
	SharedDriveID string       `json:"shared_drive_id"`
	SharedDrive   *SharedDrive `bun:"-,rel:belongs-to"`
	FileID        string       `json:"file_id"`
	File          *File        `bun:"-,rel:belongs-to"`
	UpdatedAt     bun.NullTime `json:"updated_at"`
	CreatedAt     time.Time    `json:"created_at"`
	DeletedAt     bun.NullTime `bun:",soft_delete,nullzero"`

	Files []File `bun:"rel:has-many"`
}

type SharedDriveUser struct {
	bun.BaseModel

	ID            string       `bun:",nullzero,pk" json:"id"`
	SharedDriveID string       `json:"shared_drive_id"`
	SharedDrive   *SharedDrive `bun:"-,rel:belongs-to"`
	UserID        string       `json:"user_id"`
	User          *User        `bun:"-,rel:belongs-to"`
	UpdatedAt     bun.NullTime `json:"updated_at"`
	CreatedAt     time.Time    `json:"created_at"`
	DeletedAt     bun.NullTime `bun:",soft_delete,nullzero"`
}

type Tag struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           string         `json:"name"`
	Color          sql.NullString `json:"color"`
	OrganisationID string         `json:"organisation_id"`
	Organisation   *Organisation  `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time      `json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type User struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Role           UserRole       `json:"role"`
	OrganisationID string         `json:"organisation_id"`
	Organisation   *Organisation  `bun:"-,rel:belongs-to"`
	FirstName      string         `json:"first_name"`
	LastName       string         `json:"last_name"`
	Email          string         `json:"email"`
	Password       sql.NullString `json:"password"`
	AvatarFileID   sql.NullString `json:"avatar_file_id"`
	AvatarFile     *File          `bun:"-,rel:belongs-to"`
	CreatedAt      time.Time      `json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type UserDriveFile struct {
	bun.BaseModel

	ID             string        `bun:",nullzero,pk" json:"id"`
	OrganisationID string        `json:"organisation_id"`
	Organisation   *Organisation `bun:"-,rel:belongs-to"`
	UserID         string        `json:"user_id"`
	User           *User         `bun:"-,rel:belongs-to"`
	FileID         string        `json:"file_id"`
	File           *File         `bun:"-,rel:belongs-to"`
	UpdatedAt      bun.NullTime  `json:"updated_at"`
	CreatedAt      time.Time     `json:"created_at"`
	DeletedAt      bun.NullTime  `bun:",soft_delete,nullzero"`
}

type UserStudent struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	UserID         string         `json:"user_id"`
	User           *User          `bun:"-,rel:belongs-to"`
	OrganisationID string         `json:"organisation_id"`
	Organisation   *Organisation  `bun:"-,rel:belongs-to"`
	LeftAt         bun.NullTime   `json:"left_at"`
	Grade          int32          `json:"grade"`
	Birthday       bun.NullTime   `json:"birthday"`
	Nationality    sql.NullString `json:"nationality"`
	Comments       sql.NullString `json:"comments"`
	JoinedAt       bun.NullTime   `json:"joined_at"`
	CreatedAt      time.Time      `json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}
