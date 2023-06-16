package main

import (
	"bytes"
	"embed"
	"example/pkg/db"
	"fmt"
	"html/template"
)

type UserCompetence struct {
	ID             string
	Name           string
	CompetenceType db.CompetenceType
	Parents        []UserCompetence
	Grades         []int
	Level          int
	AtLeastLevel1  bool
	AtLeastLevel2  bool
	AtLeastLevel3  bool
}

type Entry struct {
	ID              string
	Date            string
	Body            string
	CreatedAt       string
	User            User
	UserCompetences []UserCompetence
}

type User struct {
	ID        string
	FirstName string
	LastName  string
	FullName  string
}

type EntriesTemplate struct {
	Entries []Entry
}

//go:embed *.gohtml
var templateEmbeds embed.FS

func main() {
	tmpl := EntriesTemplate{}

	tmpl.Entries = append(tmpl.Entries, Entry{
		ID:        "1",
		Date:      "1. Juni 2023",
		CreatedAt: "1. Juni 2023 um 12:00 Uhr",
		Body:      "This is the body of the entry",
		User: User{
			ID:        "1",
			FirstName: "John",
			LastName:  "Doe",
			FullName:  "John Doe",
		},
		UserCompetences: []UserCompetence{
			{
				ID:             "3",
				Name:           "Competence",
				Level:          1,
				AtLeastLevel1:  true,
				AtLeastLevel2:  false,
				AtLeastLevel3:  false,
				CompetenceType: db.CompetenceTypeCompetence,
				Grades:         []int{1, 2, 3},
				Parents: []UserCompetence{
					{
						ID:             "1",
						Name:           "Subject",
						CompetenceType: db.CompetenceTypeSubject,
					}, {
						ID:             "2",
						Name:           "Group",
						CompetenceType: db.CompetenceTypeGroup,
					},
				},
			}, {
				ID:             "3",
				Name:           "Competence",
				Level:          4,
				AtLeastLevel1:  true,
				AtLeastLevel2:  true,
				AtLeastLevel3:  false,
				CompetenceType: db.CompetenceTypeCompetence,
				Grades:         []int{1, 2, 3},
				Parents: []UserCompetence{
					{
						ID:             "1",
						Name:           "Subject",
						CompetenceType: db.CompetenceTypeSubject,
					}, {
						ID:             "2",
						Name:           "Group",
						CompetenceType: db.CompetenceTypeGroup,
					},
				},
			},
		},
	})

	t, err := template.ParseFS(templateEmbeds, "reports.gohtml")
	if err != nil {
		panic(err)
	}

	out := new(bytes.Buffer)
	err = t.ExecuteTemplate(out, "reports.gohtml", tmpl)
	if err != nil {
		panic(err)
	}

	// print out the html
	fmt.Println(out)
}
