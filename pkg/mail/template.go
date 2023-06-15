package mail

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
)

//go:embed templates/*.gohtml
var templateFiles embed.FS

func PasswordResetMailTemplate(name string, link string) (string, error) {
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
	err = t.ExecuteTemplate(out, "password_reset.gohtml", data)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s", out), nil
}
