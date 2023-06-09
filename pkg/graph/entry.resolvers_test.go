package graph

import (
	"context"
	"database/sql"
	"example/pkg/db"
	"example/pkg/graph/model"
	"example/pkg/jwt"
	"example/pkg/middleware"
	"github.com/99designs/gqlgen/client"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/introspection"
	jwt2 "github.com/golang-jwt/jwt"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
	"testing"
	"time"
)

func TestMutationResolver_CreateEntry(t *testing.T) {
	c := testClient()

	t.Run("introspection", func(t *testing.T) {
		// Make sure we can run the graphiql introspection query without errors
		var resp interface{}
		c.MustPost(introspection.Query, &resp)
	})

	t.Run("create entry", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID   string
				Date string
			}
		}
		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
		}))
		if resp.CreateEntry.ID == "" {
			t.Fatal("expected entry id to be non-empty")
		}
		if resp.CreateEntry.Date != "2021-01-01" {
			t.Fatal("expected entry date to be 2021-01-01 but got", resp.CreateEntry.Date)
		}
	})

	t.Run("create entry with tags", func(t *testing.T) {
		tag1 := "gZOvnaaMmLjPzbWev4Y44"
		tag2 := "CCdYedMfAss6aV6Vjfquy"
		input := model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			TagIds: []string{
				tag1,
				tag2,
			},
		}
		var resp struct {
			CreateEntry struct {
				ID   string
				Date string
				Tags []struct {
					ID   string
					Name string
				}
			}
		}
		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date tags { id name } } }`, &resp, client.Var("input", input))
		if resp.CreateEntry.ID == "" {
			t.Fatal("expected entry id to be non-empty")
		}
		if len(resp.CreateEntry.Tags) != 2 {
			t.Fatal("expected entry to have 2 tags")
		}
	})

	t.Run("create entry with events", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID     string
				Date   string
				Events []struct {
					ID    string
					Title string
				}
			}
		}
		eventA := "0JuXpamtNw8v9t7NukNqw"
		eventB := "-E2x1-7uEBT7rUXPt86_H"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date events { id title } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			EventIds: []string{
				eventA,
				eventB,
			},
		}))
		if resp.CreateEntry.ID == "" {
			t.Fatal("expected entry id to be non-empty")
		}
		if len(resp.CreateEntry.Events) != 2 {
			t.Fatal("expected entry to have 2 events")
		}
	})

	t.Run("create entry with users", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID        string
					FirstName string
					LastName  string
				}
			}
		}
		userA := "VU51iPRp80DGgaZxBM3W2"
		userB := "K-CUgRwMANG6ObFPuY2mc"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date users { id firstName lastName } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			UserIds: []string{
				userA,
				userB,
			},
		}))

		if resp.CreateEntry.ID == "" {
			t.Fatal("expected entry id to be non-empty")
		}

		if len(resp.CreateEntry.Users) != 2 {
			t.Fatal("expected entry to have 2 users")
		}
	})

	t.Run("create entry with only competences fails", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID          string
				Date        string
				Competences []struct {
					ID   string
					Name string
				}
			}
		}

		err := c.Post(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date competences { id name } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			UserCompetences: []*model.CreateUserCompetenceInput{
				{
					Level:        0,
					UserID:       "",
					CompetenceID: "OSENW3fO5fxs2IN8aTH9n",
				},
				{
					Level:        1,
					UserID:       "",
					CompetenceID: "nm5pYXzpYe_rJjHpjnCdH",
				},
			},
		}))

		if err == nil {
			t.Fatal("expected error")
		}
	})

	t.Run("create entry with competences and users succeeds", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID              string
				Date            string
				UserCompetences []struct {
					ID string
				}
			}
		}

		userA := "MI1cAxKeI_2dgSg2knkQE"
		userB := "VU51iPRp80DGgaZxBM3W2"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date userCompetences { id } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			UserIds: []string{
				userA,
				userB,
			},
			UserCompetences: []*model.CreateUserCompetenceInput{
				{
					Level:        0,
					UserID:       userA,
					CompetenceID: "OSENW3fO5fxs2IN8aTH9n",
				},
				{
					Level:        1,
					UserID:       userB,
					CompetenceID: "nm5pYXzpYe_rJjHpjnCdH",
				},
			},
		}))

		if resp.CreateEntry.ID == "" {
			t.Fatal("expected entry id to be non-empty")
		}

		if len(resp.CreateEntry.UserCompetences) != 2 {
			t.Fatal("expected entry to have 2 competences but got", len(resp.CreateEntry.UserCompetences))
		}
	})
}

func TestMutationResolver_UpdateEntry(t *testing.T) {
	c := testClient()

	t.Run("update entry description", func(t *testing.T) {
		// create entry
		var resp struct {
			CreateEntry struct {
				ID   string
				Date string
				Body string
			}
		}

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date body } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
		}))

		body := "This is an updated entry"

		if resp.CreateEntry.ID == "" {
			t.Fatal("expected entry id to be non-empty")
		}

		var resp2 struct {
			UpdateEntry struct {
				ID   string
				Date string
				Body string
			}
		}

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date body } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID:   resp.CreateEntry.ID,
			Body: &body,
		}))

		if resp2.UpdateEntry.Body != body {
			t.Fatal("expected body to be '", body, "'but got: ", resp2.UpdateEntry.Body)
		}
	})

	t.Run("update entry date", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID   string
				Date string
			}
		}

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
		}))

		date := "2021-01-02"

		var resp2 struct {
			UpdateEntry struct {
				ID   string
				Date string
			}
		}

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID:   resp.CreateEntry.ID,
			Date: &date,
		}))

		if resp2.UpdateEntry.Date != date {
			t.Fatal("expected date to be '", date, "'but got: ", resp2.UpdateEntry.Date)
		}
	})

	// add tag to entry
	t.Run("add tag to entry", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID   string
				Date string
			}
		}

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
		}))

		var resp2 struct {
			UpdateEntry struct {
				ID   string
				Date string
				Tags []struct {
					ID string
				}
			}
		}

		tagID := "gZOvnaaMmLjPzbWev4Y44"

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date tags { id } } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID: resp.CreateEntry.ID,
			TagIds: []string{
				tagID,
			},
		}))

		if len(resp2.UpdateEntry.Tags) != 1 {
			t.Fatal("expected entry to have 1 tag but got", len(resp2.UpdateEntry.Tags))
		}
	})

	// remove tag from entry
	t.Run("remove tag from entry", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID   string
				Date string
			}
		}

		tagID := "gZOvnaaMmLjPzbWev4Y44"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			TagIds: []string{
				tagID,
			},
		}))

		var resp2 struct {
			UpdateEntry struct {
				ID   string
				Date string
				Tags []struct {
					ID string
				}
			}
		}

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date tags { id } } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID:     resp.CreateEntry.ID,
			TagIds: []string{},
		}))

		if len(resp2.UpdateEntry.Tags) != 0 {
			t.Fatal("expected entry to have 0 tags but got", len(resp2.UpdateEntry.Tags))
		}
	})

	// add competence to entry
	t.Run("add competence to entry", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
			}
		}

		userID := "VU51iPRp80DGgaZxBM3W2"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date users { id } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			UserIds: []string{
				userID,
			},
		}))

		var resp2 struct {
			UpdateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
				UserCompetences []struct {
					ID string
				}
			}
		}

		competenceID := "OSENW3fO5fxs2IN8aTH9n"

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date userCompetences { id } } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID: resp.CreateEntry.ID,
			UserCompetences: []*model.UpdateUserCompetenceInput{
				{
					CompetenceID: competenceID,
					Level:        1,
					UserID:       userID,
				},
			},
		}))

		if len(resp2.UpdateEntry.UserCompetences) != 1 {
			t.Fatal("expected entry to have 1 competence but got", len(resp2.UpdateEntry.UserCompetences))
		}
	})

	// remove competence from entry
	t.Run("remove competence from entry", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
			}
		}

		userID := "VU51iPRp80DGgaZxBM3W2"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date users { id } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			UserIds: []string{
				userID,
			},
		}))

		var resp2 struct {
			UpdateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
				UserCompetences []struct {
					ID string
				}
			}
		}

		competenceID := "OSENW3fO5fxs2IN8aTH9n"

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date userCompetences { id } } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID: resp.CreateEntry.ID,
			UserCompetences: []*model.UpdateUserCompetenceInput{
				{
					CompetenceID: competenceID,
					Level:        1,
					UserID:       userID,
				},
			},
		}))

		if len(resp2.UpdateEntry.UserCompetences) != 1 {
			t.Fatal("expected entry to have 1 competence but got", len(resp2.UpdateEntry.UserCompetences))
		}

		var resp3 struct {
			UpdateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
				UserCompetences []struct {
					ID string
				}
			}
		}

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date userCompetences { id } } }`, &resp3, client.Var("input", model.UpdateEntryInput{
			ID:              resp.CreateEntry.ID,
			UserCompetences: []*model.UpdateUserCompetenceInput{},
		}))

		if len(resp3.UpdateEntry.UserCompetences) != 0 {
			t.Fatal("expected entry to have 0 competences but got", len(resp3.UpdateEntry.UserCompetences))
		}
	})

	// add user to entry
	t.Run("add user to entry", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
			}
		}

		userID := "VU51iPRp80DGgaZxBM3W2"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date users { id } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			UserIds: []string{
				userID,
			},
		}))

		var resp2 struct {
			UpdateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
			}
		}

		userID2 := "u2wHWUbnWUaUUjBeNvQ4u"

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date users { id } } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID: resp.CreateEntry.ID,
			UserIds: []string{
				userID,
				userID2,
			},
		}))

		if len(resp2.UpdateEntry.Users) != 2 {
			t.Fatal("expected entry to have 2 users but got", len(resp2.UpdateEntry.Users))
		}
	})

	// remove user from entry
	t.Run("remove user from entry", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
			}
		}

		userID := "VU51iPRp80DGgaZxBM3W2"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date users { id } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			UserIds: []string{
				userID,
			},
		}))

		var resp2 struct {
			UpdateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
			}
		}

		userID2 := "u2wHWUbnWUaUUjBeNvQ4u"

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date users { id } } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID: resp.CreateEntry.ID,
			UserIds: []string{
				userID,
				userID2,
			},
		}))

		if len(resp2.UpdateEntry.Users) != 2 {
			t.Fatal("expected entry to have 2 users but got", len(resp2.UpdateEntry.Users))
		}

		var resp3 struct {
			UpdateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
			}
		}

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date users { id } } }`, &resp3, client.Var("input", model.UpdateEntryInput{
			ID: resp.CreateEntry.ID,
			UserIds: []string{
				userID,
			},
		}))

		if len(resp3.UpdateEntry.Users) != 1 {
			t.Fatal("expected entry to have 1 users but got", len(resp3.UpdateEntry.Users))
		}
	})

	// removing user also removes user competences for that user

	// add event
	t.Run("add event", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
			}
		}

		userID := "VU51iPRp80DGgaZxBM3W2"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date users { id } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			UserIds: []string{
				userID,
			},
		}))

		var resp2 struct {
			UpdateEntry struct {
				ID     string
				Date   string
				Events []struct {
					ID string
				}
			}
		}

		eventID := "0JuXpamtNw8v9t7NukNqw"

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date events { id } } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID: resp.CreateEntry.ID,
			EventIds: []string{
				eventID,
			},
		}))

		if len(resp2.UpdateEntry.Events) != 1 {
			t.Fatal("expected entry to have 1 event but got", len(resp2.UpdateEntry.Events))
		}
	})

	// remove events
	t.Run("remove event", func(t *testing.T) {
		var resp struct {
			CreateEntry struct {
				ID    string
				Date  string
				Users []struct {
					ID string
				}
			}
		}

		userID := "VU51iPRp80DGgaZxBM3W2"

		c.MustPost(`mutation createEntry($input: CreateEntryInput!) { createEntry(input: $input) { id date users { id } } }`, &resp, client.Var("input", model.CreateEntryInput{
			Date: "2021-01-01",
			Body: "This is a test entry",
			UserIds: []string{
				userID,
			},
		}))

		var resp2 struct {
			UpdateEntry struct {
				ID     string
				Date   string
				Events []struct {
					ID string
				}
			}
		}

		eventID := "0JuXpamtNw8v9t7NukNqw"

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date events { id } } }`, &resp2, client.Var("input", model.UpdateEntryInput{
			ID: resp.CreateEntry.ID,
			EventIds: []string{
				eventID,
			},
		}))

		if len(resp2.UpdateEntry.Events) != 1 {
			t.Fatal("expected entry to have 1 event but got", len(resp2.UpdateEntry.Events))
		}

		var resp3 struct {
			UpdateEntry struct {
				ID     string
				Date   string
				Events []struct {
					ID string
				}
			}
		}

		c.MustPost(`mutation updateEntry($input: UpdateEntryInput!) { updateEntry(input: $input) { id date events { id } } }`, &resp3, client.Var("input", model.UpdateEntryInput{
			ID:       resp.CreateEntry.ID,
			EventIds: []string{},
		}))

		if len(resp3.UpdateEntry.Events) != 0 {
			t.Fatal("expected entry to have 0 events but got", len(resp3.UpdateEntry.Events))
		}
	})

}

