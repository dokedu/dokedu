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
	ErrUnauthorized           = ErrWithCode("UNAUTHORIZED", "unauthorized")
	ErrUnauthenticated        = ErrWithCode("UNAUTHENTICATED", "unauthenticated")
	ErrUnexpected             = errors.New("unexpected error")
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
