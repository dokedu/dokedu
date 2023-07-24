package db

import (
	"database/sql"
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
	ReportKindEntries            ReportKind = "entries"
	ReportKindSubjects           ReportKind = "subjects"
	ReportKindCompetences        ReportKind = "competences"
	ReportKindLearnedCompetences ReportKind = "learned_competences"
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

type UserLanguage string

const (
	UserLangEn UserLanguage = "en"
	UserLangDe UserLanguage = "de"
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
	SortOrder      int            `json:"sort_order"`
	CurriculumID   sql.NullString `json:"curriculum_id"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type CompetenceNoNullString struct {
	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           string         `json:"name"`
	CompetenceID   string         `json:"competence_id"`
	CompetenceType CompetenceType `json:"competence_type"`
	OrganisationID string         `json:"organisation_id"`
	Grades         []int          `bun:",array" json:"grades"`
	Color          string         `json:"color"`
	SortOrder      int            `json:"sort_order"`
	CurriculumID   string         `json:"curriculum_id"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      string         `bun:",soft_delete,nullzero"`
}

type Entry struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	Date           string       `json:"date"`
	Body           string       `json:"body"`
	UserID         string       `json:"user_id"`
	OrganisationID string       `json:"organisation_id"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime `bun:",soft_delete,nullzero"`
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

type UserCompetence struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Level          int            `json:"level"`
	UserID         string         `json:"user_id"`
	EntryID        sql.NullString `json:"entry_id,omitempty"`
	CompetenceID   string         `json:"competence_id"`
	OrganisationID string         `json:"organisation_id"`
	CreatedBy      sql.NullString `json:"created_by,omitempty"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
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
	Recurrence     []string       `bun:",array" json:"recurrence"`
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

type Bucket struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           string         `json:"name"`
	UserID         sql.NullString `json:"user_id"`
	Shared         bool           `json:"shared"`
	OrganisationID string         `json:"organisation_id"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type File struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	Name           string         `json:"name"`
	FileType       FileType       `json:"file_type"`
	MimeType       string         `json:"mime_type"`
	Size           int64          `json:"size"`
	BucketID       string         `bun:",notnull" json:"bucket_id"`
	ParentID       sql.NullString `bun:",nullzero" json:"parent_id"`
	OrganisationID string         `bun:",notnull" json:"organisation_id"`
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
	AllowedDomains []string     `bun:",array" json:"allowed_domains"`
	EnabledApps    []string     `bun:",array" json:"enabled_apps"`
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
	FilterTags     []string              `bun:",array" json:"filter_tags"`
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
	Email          sql.NullString `bun:",nullzero" json:"email"`
	Password       sql.NullString `json:"password"`
	RecoveryToken  sql.NullString `json:"recovery_token"`
	RecoverySentAt bun.NullTime   `json:"recovery_sent_at"`
	AvatarFileID   sql.NullString `json:"avatar_file_id"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero" json:"deleted_at"`
	Language       UserLanguage   `bun:",nullzero" json:"language"`
}

type UserFiles struct {
	bun.BaseModel

	ID             string       `bun:",nullzero,pk" json:"id"`
	OrganisationID string       `json:"organisation_id"`
	UserID         string       `json:"user_id"`
	FileID         string       `json:"file_id"`
	UpdatedAt      bun.NullTime `json:"updated_at"`
	CreatedAt      time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
}

type UserStudent struct {
	bun.BaseModel

	ID             string         `bun:",nullzero,pk" json:"id"`
	UserID         string         `json:"user_id"`
	OrganisationID string         `json:"organisation_id"`
	LeftAt         bun.NullTime   `bun:",nullzero" json:"left_at"`
	Grade          int32          `json:"grade"`
	Birthday       bun.NullTime   `bun:",nullzero" json:"birthday"`
	Nationality    sql.NullString `json:"nationality"`
	Comments       sql.NullString `json:"comments"`
	JoinedAt       bun.NullTime   `bun:",nullzero" json:"joined_at"`
	CreatedAt      time.Time      `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt      bun.NullTime   `bun:",soft_delete,nullzero"`
}

type Session struct {
	bun.BaseModel

	ID        string       `bun:",nullzero,pk" json:"id"`
	UserID    string       `json:"user_id"`
	Token     string       `json:"token"`
	CreatedAt time.Time    `bun:",nullzero,notnull,default:now()" json:"created_at"`
	DeletedAt bun.NullTime `bun:",soft_delete,nullzero"`
}

type EmailAccountType string

const (
	EmailAccountTypeIndividual EmailAccountType = "individual"
	EmailAccountTypeGroup      EmailAccountType = "group"
)

type EmailAccount struct {
	bun.BaseModel

	ID             string           `bun:",nullzero,pk" json:"id"`
	Name           string           `json:"name"`
	Secret         string           `json:"secret"`
	Description    string           `json:"description"`
	Type           EmailAccountType `bun:",notnull" json:"type"`
	Quota          int              `bun:",default:0" json:"quota"`
	Active         bool             `bun:",default:true" json:"active"`
	UserID         sql.NullString   `json:"user_id"`
	OrganisationID string           `json:"organisation_id"`
	CreatedAt      time.Time        `bun:",nullzero,notnull,default:now()" json:"created_at"`
}

type EmailGroupMember struct {
	bun.BaseModel

	ID             string    `bun:",nullzero,pk" json:"id"`
	Name           string    `json:"name"`
	MemberOf       string    `json:"member_of"`
	OrganisationID string    `json:"organisation_id"`
	CreatedAt      time.Time `bun:",nullzero,notnull,default:now()" json:"created_at"`
}

type EmailType string

const (
	EmailTypePrimary EmailType = "primary"
	EmailTypeAlias   EmailType = "alias"
	EmailTypeList    EmailType = "list"
)

type Email struct {
	bun.BaseModel

	ID             string    `bun:",nullzero,pk" json:"id"`
	Name           string    `json:"name"`
	Address        string    `json:"address"`
	Type           EmailType `json:"type"`
	OrganisationID string    `json:"organisation_id"`
	CreatedAt      time.Time `bun:",nullzero,notnull,default:now()" json:"created_at"`
}

type EmailForwarding struct {
	bun.BaseModel

	ID             string    `bun:",nullzero,pk" json:"id"`
	Origin         string    `json:"origin"`
	Target         string    `json:"target"`
	OrganisationID string    `json:"organisation_id"`
	CreatedAt      time.Time `bun:",nullzero,notnull,default:now()" json:"created_at"`
}

type Domain struct {
	bun.BaseModel

	ID             string    `bun:",nullzero,pk" json:"id"`
	Name           string    `json:"name"`
	OrganisationID string    `json:"organisation_id"`
	CreatedAt      time.Time `bun:",nullzero,notnull,default:now()" json:"created_at"`
}
