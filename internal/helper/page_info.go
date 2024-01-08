package helper

import "example/internal/graph/model"

var (
	defaultLimit  = 50
	defaultOffset = 0
	maxLimit      = 1000
)

func CreatePageInfo(limit int, offset int, count int) (*model.PageInfo, error) {
	if limit == 0 {
		limit = defaultLimit
	}
	// The limit should never be greater than maxLimit, as pagination should be used in these cases
	if limit > maxLimit {
		limit = maxLimit
	}

	pageInfo := model.PageInfo{
		HasNextPage:     count > limit+offset,
		HasPreviousPage: offset > 0,
		CurrentPage:     offset/limit + 1,
	}

	return &pageInfo, nil
}

func SetPageLimits(limit *int, offset *int) (int, int) {
	pageLimit := defaultLimit
	pageOffset := defaultOffset

	if limit != nil {
		pageLimit = *limit
	}
	if offset != nil {
		pageOffset = *offset
	}

	// The limit should never be greater than maxLimit, as pagination should be used in these cases
	if pageLimit > maxLimit {
		pageLimit = maxLimit
	}

	return pageLimit, pageOffset
}
