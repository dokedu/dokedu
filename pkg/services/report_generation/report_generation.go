package report_generation

import (
	"bytes"
	"container/list"
	"context"
	"database/sql"
	"embed"
	"example/pkg/db"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/proto"
	"github.com/go-rod/rod/lib/utils"
	"github.com/minio/minio-go/v7"
	"github.com/uptrace/bun"
	"html/template"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

//go:embed templates/*.gohtml
var templateEmbeds embed.FS

type ReportGenerationServiceConfig struct {
	DB    *bun.DB
	MinIO *minio.Client
}

type ReportGenerationService struct {
	mu         sync.Mutex
	queue      *list.List
	limit      chan int
	loopSignal chan struct{}
	cfg        ReportGenerationServiceConfig
}

// AddToQueue Adds the report to the queue (typically on report creation)
func (s *ReportGenerationService) AddToQueue(reportId string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.queue.PushBack(reportId)
	fmt.Println("Added to queue: ", reportId)
	s.tickleLoop()
	return nil
}

// Loops forever and tries to dequeue the report
// Listens to loopSignal, which can happen when we enqueue a report or we finish processing a report
func (s *ReportGenerationService) loop(ctx context.Context) {
	for {
		select {
		case <-s.loopSignal:
			s.tryDequeue()
		case <-ctx.Done():
			return

		}
	}
}

func (s *ReportGenerationService) tryDequeue() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.queue.Len() == 0 {
		return
	}

	select {
	// If we can send 1 to the semaphore channel, it means we have a free slot
	case s.limit <- 1:
		request := s.dequeue()
		go s.process(request)
	default:
		fmt.Println("Request limit reached")
	}
}

// Helper function to pop the report to process from the queue
func (s *ReportGenerationService) dequeue() string {
	request := s.queue.Front()
	s.queue.Remove(request)
	return request.Value.(string)
}

// Here, the report is processed and stuff is generated
func (s *ReportGenerationService) process(request string) {
	defer s.replenish()
	fmt.Println("Processing request: ", request)

	// Fetch the report from the database
	var report db.Report
	err := s.cfg.DB.NewSelect().Model(&report).Where("id = ?", request).Scan(context.Background())
	if err != nil {
		fmt.Println("Error fetching report: ", err)
		return
	}

	if report.Format == "pdf" {
		err := s.generatePDF(report)
		if err != nil {
			err := s.updateReportStatus(report.ID, db.ReportStatusError)
			if err != nil {
				return
			}
			return
		}
		s.cleanup(report)
	}
}

func (s *ReportGenerationService) cleanup(report db.Report) {
	// Delete the report file
	err := os.Remove(fmt.Sprintf("tmp/reports/%s.%s", report.ID, report.Format))
	if err != nil {
		fmt.Println("Error deleting report file: ", err)
	}
	if report.Format == "pdf" {
		err := os.Remove(fmt.Sprintf("tmp/reports/%s.html", report.ID))
		if err != nil {
			fmt.Println("Error deleting report html file: ", err)
		}
	}
}

func (s *ReportGenerationService) replenish() {
	// Free up a slot in the semaphore channel
	<-s.limit
	// "tickles" the loop to try to dequeue again
	s.tickleLoop()
}

// Makes a non-blocking send to the loopSignal channel
func (s *ReportGenerationService) tickleLoop() {
	select {
	case s.loopSignal <- struct{}{}:
	default:
	}
}

func NewReportGenerationService(cfg ReportGenerationServiceConfig, ctx context.Context, requestLimit int) *ReportGenerationService {
	// Create new service, pass the parameters and configure the service
	// TODO: Here it would make sense to fetch the reports that might not be processed yet

	// check that tmp exists
	if _, err := os.Stat("tmp"); os.IsNotExist(err) {
		err := os.Mkdir("tmp", 0755)
		if err != nil {
			return nil
		}
	}

	// check that tmp/reports exists
	if _, err := os.Stat("tmp/reports"); os.IsNotExist(err) {
		err := os.Mkdir("tmp/reports", 0755)
		if err != nil {
			return nil
		}
	}

	go func() {
		// Start the http server to serve the report html
		err := http.ListenAndServe(":1324", http.FileServer(http.Dir("tmp/reports")))
		if err != nil {
			panic(err)
		}
	}()

	s := &ReportGenerationService{
		queue:      list.New(),
		limit:      make(chan int, requestLimit),
		loopSignal: make(chan struct{}, 1),
		cfg:        cfg,
	}

	// Start the loop
	go s.loop(ctx)
	return s
}

func (s *ReportGenerationService) updateReportStatus(reportId string, status db.ReportStatus) error {
	_, err := s.cfg.DB.NewUpdate().Model(&db.Report{}).Set("status = ?", status).Where("id = ?", reportId).Exec(context.Background())
	return err
}

type HeadData struct {
	StudentFullName string
}

type FootData struct {
	CreatorFullName string
	CreatedAt       string
	From            string
	To              string
}

