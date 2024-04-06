package helper_test

import (
	"testing"

	"github.com/samber/lo"
	"github.com/stretchr/testify/suite"

	"github.com/dokedu/dokedu/backend/internal/testsuite"
	"github.com/dokedu/dokedu/backend/pkg/helper"
)

type TestSuite struct {
	*testsuite.TestSuite
}

func TestTestSuite(t *testing.T) {
	ts := testsuite.NewFromT(t)
	tts := &TestSuite{TestSuite: ts}

	suite.Run(t, tts)
}

func (t *TestSuite) Test_PaginationInput() {
	limit, offset, page := helper.PaginationInput(nil, nil)
	t.Equal(uint64(100), limit)
	t.Equal(uint64(0), offset)
	t.Equal(1, page)

	limit, offset, page = helper.PaginationInput(nil, lo.ToPtr(10))
	t.Equal(uint64(100), limit)
	t.Equal(uint64(10), offset)
	t.Equal(1, page)

	limit, offset, page = helper.PaginationInput(lo.ToPtr(10), nil)
	t.Equal(uint64(10), limit)
	t.Equal(uint64(0), offset)
	t.Equal(1, page)

	limit, offset, page = helper.PaginationInput(lo.ToPtr(10), lo.ToPtr(10))
	t.Equal(uint64(10), limit)
	t.Equal(uint64(10), offset)
	t.Equal(2, page)

	limit, offset, page = helper.PaginationInput(lo.ToPtr(10), lo.ToPtr(20))
	t.Equal(uint64(10), limit)
	t.Equal(uint64(20), offset)
	t.Equal(3, page)

	limit, offset, page = helper.PaginationInput(lo.ToPtr(10), lo.ToPtr(21))
	t.Equal(uint64(10), limit)
	t.Equal(uint64(21), offset)
	t.Equal(3, page)

	limit, offset, page = helper.PaginationInput(lo.ToPtr(20), lo.ToPtr(21))
	t.Equal(uint64(20), limit)
	t.Equal(uint64(21), offset)
	t.Equal(2, page)
}
