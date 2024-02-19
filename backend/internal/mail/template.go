package mail

import (
	"bytes"
	"embed"
	"github.com/dokedu/dokedu/backend/internal/database/db"
	"html/template"
)

//go:embed templates/*
var templateFiles embed.FS

func PasswordResetMailTemplate(name string, link string, language db.UserLanguage) (string, error) {
	t, err := template.ParseFS(templateFiles, "templates/"+string(language)+"/*.gohtml")
	if err != nil {
		return "", err
	}

	data := struct {
		Name string
		Link string
	}{
		Name: name,
		Link: link,
	}

	out := new(bytes.Buffer)
	err = t.ExecuteTemplate(out, "password_reset.gohtml", data)

	if err != nil {
		return "", err
	}

	return out.String(), nil
}

func InviteMailTemplate(name string, link string, organisation string, language db.UserLanguage) (string, error) {
	t, err := template.ParseFS(templateFiles, "templates/"+string(language)+"/*.gohtml")
	if err != nil {
		return "", err
	}

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
	err = t.ExecuteTemplate(out, "invite.gohtml", data)

	if err != nil {
		return "", err
	}

	return out.String(), nil
}