func testClient() *client.Client {
	const jwtSecret = "12345678"
	signer := jwt.NewSigner(jwtSecret)

	dbConn := testDB()

	jwtToken := testJWT(dbConn)

	// Create a test user
	auth := client.AddHeader("Authorization", jwtToken)
	return client.New(middleware.TestAuth(signer)(handler.NewDefaultServer(NewExecutableSchema(Config{Resolvers: &Resolver{
		DB: dbConn,
	}}))), auth)
}

func testJWT(dbConn *bun.DB) string {
	ctx := context.Background()
	var user db.User
	id := "u2wHWUbnWUaUUjBeNvQ4u"

	err := dbConn.NewSelect().Model(&user).Where("id = ?", id).Scan(ctx)
	if err != nil {
		panic(err)
	}

	jwtUser := jwt.User{
		ID:             user.ID,
		Role:           user.Role,
		OrganisationID: user.OrganisationID,
		FirstName:      user.FirstName,
		LastName:       user.LastName,
		Email:          user.Email,
	}

	signer := jwt.NewSigner("12345678")

	// generate a new JWT token
	token, err := signer.Sign(jwt.Claims{
		User: jwtUser,
		StandardClaims: jwt2.StandardClaims{
			IssuedAt: time.Now().Unix(),
			// expires in 24 hours
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
	})

	return token
}

func testDB() *bun.DB {
	dsn := "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"
	// dsn := "unix://user:pass@dbname/var/run/postgresql/.s.PGSQL.5432"
	dbConn := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))

	dbClient := bun.NewDB(dbConn, pgdialect.New())

	// Print all queries to stdout.
	dbClient.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))

	return dbClient
}
