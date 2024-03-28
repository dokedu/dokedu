package msg

import (
	"context"
	"errors"

	"github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type ErrorWithCode struct {
	error
	Code string
}

var (
	ErrInvalidEmailOrPassword = errors.New("invalid email or password")
	ErrInvalidRecoveryToken   = ErrWithCode("INVALID_RECOVERY_TOKEN", "invalid recovery token")
	ErrUnauthorized           = ErrWithCode("UNAUTHORIZED", "not allowed to perform this action")
	ErrInvalidInput           = ErrWithCode("INVALID_INPUT", "invalid input")
)

func ErrWithCode(code string, message string) ErrorWithCode {
	return ErrorWithCode{
		error: errors.New(message),
		Code:  code,
	}
}

// ErrPresenter puts the code into the extensions field of the error, if it is an ErrorWithCode
func ErrPresenter(ctx context.Context, err error) *gqlerror.Error {
	// invoke the defaultErrorPresenter to get the base gqlerror.Error
	defaultErr := graphql.DefaultErrorPresenter(ctx, err)

	// if the error that was passed is an ErrorWithCode, add the code to the extensions field
	var errWithCode ErrorWithCode
	if errors.As(err, &errWithCode) {
		if defaultErr.Extensions == nil {
			defaultErr.Extensions = map[string]interface{}{}
		}

		defaultErr.Extensions["code"] = errWithCode.Code
	}

	return defaultErr
}
