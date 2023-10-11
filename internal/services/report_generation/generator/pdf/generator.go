package pdf

import (
	"bytes"
	"context"
	"embed"
	"errors"
	"example/internal/db"
	"example/internal/services/report_generation/config"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
	"github.com/go-rod/rod/lib/utils"
	"html/template"
	"os"
	"path/filepath"
)

//go:embed templates/*.gohtml
var templateEmbeds embed.FS

type Generator struct {
	cfg config.ReportGenerationConfig
}

type HeadData struct {
	ReportKind      string
	StudentFullName string
}

type FootData struct {
	CreatorFullName string
	CreatedAt       string
	From            string
	To              string
}

func NewPDFReportsGenerator(cfg config.ReportGenerationConfig) *Generator {
	return &Generator{cfg: cfg}
}

func (g *Generator) GeneratePDF(report db.Report) error {
	var data any

	switch report.Kind {
	case db.ReportKindEntries:
		data, _ = g.EntriesReportData(report)
	case db.ReportKindCompetences:
		data, _ = g.CompetencesReportData(report)
	case db.ReportKindLearnedCompetences:
		data, _ = g.LearnedCompetencesReportData(report)
	case db.ReportKindAllEntries:
		data, _ = g.AllEntriesReportData(report)
	default:
		return errors.New("unknown report kind")
	}

	return g.process(report, data)
}

func (g *Generator) process(report db.Report, data any) error {
	err := g.UpdateReportStatus(report.ID, db.ReportStatusProcessing)
	if err != nil {
		return err
	}

	pageContext, err := g.pageContextData(report)
	if err != nil {
		return err
	}

	err = g.generateHTML(report, data)
	if err != nil {
		return err
	}

	err = g.generatePDF(report, pageContext)
	if err != nil {
		return err
	}

	err = g.UpdateReportStatus(report.ID, db.ReportStatusDone)
	if err != nil {
		return err
	}

	return nil
}

func (g *Generator) generatePDF(report db.Report, data *CompetencesData) error {
	// https://stackoverflow.com/questions/70254649/rod-running-in-docker-alpine-get-error-chrome-linux-chrome-no-such-file-or-dir
	path, _ := launcher.LookPath()
	u := launcher.New().Bin(path).MustLaunch()
	browser := rod.New().ControlURL(u).MustConnect()
	defer browser.MustClose()

	t, err := template.ParseFS(templateEmbeds, "templates/_head.gohtml", "templates/_foot.gohtml")
	if err != nil {
		return err
	}

	var reportType string
	switch report.Kind {
	case db.ReportKindEntries:
		reportType = "Einträge"
	case db.ReportKindCompetences:
		reportType = "Kompetenzen"
	case db.ReportKindLearnedCompetences:
		reportType = "Gelernte Kompetenzen"
	case db.ReportKindAllEntries:
		reportType = "Alle Einträge"
	}

	var studentName string
	if db.ReportKindAllEntries == report.Kind {
		studentName = ""
	} else {
		studentName = fmt.Sprintf("%s %s", data.Student.FirstName, data.Student.LastName)
	}

	headData := HeadData{
		ReportKind:      reportType,
		StudentFullName: studentName,
	}
	head := new(bytes.Buffer)
	err = t.ExecuteTemplate(head, "_head.gohtml", headData)
	if err != nil {
		return err
	}

	footData := FootData{
		CreatorFullName: fmt.Sprintf("%s %s", data.Teacher.FirstName, data.Teacher.LastName),
		CreatedAt:       data.Report.CreatedAt.Format("02.01.2006"),
		From:            data.Report.From.Format("02.01.2006"),
		To:              data.Report.To.Format("02.01.2006"),
	}

	foot := new(bytes.Buffer)
	err = t.ExecuteTemplate(foot, "_foot.gohtml", footData)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("http://localhost:1324/%s.html", report.ID)

	page := browser.MustPage(url).MustWaitLoad()

	marginTop := 0.80
	martinBottom := 1.0
	marginLeft := 0.70

	headString := head.String()
	footString := foot.String()

	// pdf *rod.StreamReader
	pdf, err := page.PDF(&proto.PagePrintToPDF{
		PrintBackground:     true,
		DisplayHeaderFooter: true,
		HeaderTemplate:      headString,
		FooterTemplate:      footString,
		MarginTop:           &marginTop,
		MarginBottom:        &martinBottom,
		MarginLeft:          &marginLeft,
	})
	if err != nil {
		return err
	}

	pdfPath := fmt.Sprintf("tmp/reports/%s.pdf", report.ID)

	// write pdf to tmp/file.pdf
	err = utils.OutputFile(pdfPath, pdf)
	if err != nil {
		return err
	}

	// read file
	var pdfFile []byte
	pdfFile, err = os.ReadFile(pdfPath)

	err = g.UploadPDFToBucket(report, pdfFile)
	if err != nil {
		return err
	}

	return nil
}

type CompetencesData struct {
	Student db.User
	Teacher db.User
	Report  db.Report
}

func (g *Generator) pageContextData(report db.Report) (*CompetencesData, error) {
	var student db.User
	err := g.cfg.DB.NewSelect().Model(&student).Where("id = ?", report.StudentUserID).Scan(context.Background())
	if err != nil {
		return nil, err
	}

	var teacher db.User
	err = g.cfg.DB.NewSelect().Model(&teacher).Where("id = ?", report.UserID).Scan(context.Background())

	return &CompetencesData{Student: student, Teacher: teacher, Report: report}, nil
}

func (g *Generator) generateHTML(report db.Report, data any) error {
	t, err := template.ParseFS(templateEmbeds, "templates/_header.gohtml", "templates/entries.gohtml", "templates/all_entries.gohtml", "templates/competences.gohtml", "templates/_footer.gohtml")
	if err != nil {
		return err
	}

	header := new(bytes.Buffer)

	err = t.ExecuteTemplate(header, "_header.gohtml", nil)
	if err != nil {
		return err
	}

	reports := new(bytes.Buffer)

	switch report.Kind {
	case db.ReportKindEntries:
		err = t.ExecuteTemplate(reports, "entries.gohtml", data)
		if err != nil {
			return err
		}
	case db.ReportKindCompetences:
		err = t.ExecuteTemplate(reports, "competences.gohtml", data)
		if err != nil {
			return err
		}
	case db.ReportKindLearnedCompetences:
		err = t.ExecuteTemplate(reports, "competences.gohtml", data)
	case db.ReportKindAllEntries:
		err = t.ExecuteTemplate(reports, "all_entries.gohtml", data)
	}

	footer := new(bytes.Buffer)
	err = t.ExecuteTemplate(footer, "_footer.gohtml", nil)
	if err != nil {
		return err
	}

	html := fmt.Sprintf("%s%s%s", header, reports, footer)

	cwd, err := os.Getwd()
	fileName := fmt.Sprintf("%s.html", report.ID)
	path := filepath.Join(cwd, "tmp", "reports", fileName)
	err = os.WriteFile(path, []byte(html), 0644)
	if err != nil {
		return err
	}

	return nil
}
