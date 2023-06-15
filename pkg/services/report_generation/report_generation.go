package report_generation

import (
	"container/list"
	"context"
	"example/pkg/db"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/proto"
	"github.com/go-rod/rod/lib/utils"
	"github.com/uptrace/bun"
	"net/http"
	"os"
	"sync"
)

type ReportGenerationServiceConfig struct {
	DB *bun.DB
}

type ReportGenerationService struct {
	mu         sync.Mutex
	queue      *list.List
	limit      chan int
	loopSignal chan struct{}
	cfg        ReportGenerationServiceConfig
}

// Adds the report to the queue (typically on report creation)
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

// Here, the report is processed and stuff is genrated
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
		GeneratePDF(report)
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

	// Start the http server to serve the report html
	// TODO: is this necessary?
	go func() {
		panic(http.ListenAndServe(":1324", http.FileServer(http.Dir("../../../tmp"))))
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

// Generation of the PDF
func GeneratePDF(report db.Report) error {
	fmt.Println("Generating PDF for report: ", report.ID)

	browser := rod.New().MustConnect()
	defer browser.MustClose()

	if report.Kind == "report" {
		err := GenerateReportHTML()
		if err != nil {
			return err
		}
	}

	head, err := os.ReadFile("./templates/_head.html")
	if err != nil {
		return err
	}

	foot, err := os.ReadFile("./templates/_foot.html")
	if err != nil {
		return err
	}

	page := browser.MustPage("http://localhost:1324/reports.html").MustWaitLoad()

	marginTop := float64(0.80)
	martinBottom := float64(1)
	marginLeft := float64(0.70)

	pdf, _ := page.PDF(&proto.PagePrintToPDF{
		PrintBackground:     true,
		DisplayHeaderFooter: true,
		HeaderTemplate:      string(head),
		FooterTemplate:      string(foot),
		MarginTop:           &marginTop,
		MarginBottom:        &martinBottom,
		MarginLeft:          &marginLeft,
	})

	_ = utils.OutputFile("./dokedu.pdf", pdf)

	return nil
}

func GenerateReportHTML() error {
	header, err := os.ReadFile("templates/_header.html")
	if err != nil {
		return err
	}

	reports, err := os.ReadFile("templates/reports.html")
	if err != nil {
		return err
	}

	footer, err := os.ReadFile("templates/_footer.html")
	if err != nil {
		return err
	}

	html := string(header) + string(reports) + string(footer)

	err = os.WriteFile("../../../tmp/reports.html", []byte(html), 0644)
	if err != nil {
		return err
	}

	return nil
}
