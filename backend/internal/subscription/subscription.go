package subscription

import (
	"context"
	"github.com/dokedu/dokedu/backend/internal/database"
	"github.com/dokedu/dokedu/backend/internal/database/db"
	"sync"
)

type Handler struct {
	mutex       sync.Mutex
	db          *database.DB
	UserChannel map[string][]chan *db.ChatMessage
}

func NewHandler(database *database.DB) *Handler {
	return &Handler{
		UserChannel: make(map[string][]chan *db.ChatMessage),
		db:          database,
	}
}

func (h *Handler) AddUserChannel(userId string) error {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	userChannel := make(chan *db.ChatMessage)
	h.UserChannel[userId] = append(h.UserChannel[userId], userChannel)

	return nil
}

func (h *Handler) RemoveChatChannel(userId string, userChannel chan *db.ChatMessage) error {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	if channels, ok := h.UserChannel[userId]; ok {
		for i, c := range channels {
			if c == userChannel {
				h.UserChannel[userId] = append(channels[:i], channels[i+1:]...)
				close(userChannel)
				break
			}
		}
	}

	return nil
}

func (h *Handler) PublishMessage(message *db.ChatMessage) error {
	ctx := context.Background()

	chatUsers, err := h.db.ChatUserByChatId(ctx, message.ChatID)
	if err != nil {
		return err
	}

	for _, chatUser := range chatUsers {
		h.PublishMessageToUser(message, chatUser.UserID)
	}

	return nil
}

func (h *Handler) PublishMessageToUser(message *db.ChatMessage, id string) {
	h.mutex.Lock()
	channels, ok := h.UserChannel[id]
	h.mutex.Unlock() // Unlock as soon as possible, assuming sending on channels is safe concurrently

	if ok {
		for _, userChannel := range channels {
			userChannel <- message
		}
	}
}
