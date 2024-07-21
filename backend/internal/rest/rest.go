package rest

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/dokedu/dokedu/backend/internal/db"
	"github.com/dokedu/dokedu/backend/internal/middleware"
	"github.com/dokedu/dokedu/backend/internal/msg"
	"github.com/labstack/echo/v4"
	nanoid "github.com/matoous/go-nanoid/v2"
	"github.com/uptrace/bun"
	"golang.org/x/crypto/bcrypt"
	"log/slog"
	"net/http"
	"strings"
	"time"
)

type Config struct {
	DB *bun.DB
}

func NewRESTServer(cfg Config) *Config {
	return &Config{
		DB: cfg.DB,
	}
}

type ObjectType string

const (
	ObjectTypeEntry     ObjectType = "entry"
	ObjectTypeUser      ObjectType = "user"
	ObjectTypeTag       ObjectType = "tag"
	ObjectTypeEntryTag  ObjectType = "entry_tag"
	ObjectTypeEntryUser ObjectType = "entry_user"
)

type SyncEntryDataItem struct {
	ObjectID   string          `json:"object_id"`
	ObjectType ObjectType      `json:"object_type"`
	Data       json.RawMessage `json:"data"`
}

type SyncEntryRequest struct {
	Data []SyncEntryDataItem `json:"data"`
}

type SyncEntryResponseData struct {
	FailedTransactionIDs     []string `json:"failed_transaction_ids"`
	SuccessfulTransactionIDs []string `json:"successful_transaction_ids"`
}

type SyncEntryResponse struct {
	Data SyncEntryResponseData `json:"data"`
}

func (s *Config) entryTransactionHandler(ctx context.Context, object json.RawMessage) error {
	var entry Entry
	err := json.Unmarshal(object, &entry)
	if err != nil {
		return err
	}

	// Fetch existing entry
	existing, err := s.findEntryById(ctx, entry.ID, nil)
	if err != nil {
		return err
	}

	// If the entry is not found, create a new one
	if existing == nil {
		err = s.createEntry(ctx, entry)
		if err != nil {
			return err
		}
	}

	// If the entry already exists, update it
	if existing != nil {
		err = s.updateEntry(ctx, entry, existing)
		if err != nil {
			return err
		}
	}

	return nil
}

func (s *Config) SyncEntries(c echo.Context) error {
	ctx := c.Request().Context()

	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return c.String(http.StatusUnauthorized, "invalid token")
	}

	slog.Info("syncing entries", "user_id", currentUser.ID)

	requestPayload := new(SyncEntryRequest)
	if err := c.Bind(requestPayload); err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	data := requestPayload.Data

	var successTransactionIDs []string
	var failedTransactionIDs []string

	for _, item := range data {
		switch item.ObjectType {
		case ObjectTypeEntry:
			err = s.entryTransactionHandler(ctx, item.Data)
			if err != nil {
				failedTransactionIDs = append(failedTransactionIDs, item.ObjectID)
			} else {
				successTransactionIDs = append(successTransactionIDs, item.ObjectID)
			}
			break
		case ObjectTypeEntryTag:
			// TODO: handle entry tag
			break
		case ObjectTypeEntryUser:
			// TODO: handle entry user
			break
		case ObjectTypeUser:
			// TODO: handle user
			break
		case ObjectTypeTag:
			// TODO: handle tag
			break
		default:
			slog.Error("unknown object type", "object_type", item.ObjectType)
			break
		}
	}

	response := SyncEntryResponse{
		Data: SyncEntryResponseData{
			SuccessfulTransactionIDs: successTransactionIDs,
			FailedTransactionIDs:     failedTransactionIDs,
		},
	}

	return c.JSON(http.StatusOK, response)
}

func (s *Config) findEntryById(ctx context.Context, id string, existing []*db.Entry) (*db.Entry, error) {
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return nil, err
	}

	var entry db.Entry
	err = s.DB.NewSelect().Model(&entry).Where("id = ?", id).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	return &entry, nil
}

func (s *Config) createEntry(ctx context.Context, entry Entry) error {
	return nil
}

func (s *Config) updateEntry(ctx context.Context, entry Entry, newEntry *db.Entry) error {
	// Ensure the remote entry is newer than the local one by comparing the updatedAt field
	if newEntry.UpdatedAt.After(entry.UpdatedAt) {
		slog.Info("skipping update of entry", "id", entry.ID)
		return nil
	}

	// Update the local entry
	_, err := s.DB.NewUpdate().Model(newEntry).Set("updated_at = ?", entry.UpdatedAt).Where("id = ?", newEntry.ID).Exec(ctx)
	if err != nil {
		return err
	}

	return nil
}

type SignInResponseData struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type SignInResponse struct {
	Data SignInResponseData `json:"data"`
}

type SignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Config) SignIn(c echo.Context) error {
	ctx := c.Request().Context()

	payload := new(SignInRequest)
	if err := c.Bind(payload); err != nil {
		return c.String(http.StatusBadRequest, "bad request")
	}

	var user db.User
	err := s.DB.NewSelect().Model(&user).Where("email = ?", strings.ToLower(payload.Email)).Scan(ctx)
	if err != nil {
		return c.String(http.StatusUnauthorized, msg.ErrInvalidEmailOrPassword.Error())
	}

	var organisation db.Organisation
	err = s.DB.NewSelect().Model(&organisation).Where("id = ?", user.OrganisationID).Scan(ctx)
	if err != nil {
		return c.String(http.StatusUnauthorized, msg.ErrInvalidEmailOrPassword.Error())
	}

	// user.Password is a sql.NullString, so we need to check if it is valid
	if !user.Password.Valid {
		return c.String(http.StatusUnauthorized, msg.ErrInvalidEmailOrPassword.Error())
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password.String), []byte(payload.Password)); err != nil {
		return c.String(http.StatusUnauthorized, msg.ErrInvalidEmailOrPassword.Error())
	}

	// Generate a new token
	token, err := nanoid.New(32)
	if err != nil {
		return c.String(http.StatusUnauthorized, errors.New("unable to generate a token").Error())
	}

	// Save the token in the database
	session := db.Session{
		UserID: user.ID,
		Token:  token,
	}

	_, err = s.DB.NewInsert().Model(&session).Exec(ctx)
	if err != nil {
		return c.String(http.StatusUnauthorized, errors.New("unable to generate a token").Error())
	}

	response := SignInResponse{
		Data: SignInResponseData{
			Token: token,
			User: User{
				ID:        user.ID,
				Role:      user.Role,
				FirstName: user.FirstName,
				LastName:  user.LastName,
				Email:     user.Email.String,
			},
		},
	}

	return c.JSON(http.StatusOK, response)
}

type User struct {
	ID        string      `json:"id"`
	Role      db.UserRole `json:"role"`
	FirstName string      `json:"first_name"`
	LastName  string      `json:"last_name"`
	Email     string      `json:"email"`
}

type Entry struct {
	ID     string `json:"id"`
	Date   string `json:"date"`
	Body   string `json:"body"`
	UserID string `json:"user_id"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}

type Tag struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

type EntryUser struct {
	EntryID   string     `json:"entry_id"`
	UserID    string     `json:"user_id"`
	CreatedAt time.Time  `json:"created_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}

type EntryTag struct {
	EntryID   string     `json:"entry_id"`
	TagID     string     `json:"tag_id"`
	CreatedAt time.Time  `json:"created_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}

type SyncPullData struct {
	Entries    []Entry     `json:"entries"`
	EntryTags  []EntryTag  `json:"entry_tags"`
	EntryUsers []EntryUser `json:"entry_users"`

	Users []User `json:"users"`
	Tags  []Tag  `json:"tags"`
}

type SyncPullResponse struct {
	Data SyncPullData `json:"data"`
}

func (s *Config) SyncPull(c echo.Context) error {
	ctx := c.Request().Context()

	// 1. Authenticate the user
	currentUser, err := middleware.GetUser(ctx)
	if err != nil {
		return c.String(http.StatusUnauthorized, "invalid token")
	}

	// 2. Fetch the user's data from the database
	responseUsers, err := s.pullUsers(c, err, currentUser, ctx)
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to pull users")
	}

	responseEntries, err := s.pullEntries(c, err, currentUser, ctx)
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to pull entries")
	}

	// 3. Send the data to the client
	response := SyncPullResponse{
		Data: SyncPullData{
			Users:   responseUsers,
			Entries: responseEntries,
		},
	}

	return c.JSON(http.StatusOK, response)
}

func (s *Config) pullEntries(c echo.Context, err error, currentUser *middleware.UserContext, ctx context.Context) ([]Entry, error) {
	var entries []*db.Entry
	err = s.DB.NewSelect().Model(&entries).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	var responseEntries []Entry
	for _, entry := range entries {
		res := Entry{
			ID:     entry.ID,
			Date:   entry.Date,
			Body:   entry.Body,
			UserID: entry.UserID,

			CreatedAt: entry.CreatedAt,
			UpdatedAt: entry.UpdatedAt,
		}

		if !entry.DeletedAt.IsZero() {
			res.DeletedAt = &entry.DeletedAt.Time
		}

		responseEntries = append(responseEntries, res)
	}
	return responseEntries, nil
}

func (s *Config) pullUsers(c echo.Context, err error, currentUser *middleware.UserContext, ctx context.Context) ([]User, error) {
	var users []*db.User
	err = s.DB.NewSelect().Model(&users).Where("organisation_id = ?", currentUser.OrganisationID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	var responseUsers []User
	for _, user := range users {
		res := User{
			ID:        user.ID,
			Role:      user.Role,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email.String,
		}

		responseUsers = append(responseUsers, res)
	}
	return responseUsers, nil
}
