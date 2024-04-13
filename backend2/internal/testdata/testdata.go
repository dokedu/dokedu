package testdata

import _ "embed"

//go:embed "textfile.txt"
var Testfile []byte

//go:embed "studentImportWrongHeader.xlsx"
var StudentImportWrongHeader []byte

//go:embed "studentImportWrongBirthdate.xlsx"
var StudentImportWrongBirthdate []byte

//go:embed "studentImportData1.xlsx"
var StudentImportData1 []byte

//go:embed "studentImportData2.xlsx"
var StudentImportData2 []byte
