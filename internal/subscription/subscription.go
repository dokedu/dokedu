package subscription

import (
	"example/internal/db"
	"sync"
)

type Handler struct {
	mutex     sync.Mutex
	ChatRooms map[string][]chan *db.ChatMessage
}

func NewHandler() *Handler {
	return &Handler{
		ChatRooms: make(map[string][]chan *db.ChatMessage),
	}
}

func (h *Handler) AddChatChannel(chatId string) error {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	userChannel := make(chan *db.ChatMessage)
	h.ChatRooms[chatId] = append(h.ChatRooms[chatId], userChannel)

	return nil
}

func (h *Handler) RemoveChatChannel(chatId string, userChannel chan *db.ChatMessage) error {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	if channels, ok := h.ChatRooms[chatId]; ok {
		for i, c := range channels {
			if c == userChannel {
				h.ChatRooms[chatId] = append(channels[:i], channels[i+1:]...)
				close(userChannel)
				break
			}
		}
	}

	return nil
}

func (h *Handler) PublishMessage(message *db.ChatMessage) error {
	h.mutex.Lock()
	channels, ok := h.ChatRooms[message.ChatID]
	h.mutex.Unlock() // Unlock as soon as possible, assuming sending on channels is safe concurrently

	if ok {
		for _, userChannel := range channels {
			userChannel <- message
		}
	}

	return nil
}
