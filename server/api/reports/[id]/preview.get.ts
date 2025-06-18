import { organisations, reports } from "~~/server/database/schema"
import { spawn } from "node:child_process"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { de } from "date-fns/locale"
import { nanoid } from "nanoid"
import { formatDate } from "date-fns"
import { z } from "zod"
import sharp from "sharp"

const querySchema = z.object({
  updatedAt: z.coerce.date().optional()
})

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  const id = getRouterParam(event, "id")
  if (!id) throw createError({ statusCode: 404, message: "Not found" })

  const school = await useDrizzle().query.organisations.findFirst({
    where: and(eq(organisations.id, secure.organisationId))
  })

  const report = await useDrizzle().query.reports.findFirst({
    with: {
      student: true
    },
    where: and(eq(reports.id, id), eq(reports.organisationId, secure.organisationId))
  })
  if (!report) throw createError({ statusCode: 404, message: "Not found" })

  // generate a typst document with a hello world template
  // create a tmp directory
  const tmpDir = `/tmp/x-dokedu/reports/${report.id}-${nanoid()}`
  await mkdir(tmpDir, { recursive: true })

  // read from the current dir the logo.png and copy it to the tmp directory
  // const logo = await readFile(new URL("logo.png", import.meta.url))
  // await writeFile(`${tmpDir}/logo.png`, logo)

  // Fetch organization logo from storage if it exists
  if (school?.logoFileId) {
    const logoBuffer = await useStorage("files").getItemRaw(school.logoFileId)
    if (logoBuffer) {
      // Process the image with sharp to make it square and convert to PNG
      const processedLogo = await sharp(logoBuffer)
        .resize(512, 512, {
          fit: "cover",
          position: "center"
        })
        .png()
        .toBuffer()

      await writeFile(`${tmpDir}/logo.png`, processedLogo)
    }
  }

  // write the template to the tmp directory
  await writeFile(`${tmpDir}/template.typ`, TEMPLATE)
  // also write a data.json file with the respective data
  await writeFile(
    `${tmpDir}/data.json`,
    JSON.stringify({
      student_first_name: report?.student.firstName,
      student_last_name: report?.student.lastName,
      student_birthday: report?.student.studentBirthday,
      student_birthplace: report?.student.studentBirthplace,
      student_grade: report?.student.studentGrade,
      student_birth_date: report?.student.studentBirthday ? formatDate(report.student.studentBirthday, "dd. MMMM yyyy", { locale: de }) : "N/A",
      student_birth_place: report?.student.studentBirthplace ?? "N/A",
      school_year: (report?.content as any)?.schoolYear ?? "N/A",
      student_class: report?.student.studentGrade,
      description: (report?.content as any)?.introduction ?? "N/A",
      school_name: school?.name ?? "N/A",
      has_logo: !!school?.logoFileId
    })
  )

  const typst = spawn("typst", ["compile", `${tmpDir}/template.typ`, `${tmpDir}/output.pdf`])

  typst.stdout.on("data", (data) => {
    console.log(data.toString())
  })

  typst.stderr.on("data", (data) => {
    throw createError({ statusCode: 500, message: data.toString() })
  })

  // wait for the typst process to finish
  await new Promise((resolve) => typst.on("close", resolve))

  setHeader(event, "Content-Type", "application/pdf")

  let output: Buffer | null = null

  output = await readFile(`${tmpDir}/output.pdf`)

  // delete the tmp directory
  await rm(tmpDir, { recursive: true })

  return new Response(output)
})

const TEMPLATE = `#let data = json("data.json")

#let first_name = data.student_first_name
//#let middle_name = data.student_middle_name
#let last_name = data.student_last_name

#let full_name = ""

#let full_name = first_name + " " + last_name

// #if data.student_middle_name == "" {
//   full_name = first_name + " " + last_name
// } else {
//   full_name = first_name + " " + middle_name + " " + last_name
// }

#let school_year = data.school_year
#let student_class = data.student_grade
#let birth_date = data.student_birth_date
#let birth_place = data.student_birth_place

#set text(font: "Inter", lang: "de")

#set page(
  footer: context [
    #set text(size: 8pt)
    #grid(
      columns: (1fr, auto),
      align: left,
      [
        Lernstandsbericht für #full_name
      ],
      [
   
        #align(right, [Seite #counter(page).display("1/1", both: true)])
      ],
    )
  ]
)

#v(10%)


#if data.has_logo {
  align(center, image("logo.png", width: 25%))
} else {
  align(center, rect(width: 40%, height: 25%, fill: rgb(200, 200, 200)))
}

// #show par: set block(above: 1em, below: 1em)
#v(1em)

#align(center, text(size: 16pt, weight: "medium", data.school_name))

// #align(center, text(size: 12pt, weight: "regular", "Ersatzschule in freier Trägerschaft"))

#show heading: set block(above: 1.3em, below: 0.9em)

#align(center, text(size: 20pt, weight: "medium", heading(upper("Lernstandsbericht"))))

// #show par: set block(above: 1em, below: 1em)
#show par: set block(spacing: 1em)

#grid(
  columns: (1fr, 1fr),
  align: center,
  [Schuljahr #school_year],
  [Jahrgang #student_class],
)

\

#align(center, text(size: 14pt, weight: "bold", full_name))

#align(center, text(size: 10pt, weight: "regular", [
    geboren am #birth_date in #birth_place
]))

\

// #show par: set block(above: 1.3em, below: 1.5em)
#set par(spacing: 1.25em)
#set text(size: 11pt)
#set par(justify: true)

#pagebreak()

#data.description
`
