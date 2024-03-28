package mail

import (
	"fmt"
	"log/slog"
	"net/smtp"

	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

type Mailer struct {
	auth smtp.Auth
	cfg  Config
}

type Config struct {
	Host     string `env:"SMTP_HOST"`
	Port     int    `env:"SMTP_PORT"`
	Username string `env:"SMTP_USERNAME"`
	Password string `env:"SMTP_PASSWORD"`

	FrontendURL string `env:"FRONTEND_URL"`
}

func New(cfg Config) Mailer {
	auth := smtp.PlainAuth("", cfg.Username, cfg.Password, cfg.Host)
	return Mailer{auth: auth, cfg: cfg}
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
		slog.Error("error while trying to send email", "err", err)
		return err
	}

	return nil
}

func (m Mailer) SendPasswordReset(to string, name string, lang db.UserLang, token string) error {
	link := fmt.Sprintf("%s/reset-password#token=%s", m.cfg.FrontendURL, token)

	template, err := PasswordResetMailTemplate(name, link, lang)
	if err != nil {
		slog.Error("error while trying to generate password reset mail template", "err", err)
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

func (m Mailer) SendInvite(to string, name string, organisationName string, lang db.UserLang, token string) error {
	link := fmt.Sprintf("%s/invite#token=%s", m.cfg.FrontendURL, token)

	template, err := InviteMailTemplate(name, link, organisationName, lang)
	if err != nil {
		slog.Error("error while trying to generate invite mail template", "err", err)
		return err
	}
	var subject string
	if lang == db.UserLangDe {
		subject = "Willkommen bei Dokedu"
	} else {
		subject = "Welcome to Dokedu"
	}

	return m.Send([]string{to}, subject, template)
}
