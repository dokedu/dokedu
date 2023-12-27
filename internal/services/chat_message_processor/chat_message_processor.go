package chat_message_processor

import (
	"context"
	"database/sql"
	"errors"
	"example/internal/db"
	"example/internal/subscription"
	"github.com/sashabaranov/go-openai"
	"github.com/uptrace/bun"
	"io"
	"log"
	"os"
)

type ChatMessageProcessor struct {
	DB                  *bun.DB
	ChatChannel         chan *db.Chat
	subscriptionHandler *subscription.Handler
}

func NewChatMessageProcessor(db *bun.DB, subscriptionHandler *subscription.Handler, chatChan chan *db.Chat) *ChatMessageProcessor {
	return &ChatMessageProcessor{
		DB:                  db,
		subscriptionHandler: subscriptionHandler,
		ChatChannel:         chatChan,
	}
}

func (a *ChatMessageProcessor) NewMessage(msg db.ChatMessage) error {
	ctx := context.Background()

	var chat db.Chat
	err := a.DB.NewSelect().Model(&chat).Where("id = ?", msg.ChatID).Scan(ctx)
	if err != nil {
		return err
	}

	var botUser db.User
	err = a.DB.NewSelect().
		Model(&botUser).
		Join("JOIN chat_users ON chat_users.user_id = \"user\".id").
		Where("chat_users.chat_id = ?", chat.ID).
		Where("role = ?", db.UserRoleBot).
		Where("\"user\".organisation_id = ?", chat.OrganisationID).
		Limit(1).
		Scan(ctx)
	if errors.Is(err, sql.ErrNoRows) {
		return errors.New("bot user not found")
	}
	if err != nil {
		return err
	}
	var chatMessage db.ChatMessage
	chatMessage.UserID = botUser.ID
	chatMessage.ChatID = chat.ID
	chatMessage.OrganisationID = chat.OrganisationID
	chatMessage.Message = ""

	err = a.DB.NewInsert().Model(&chatMessage).Returning("*").Scan(ctx)
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
		err = a.updateMessage(ctx, chatMessage, response, err)
		if err != nil {
			return err
		}
	}
}

func (a *ChatMessageProcessor) updateMessage(ctx context.Context, msg db.ChatMessage, response openai.ChatCompletionStreamResponse, err error) error {
	var message db.ChatMessage
	err = a.DB.NewSelect().Model(&message).Where("id = ?", msg.ID).Scan(ctx)

	message.Message = message.Message + response.Choices[0].Delta.Content
	err = a.DB.NewUpdate().Model(&message).Where("id = ?", message.ID).Returning("*").Scan(ctx)
	if err != nil {
		return err
	}

	a.subscriptionHandler.PublishMessage(&message)
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

	var msgHistory []db.ChatMessage
	err := a.DB.NewSelect().Model(&msgHistory).Where("chat_id = ?", message.ChatID).Scan(context.Background())
	if err != nil {
		return messages, nil
	}

	var chatUsers []db.ChatUser
	err = a.DB.NewSelect().Model(&chatUsers).Where("chat_id = ?", message.ChatID).Scan(context.Background())
	if err != nil {
		return nil, err
	}

	ids := make([]string, len(chatUsers))
	for i, chatUser := range chatUsers {
		ids[i] = chatUser.UserID
	}

	var users []db.User
	err = a.DB.NewSelect().Model(&users).Where("id IN (?)", bun.In(ids)).Scan(context.Background())
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
