package chat_message_processor

import (
	"context"
	"database/sql"
	"errors"
	"github.com/dokedu/dokedu/backend/internal/database"
	"io"
	"log"
	"os"

	"github.com/dokedu/dokedu/backend/internal/database/db"
	"github.com/dokedu/dokedu/backend/internal/subscription"

	"github.com/sashabaranov/go-openai"
)

type ChatMessageProcessor struct {
	DB                  *database.DB
	ChatChannel         chan *db.Chat
	subscriptionHandler *subscription.Handler
}

func NewChatMessageProcessor(db *database.DB, subscriptionHandler *subscription.Handler, chatChan chan *db.Chat) *ChatMessageProcessor {
	return &ChatMessageProcessor{
		DB:                  db,
		subscriptionHandler: subscriptionHandler,
		ChatChannel:         chatChan,
	}
}

func (a *ChatMessageProcessor) NewMessage(msg db.ChatMessage) error {
	ctx := context.Background()

	chat, err := a.DB.ChatById(ctx, msg.ChatID)
	if err != nil {
		return err
	}

	botUser, err := a.DB.BotUserByChatId(ctx, db.BotUserByChatIdParams{
		ID:             chat.ID,
		OrganisationID: chat.OrganisationID,
	})
	if errors.Is(err, sql.ErrNoRows) {
		return errors.New("bot user not found")
	}
	if err != nil {
		return err
	}

	chatMessage, err := a.DB.CreateChatMessage(ctx, db.CreateChatMessageParams{
		ChatID:         chat.ID,
		UserID:         botUser.ID,
		Message:        "",
		OrganisationID: chat.OrganisationID,
	})
	if err != nil {
		return err
	}
	_ = a.subscriptionHandler.PublishMessage(&chatMessage)

	messages, _ := a.GenerateMessages(msg)

	client, err := a.NewChatClient()
	if err != nil {
		log.Println(err)
		// TODO: handle error
		return err
	}

	req := chatCompletionRequest(messages, true)

	stream, err := client.CreateChatCompletionStream(ctx, req)
	if err != nil {
		log.Println(err)
		// TODO: handle error
		return err
	}

	defer stream.Close()

	for {
		response, err := stream.Recv()

		// last token received
		if errors.Is(err, io.EOF) {
			return nil
		}

		// an unexpected error occurred
		if err != nil {
			log.Println(err)
			// TODO: handle error
			return err
		}

		// update the message with the response
		err = a.updateMessage(ctx, chatMessage, response)
		if err != nil {
			return err
		}
	}
}

func (a *ChatMessageProcessor) updateMessage(ctx context.Context, msg db.ChatMessage, response openai.ChatCompletionStreamResponse) error {
	message, err := a.DB.ChatMessageById(ctx, msg.ID)
	if err != nil {
		return err
	}

	message, err = a.DB.UpdateChatMessageMessageWithoutOrg(ctx, db.UpdateChatMessageMessageWithoutOrgParams{
		ID:      message.ID,
		Message: message.Message + response.Choices[0].Delta.Content,
	})
	if err != nil {
		return err
	}

	_ = a.subscriptionHandler.PublishMessage(&message)
	return nil
}

func (a *ChatMessageProcessor) NewClient(key string, url string) (*openai.Client, error) {
	if key == "" || url == "" {
		return nil, errors.New("invalid key or url")
	}

	config := openai.DefaultConfig(key)
	config.BaseURL = url

	return openai.NewClientWithConfig(config), nil
}

func (a *ChatMessageProcessor) NewChatClient() (*openai.Client, error) {
	var client *openai.Client
	var err error

	client, err = a.NewClient(os.Getenv("DOKEDU_AI_KEY"), os.Getenv("DOKEDU_AI_URL"))
	if err != nil {
		return nil, err
	}

	return client, err
}

func chatCompletionRequest(messages []openai.ChatCompletionMessage, stream bool) openai.ChatCompletionRequest {
	return openai.ChatCompletionRequest{
		Model:       openai.GPT4TurboPreview,
		Messages:    messages,
		Stream:      stream,
		Temperature: 1,
	}
}

func (a *ChatMessageProcessor) GenerateMessages(message db.ChatMessage) ([]openai.ChatCompletionMessage, error) {
	var messages []openai.ChatCompletionMessage

	msgHistory, err := a.DB.ChatMessagesByChatIdWithoutOrg(context.Background(), message.ChatID)
	if err != nil {
		return messages, nil
	}

	users, err := a.DB.UsersInChat(context.Background(), message.ChatID)
	if err != nil {
		return nil, err
	}

	var userMap = make(map[string]db.User)
	for _, user := range users {
		userMap[user.ID] = user
	}

	systemMessage := openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleSystem,
		Content: "Your name is Dokedu AI. You are a bot created by Dokedu. Dokedu is developed by Tom Härter. Dokedu is an open source productivity suite. You are a general assistant that helps with everything.",
	}

	for _, msg := range msgHistory {
		var role string

		if userMap[msg.UserID].Role == db.UserRoleBot {
			role = openai.ChatMessageRoleAssistant
			messages = append(messages, openai.ChatCompletionMessage{
				Role:    role,
				Content: msg.Message,
			})
		} else {
			userFullName := userMap[msg.UserID].FirstName + " " + userMap[msg.UserID].LastName
			role = openai.ChatMessageRoleUser
			messages = append(messages, openai.ChatCompletionMessage{
				Role:    role,
				Content: userFullName + ": " + msg.Message,
			})
		}
	}

	if len(messages) == 0 {
		messages = make([]openai.ChatCompletionMessage, 0)
	}

	lastMessages := []openai.ChatCompletionMessage{
		{
			Role:    openai.ChatMessageRoleUser,
			Content: message.Message,
		},
	}

	return append(append([]openai.ChatCompletionMessage{systemMessage}, messages...), lastMessages...), nil
}
