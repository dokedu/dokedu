package reportGeneration

import (
	"container/list"
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"sync"

	"github.com/dokedu/dokedu/backend/pkg/reportGeneration/generator/pdf"
	"github.com/dokedu/dokedu/backend/pkg/services"
	"github.com/dokedu/dokedu/backend/pkg/services/database/db"
)

type Service struct {
	mu         sync.Mutex
	queue      *list.List
	limit      chan int
	loopSignal chan struct{}
	svc        *services.Services
}

func NewReportGenerationService(svc *services.Services, ctx context.Context, requestLimit int) *Service {
	s := &Service{
		svc:        svc,
		queue:      list.New(),
		limit:      make(chan int, requestLimit),
		loopSignal: make(chan struct{}, 1),
	}

	// TODO: refactor to move it to a pdf generator service
	// check that tmp exists
	if _, err := os.Stat("tmp"); os.IsNotExist(err) {
		err := os.Mkdir("tmp", 0755)
		if err != nil {
			slog.Error("unable to start the report generation service!", "error", err)
			return nil
		}
	}

	// check that tmp/reports exists
	if _, err := os.Stat("tmp/reports"); os.IsNotExist(err) {
		err := os.Mkdir("tmp/reports", 0755)
		if err != nil {
			slog.Error("unable to start the report generation service!", "error", err)
			return nil
		}
	}

	return s
}

func (s *Service) GoStartLoop() {
	ctx := context.Background()
	go func() {
		// Start the http server to serve the report html
		err := http.ListenAndServe(":1324", http.FileServer(http.Dir("tmp/reports")))
		if err != nil {
			panic(err)
		}
	}()

	// Start the loop
	go s.loop(ctx)

	// Schedule unprocessed reports
	go func() {
		err := s.scheduleUnprocessedReports()
		if err != nil {
			fmt.Println("Error scheduling unprocessed reports: ", err)
		}
	}()
}

// AddToQueue Adds the report to the queue (typically on report creation)
func (s *Service) AddToQueue(reportId string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.queue.PushBack(reportId)
	fmt.Println("Added to queue: ", reportId)
	s.tickleLoop()
	return nil
}

// Loops forever and tries to dequeue the report
// Listens to loopSignal, which can happen when we enqueue a report or we finish processing a report
func (s *Service) loop(ctx context.Context) {
	for {
		select {
		case <-s.loopSignal:
			s.tryDequeue()
		case <-ctx.Done():
			return
		}
	}
}

func (s *Service) tryDequeue() {
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
func (s *Service) dequeue() string {
	request := s.queue.Front()
	s.queue.Remove(request)
	return request.Value.(string)
}

// Here, the report is processed and stuff is generated
func (s *Service) process(request string) {
	defer s.replenish()
	fmt.Println("Processing request: ", request)

	// Fetch the report from the database
	report, err := s.svc.DB.GLOBAL_ReportFindByID(context.Background(), request)
	if err != nil {
		slog.Error("Error fetching report", "err", err)
		return
	}

	if report.Format == db.ReportFormatPdf {
		pdfGenerator := pdf.NewPDFReportsGenerator(s.svc)
		err := pdfGenerator.GeneratePDF(report)
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

func (s *Service) cleanup(report db.Report) {
	// Delete the report file
	err := os.Remove(fmt.Sprintf("tmp/reports/%s.%s", report.ID, report.Format))
	if err != nil {
		fmt.Println("Error deleting report file: ", err)
	}
	if report.Format == db.ReportFormatPdf {
		err := os.Remove(fmt.Sprintf("tmp/reports/%s.html", report.ID))
		if err != nil {
			fmt.Println("Error deleting report html file: ", err)
		}
	}
}

func (s *Service) replenish() {
	// Free up a slot in the semaphore channel
	<-s.limit
	// "tickles" the loop to try to dequeue again
	s.tickleLoop()
}

// Makes a non-blocking send to the loopSignal channel
func (s *Service) tickleLoop() {
	select {
	case s.loopSignal <- struct{}{}:
	default:
	}
}

func (s *Service) scheduleUnprocessedReports() error {
	reports, err := s.unprocessedReports()
	if err != nil {
		return err
	}

	for _, report := range reports {
		err := s.AddToQueue(report.ID)
		if err != nil {
			return err
		}
	}
	return nil
}

// unprocessedReports fetches the reports that are not processed yet
func (s *Service) unprocessedReports() ([]db.Report, error) {
	reports, err := s.svc.DB.GLOBAL_ReportsFindUnprocessed(context.Background())
	if err != nil {
		return nil, err
	}

	// TODO: Also fetch the reports that are processing but have been stuck for a long time. This is to handle the case where the process crashes

	return reports, nil
}

func (s *Service) updateReportStatus(reportId string, status db.ReportStatus) error {
	_, err := s.svc.DB.GLOBAL_ReportsUpdateStatus(context.Background(), db.GLOBAL_ReportsUpdateStatusParams{
		ID:     reportId,
		Status: status,
	})
	return err
}
