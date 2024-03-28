package mail

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"

	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

//go:embed templates/*.gohtml
var templateFiles embed.FS

var templates = template.Must(template.ParseFS(templateFiles, "templates/*.gohtml"))

func PasswordResetMailTemplate(name string, link string, language db.UserLang) (string, error) {
	data := struct {
		Name string
		Link string
	}{
		Name: name,
		Link: link,
	}

	out := new(bytes.Buffer)
	err := templates.ExecuteTemplate(out, fmt.Sprintf("%s_password_reset.gohtml", string(language)), data)
	if err != nil {
		return "", err
	}

	return out.String(), nil
}

func InviteMailTemplate(name string, link string, organisation string, language db.UserLang) (string, error) {
	data := struct {
		Name             string
		Link             string
		OrganisationName string
	}{
		Name:             name,
		Link:             link,
		OrganisationName: organisation,
	}

	out := new(bytes.Buffer)
	err := templates.ExecuteTemplate(out, fmt.Sprintf("%s_invite.gohtml", string(language)), data)
	if err != nil {
		return "", err
	}

	return out.String(), nil
}
