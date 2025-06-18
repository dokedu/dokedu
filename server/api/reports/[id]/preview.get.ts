import { organisations, reports } from "~~/server/database/schema"
import { spawn } from "node:child_process"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { de } from "date-fns/locale"
import { nanoid } from "nanoid"
import { formatDate } from "date-fns"
import { z } from "zod"
import sharp from "sharp"
import { competences, userCompetences } from "~~/server/database/schema"
import { colors } from "~~/packages/report_generation/utils/color.json"
import { and, eq, inArray, isNull, desc } from "drizzle-orm"

const querySchema = z.object({
  updatedAt: z.coerce.date().optional()
})

// Helper function to get hex color from color name and shade
function getHexColor(colorName: string, shade: keyof typeof colors): string {
  const colorShade = colors[shade]
  return colorShade[colorName as keyof typeof colorShade] || colorShade.blue
}

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

  // Fetch competences data if selected in report
  let competencesData: any[] = []
  const selectedCompetenceIds = (report.content as any)?.competences || []

  if (selectedCompetenceIds.length > 0) {
    // Fetch all selected competences AND their children (recursively)
    // First, get all selected competences
    const selectedCompetences = await useDrizzle()
      .select()
      .from(competences)
      .where(and(inArray(competences.id, selectedCompetenceIds), eq(competences.organisationId, secure.organisationId), isNull(competences.deletedAt)))

    // Now fetch ALL competences from the organization to build the full tree
    const allCompetences = await useDrizzle()
      .select()
      .from(competences)
      .where(and(eq(competences.organisationId, secure.organisationId), isNull(competences.deletedAt)))

    // Build a set of all competence IDs we need (selected + all their descendants)
    const neededCompetenceIds = new Set<string>()

    // Helper function to recursively add children
    const addChildrenRecursively = (parentId: string) => {
      allCompetences
        .filter((c) => c.competenceId === parentId)
        .forEach((child) => {
          neededCompetenceIds.add(child.id)
          addChildrenRecursively(child.id)
        })
    }

    // Add selected competences and all their children
    selectedCompetenceIds.forEach((id: string) => {
      neededCompetenceIds.add(id)
      addChildrenRecursively(id)
    })

    // Filter to only needed competences
    const relevantCompetences = allCompetences.filter((c) => neededCompetenceIds.has(c.id))

    // Fetch user competence levels for ALL relevant competences
    const userCompetenceLevels = await useDrizzle()
      .select({
        competenceId: userCompetences.competenceId,
        level: userCompetences.level,
        createdAt: userCompetences.createdAt
      })
      .from(userCompetences)
      .where(and(eq(userCompetences.userId, report.studentId), isNull(userCompetences.deletedAt), eq(userCompetences.organisationId, secure.organisationId)))
      .orderBy(desc(userCompetences.createdAt))

    // Create a map of competenceId to latest level
    const competenceLevels = new Map<string, number>()
    const processedCompetences = new Set<string>()

    userCompetenceLevels.forEach((uc) => {
      if (!processedCompetences.has(uc.competenceId)) {
        competenceLevels.set(uc.competenceId, uc.level)
        processedCompetences.add(uc.competenceId)
      }
    })

    // Helper function to build competence tree recursively
    const buildCompetenceTree = (parentId: string | null): any[] => {
      return relevantCompetences
        .filter((c) => c.competenceId === parentId)
        .map((competence) => {
          if (competence.competenceType === "competence") {
            // Leaf node - actual competence
            return {
              id: competence.id,
              name: competence.name,
              level: competenceLevels.get(competence.id) || 0,
              type: "competence",
              sortOrder: competence.sortOrder
            }
          } else {
            // Group node - has children
            return {
              id: competence.id,
              name: competence.name,
              type: "group",
              children: buildCompetenceTree(competence.id),
              sortOrder: competence.sortOrder
            }
          }
        })
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name))
    }

    // Find all subjects (either directly selected or parents of selected items)
    const subjectIds = new Set<string>()
    selectedCompetences.forEach((comp) => {
      if (comp.competenceType === "subject") {
        subjectIds.add(comp.id)
      } else if (comp.parents && comp.parents.length > 0) {
        // Find the subject parent (first in the parents array)
        subjectIds.add(comp.parents[0])
      }
    })

    // Get all subject competences
    const subjectCompetences = relevantCompetences.filter((c) => c.competenceType === "subject" && subjectIds.has(c.id))

    // Build the final structure starting from subjects
    const subjects = subjectCompetences
      .map((subject) => {
        const children = buildCompetenceTree(subject.id)

        // Flatten the structure for the template (collect all leaf competences)
        const flattenCompetences = (items: any[]): any[] => {
          const result: any[] = []
          items.forEach((item) => {
            if (item.type === "competence") {
              result.push(item)
            } else if (item.children) {
              // Add group header
              result.push({
                name: item.name,
                type: "group",
                level: -1 // Special marker for groups
              })
              result.push(...flattenCompetences(item.children))
            }
          })
          return result
        }

        const flatCompetences = flattenCompetences(children)

        return {
          id: subject.id,
          name: subject.name,
          color: getHexColor(subject.color || "blue", "100"),
          color200: getHexColor(subject.color || "blue", "200"),
          color900: getHexColor(subject.color || "blue", "900"),
          competences: flatCompetences
        }
      })
      .filter((subject) => subject.competences.length > 0) // Only include subjects with competences
      .sort((a, b) => a.name.localeCompare(b.name))

    competencesData = subjects
  }

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
  const templateContent = competencesData.length > 0 ? TEMPLATE + "\n\n" + TEMPLATE_COMPETENCES : TEMPLATE
  await writeFile(`${tmpDir}/template.typ`, templateContent)
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
      has_logo: !!school?.logoFileId,
      competences: competencesData
    })
  )

  const fontPaths = [
    "/usr/share/fonts", // System fonts
    "/usr/local/share/fonts" // Local system fonts
    // "/usr/share/fonts/truetype/inter" // Our custom Inter fonts
  ].join(":")

  let typst
  if (process.dev) {
    typst = spawn("typst", ["compile", `${tmpDir}/template.typ`, `${tmpDir}/output.pdf`])
  } else {
    typst = spawn("typst", ["compile", "--font-path", fontPaths, `${tmpDir}/template.typ`, `${tmpDir}/output.pdf`])
  }

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
paper: "a4",
margin: (
  top: 1.5cm,
  bottom: 1.5cm,
  x: 1.5cm,
),
  footer: context [
    #set text(size: 8pt)
    #grid(
      columns: (1fr, auto),
      align: left,
      [
        Lernstandsbericht für #full_name
      ],
      [
   
        #align(right, [Seite #counter(page).display("1 von 1", both: true)])
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

#align(center, text(size: 12pt, weight: "regular", "Ersatzschule in freier Trägerschaft"))

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



#if data.description != "N/A" and data.description != "" [
  #pagebreak()

  #data.description
]

`

const TEMPLATE_COMPETENCES = `#pagebreak()
#set text(size: 9pt)

#let count = counter("count")
#let n = 0

#for subject in data.competences [
  #count.step()
  
  #table(
    columns: (1fr, auto),
    inset: 6pt,
    fill: (_, row) => if calc.even(row) { rgb(subject.color) } else { white },
    stroke: rgb(subject.color200),
    align: horizon,
    text(size: 9pt + 2pt, fill: rgb(subject.color900), [*#subject.name*]), text(size: 9pt + 2pt, fill: rgb(subject.color900),[*Niveau*]),
    ..subject.competences.map(row => (
      text(fill: rgb(subject.color900),[#row.name]),
      align(center, grid(columns: (auto, auto, auto), gutter: 2pt, inset: 0pt, align: bottom, 
          if row.level >= 1 [
            #rect(width: 4pt, height: 6pt, fill: rgb(subject.color900), radius: 1pt)
          ] else [
            #rect(width: 4pt, height: 6pt, fill: rgb(subject.color200), radius: 1pt)
          ],
          if row.level >= 2 [
            #rect(width: 4pt, height: 10pt, fill: rgb(subject.color900), radius: 1pt)
          ] else [
            #rect(width: 4pt, height: 10pt, fill: rgb(subject.color200), radius: 1pt)
          ],
          if row.level >= 3 [
            #rect(width: 4pt, height: 14pt, fill: rgb(subject.color900), radius: 1pt)
          ] else [
            #rect(width: 4pt, height: 14pt, fill: rgb(subject.color200), radius: 1pt)
          ]
        ))
      ,
      )
    ).flatten(),
  )

  #context [
      #if data.competences.len() > count.get().first() [
        #pagebreak()
    ]
  ]
]`
