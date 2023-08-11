package mail

import (
	"example/pkg/db"
	"fmt"
	"github.com/labstack/gommon/log"
	"net/smtp"
	"os"
)

type Mailer struct {
	auth smtp.Auth
	cfg  Config
}

type Config struct {
	Host     string
	Port     int
	Username string
	Password string
}

func New(cfg Config) (Mailer, error) {
	auth := smtp.PlainAuth("", cfg.Username, cfg.Password, cfg.Host)
	return Mailer{auth: auth, cfg: cfg}, nil
}

func (m Mailer) Send(to []string, subject string, message string) error {
	msg := []byte(
		"MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\r\n" +
			"From: Dokedu Support <support@dokedu.org>\r\n" +
			"To: " + to[0] + "\r\n" +
			"Subject: " + subject + "\r\n" +
			"\r\n" +
			message + "\r\n")

	addr := fmt.Sprintf("%s:%d", m.cfg.Host, m.cfg.Port)
	err := smtp.SendMail(addr, m.auth, "support@dokedu.org", to, msg)
	if err != nil {
		log.Error(err)
		return err
	}

	return nil
}

func (m Mailer) SendPasswordReset(to string, name string, lang db.UserLanguage, token string) error {
	frontendUrl := os.Getenv("FRONTEND_URL")

	link := fmt.Sprintf("%s/reset-password#token=%s", frontendUrl, token)

	template, err := PasswordResetMailTemplate(name, link, lang)
	if err != nil {
		log.Error(err)
		return err
	}

	var subject string
	if lang == db.UserLangDe {
		subject = "Passwort zurücksetzen"
	} else {
		subject = "Password Reset"
	}

	return m.Send([]string{to}, subject, template)
}

func (m Mailer) SendInvite(to string, name string, organisationName string, lang db.UserLanguage, token string) error {
	frontendUrl := os.Getenv("FRONTEND_URL")

	link := fmt.Sprintf("%s/invite#token=%s", frontendUrl, token)

	template, err := InviteMailTemplate(name, link, organisationName, lang)
	if err != nil {
		log.Error(err)
		return err
	}
	var subject string
	if lang == db.UserLangDe {
		subject = "Willkommen bei dokedu"
	} else {
		subject = "Welcome to Dokedu"
	}

	return m.Send([]string{to}, subject, template)
}