// generatePDF Generation of the PDF
func (s *ReportGenerationService) generatePDF(report db.Report) error {
	fmt.Println("Generating PDF for report: ", report.ID)

	err := s.updateReportStatus(report.ID, db.ReportStatusProcessing)
	if err != nil {
		return err
	}

	browser := rod.New().MustConnect()
	defer browser.MustClose()

	if report.Kind == "report" {
		err := s.generateReportHTML(report)
		if err != nil {
			return err
		}
	}

	t, err := template.ParseFS(templateEmbeds, "templates/_head.gohtml", "templates/_foot.gohtml")
	if err != nil {
		return err
	}

	var student db.User
	err = s.cfg.DB.NewSelect().Model(&student).Where("id = ?", report.StudentUserID).Scan(context.Background())
	if err != nil {
		return err
	}

	headData := HeadData{
		StudentFullName: fmt.Sprintf("%s %s", student.FirstName, student.LastName),
	}

	head := new(bytes.Buffer)
	err = t.ExecuteTemplate(head, "_head.gohtml", headData)
	if err != nil {
		return err
	}

	var user db.User
	err = s.cfg.DB.NewSelect().Model(&user).Where("id = ?", report.UserID).Scan(context.Background())

	footData := FootData{
		CreatorFullName: fmt.Sprintf("%s %s", user.FirstName, user.LastName),
		CreatedAt:       report.CreatedAt.Format("02.01.2006"),
		From:            report.From.Format("02.01.2006"),
		To:              report.To.Format("02.01.2006"),
	}

	foot := new(bytes.Buffer)
	err = t.ExecuteTemplate(foot, "_foot.gohtml", footData)
	if err != nil {
		return err
	}

	url := fmt.Sprintf("http://localhost:1324/%s.html", report.ID)
	//url := "http://localhost:1324/reports.html"

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

	err = s.uploadPDFToBucket(report, pdfFile)
	if err != nil {
		return err
	}

	bucketID := report.OrganisationID + "-reports"
	var bucket db.Bucket
	err = s.cfg.DB.NewSelect().Model(&bucket).Where("name = ?", bucketID).Where("organisation_id = ?", report.OrganisationID).Scan(context.Background())
	if err != nil {
		return err
	}

	var file db.File
	file.FileType = db.FileTypeBlob
	file.OrganisationID = report.OrganisationID
	file.Name = report.ID
	file.BucketID = bucket.ID
	file.MimeType = "application/pdf"
	file.ID = report.ID
	_, err = s.cfg.DB.NewInsert().Model(&file).Returning("*").Exec(context.Background())
	if err != nil {
		return err
	}

	var reportUpdate db.Report
	reportUpdate.ID = report.ID
	reportUpdate.Status = db.ReportStatusDone
	reportUpdate.FileID = sql.NullString{String: file.ID, Valid: true}
	_, err = s.cfg.DB.NewUpdate().Column("status", "file_id").Model(&reportUpdate).Where("id = ?", report.ID).Exec(context.Background())
	if err != nil {
		return err
	}

	return nil
}

