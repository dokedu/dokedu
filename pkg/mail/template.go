package mail

import (
	"bytes"
	"embed"
	"example/pkg/db"
	"fmt"
	"html/template"
)

//go:embed templates/*.gohtml
var templateFiles embed.FS

func PasswordResetMailTemplate(name string, link string, language db.UserLanguage) (string, error) {
	t, err := template.ParseFS(templateFiles, "templates/*.gohtml")
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
	if language == db.UserLangDe {
		err = t.ExecuteTemplate(out, "password_reset_de.gohtml", data)
	} else {
		err = t.ExecuteTemplate(out, "password_reset.gohtml", data)
	}

	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s", out), nil
}

func InviteMailTemplate(name string, link string, organisation string, language db.UserLanguage) (string, error) {
	t, err := template.ParseFS(templateFiles, "templates/*.gohtml")
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

	if language == db.UserLangDe {
		err = t.ExecuteTemplate(out, "invite_de.gohtml", data)
	} else {
		err = t.ExecuteTemplate(out, "invite.gohtml", data)
	}

	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s", out), nil
}
