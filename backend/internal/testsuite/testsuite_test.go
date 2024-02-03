package testsuite_test

import (
	"testing"

	"github.com/stretchr/testify/suite"

	"github.com/dokedu/dokedu/backend/internal/testsuite"
)

type TestSuite struct {
	*testsuite.TestSuite
}

func TestTestSuite(t *testing.T) {
	ts := testsuite.NewFromT(t)
	tts := &TestSuite{TestSuite: ts}
	suite.Run(t, tts)
}