func (s *ReportGenerationService) uploadPDFToBucket(report db.Report, pdf []byte) error {
	ctx := context.Background()

	// bucket id is report.OrganisationID + "-" reports
	bucketId := report.OrganisationID + "-reports"

	var bucket db.Bucket
	err := s.cfg.DB.NewSelect().Model(&bucket).Where("name = ?", bucketId).Where("organisation_id = ?", report.OrganisationID).Scan(ctx)
	if err == sql.ErrNoRows {
		bucket = db.Bucket{
			Name:           bucketId,
			OrganisationID: report.OrganisationID,
		}
		// Create the bucket if it doesn't exist
		_, err = s.cfg.DB.NewInsert().Model(&bucket).Returning("*").Exec(ctx)
		if err != nil {
			return err
		}
	} else if err != nil {
		return err
	}

	exists, err := s.cfg.MinIO.BucketExists(ctx, bucket.ID)
	if err != nil {
		return err
	}
	if !exists {
		err = s.cfg.MinIO.MakeBucket(ctx, bucket.ID, minio.MakeBucketOptions{})
		if err != nil {
			return err
		}
	}

	var ioReader io.Reader
	ioReader = bytes.NewReader(pdf)

	// Upload the pdf to the bucket
	_, err = s.cfg.MinIO.PutObject(ctx, bucket.ID, report.ID, ioReader, -1, minio.PutObjectOptions{
		ContentType: "application/pdf",
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *ReportGenerationService) generateReportHTML(report db.Report) error {
	t, err := template.ParseFS(templateEmbeds, "templates/_header.gohtml", "templates/reports.gohtml", "templates/_footer.gohtml")
	if err != nil {
		return err
	}

	header := new(bytes.Buffer)

	err = t.ExecuteTemplate(header, "_header.gohtml", nil)
	if err != nil {
		return err
	}

	data, err := s.gatherReportData(report)
	if err != nil {
		return err
	}

	reports := new(bytes.Buffer)
	err = t.ExecuteTemplate(reports, "reports.gohtml", data)
	if err != nil {
		return err
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

type ReportData struct {
	Entries []struct {
		Entry           db.Entry
		Date            string
		CreatedAt       string
		User            db.User
		UserCompetences []struct {
			UserCompetence []db.UserCompetence
			Parents        []db.Competence
			Competence     db.Competence
			Grades         string
			AtLeastOne     bool
			AtLeastTwo     bool
			AtLeastThree   bool
		}
	}
}

func (s *ReportGenerationService) gatherReportData(report db.Report) (*ReportData, error) {
	ctx := context.Background()

	var reportData ReportData

	var entries []db.Entry
	err := s.cfg.DB.NewSelect().Model(&entries).Join("JOIN entry_users eu ON eu.entry_id = entry.id").Where("eu.user_id = ?", report.StudentUserID).Scan(ctx)
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		var userCompetences []db.UserCompetence
		err = s.cfg.DB.NewSelect().Model(&userCompetences).Where("user_id = ?", report.StudentUserID).Where("entry_id = ?", entry.ID).Scan(ctx)
		if err != nil {
			return nil, err
		}

		var userCompetencesStruct []struct {
			UserCompetence []db.UserCompetence
			Parents        []db.Competence
			Competence     db.Competence
			Grades         string
			AtLeastOne     bool
			AtLeastTwo     bool
			AtLeastThree   bool
		}

		for _, userCompetence := range userCompetences {
			parents, err := competenceParents(s.cfg.DB, userCompetence.CompetenceID)
			if err != nil {
				return nil, err
			}

			var competence db.Competence
			err = s.cfg.DB.NewSelect().Model(&competence).Where("id = ?", userCompetence.CompetenceID).Scan(ctx)
			if err != nil {
				return nil, err
			}

			atLeastOne := false
			atLeastTwo := false
			atLeastThree := false

			if userCompetence.Level >= 1 {
				atLeastOne = true
			}
			if userCompetence.Level >= 2 {
				atLeastTwo = true
			}
			if userCompetence.Level >= 3 {
				atLeastThree = true
			}

			grades := ""

			// if grades is empty, it will be displayed as "-"
			// if grades len(1) it will be displayed as "n"
			// if grades len >= 2 it will be displayed as "n - m"
			switch len(competence.Grades) {
			case 0:
				grades = "-"
			case 1:
				grades = fmt.Sprintf("%d", competence.Grades[0])
			default:
				grades = fmt.Sprintf("%d - %d", competence.Grades[0], competence.Grades[len(competence.Grades)-1])
			}

			userCompetencesStruct = append(userCompetencesStruct, struct {
				UserCompetence []db.UserCompetence
				Parents        []db.Competence
				Competence     db.Competence
				Grades         string
				AtLeastOne     bool
				AtLeastTwo     bool
				AtLeastThree   bool
			}{
				UserCompetence: []db.UserCompetence{userCompetence},
				Parents:        parents,
				Grades:         grades,
				Competence:     competence,
				AtLeastOne:     atLeastOne,
				AtLeastTwo:     atLeastTwo,
				AtLeastThree:   atLeastThree,
			})
		}

		var user db.User
		err = s.cfg.DB.NewSelect().Model(&user).Where("id = ?", report.UserID).Scan(ctx)
		if err != nil {
			return nil, err
		}
		// format dd.mm.yyyy hh:mm
		createdAt := entry.CreatedAt.Format("02.01.2006 15:04")
		// format dd.mm.yyyy whereas date is right now yyyy-mm-dd and a string
		var date time.Time
		date, err = time.Parse("2006-01-02", entry.Date)
		if err != nil {
			return nil, err
		}

		dateFormatted := date.Format("02.01.2006")

		reportData.Entries = append(reportData.Entries, struct {
			Entry           db.Entry
			Date            string
			CreatedAt       string
			User            db.User
			UserCompetences []struct {
				UserCompetence []db.UserCompetence
				Parents        []db.Competence
				Competence     db.Competence
				Grades         string
				AtLeastOne     bool
				AtLeastTwo     bool
				AtLeastThree   bool
			}
		}{
			Entry:           entry,
			CreatedAt:       createdAt,
			Date:            dateFormatted,
			User:            user,
			UserCompetences: userCompetencesStruct,
		})
	}

	return &reportData, nil
}

func competenceParents(bun *bun.DB, competenceID string) ([]db.Competence, error) {
	ctx := context.Background()
	query := `
SELECT * FROM get_competence_tree_reverse(?)
`

	// query without new lines
	q := strings.ReplaceAll(query, "\n", " ")

	var parents []db.Competence
	err := bun.NewRaw(q, competenceID).Scan(ctx, &parents)
	if err != nil {
		return nil, err
	}

	return parents, nil
}
