package helper

import (
	"github.com/samber/lo"

	"github.com/dokedu/dokedu/backend/pkg/graph/model"
)

// PaginationInput takes the limit and offset from the user, and returns the limit, offset  to be used in the query
// If limit is nil, it will be set to 100
// If offset is nil, it will be set to 0
func PaginationInput(limit, offset *int) (uint64, uint64) {
	var l uint64
	var o uint64

	if limit == nil {
		l = 100
	} else {
		l = uint64(*limit)
	}

	if offset == nil {
		o = 0
	} else {
		o = uint64(*offset)
	}

	return l, o
}

// PaginationOutput takes the limit and data, and returns the data and a pageinfo (indicating if there are more pages)
// if the length of data is greater than the limit, it means there are more pages
// the data will be sliced to the limit
func PaginationOutput[T any](limit, offset uint64, data []T) ([]*T, model.PageInfo) {
	var hasNextPage bool

	if uint64(len(data)) > limit {
		hasNextPage = true
		data = data[:limit]
	}

	var p int
	if offset == 0 {
		p = 0
	} else {
		p = int(offset / limit)
	}

	return lo.ToSlicePtr(data), model.PageInfo{
		HasNextPage:     hasNextPage,
		HasPreviousPage: false,
		CurrentPage:     p + 1,
	}
}
