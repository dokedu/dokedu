import { z } from "zod"
import { reports } from "~~/server/database/schema"
import { mkdir, writeFile, readFile, rm, rmdir } from "node:fs/promises"
import { loader as entriesLoader } from "~~/packages/report_generation/entries"
import { loader as competencesLoader } from "~~/packages/report_generation/competences"
import { loader as learnedCompetencesLoader } from "~~/packages/report_generation/learned_competences"
import { ChildProcessWithoutNullStreams, spawn } from "node:child_process"

const payloadSchema = z.object({
  id: z.string()
})

export default defineTask({
  meta: {
    name: "report:generate",
    description: "Generate a report"
  },
  async run({ payload, context }) {
    // const { id } = payloadSchema.parse(payload)

    // try {
    //   const result = await useDrizzle().select().from(reports).where(eq(reports.id, id))
    //   const report = result[0]

    //   console.info(`Running a report task ${report.id}`)
    //   if (report.status !== "pending") return { result: { success: false } }

    //   await useDrizzle().update(reports).set({ status: "processing", updatedAt: new Date() }).where(eq(reports.id, id))

    //   const reportTemplate = await useDrizzle().query.reportTemplates.findFirst({ where: eq(reportTemplates.id, report.templateId!) })
    //   if (!reportTemplate) return { result: { success: false } }

    //   // Create tmp directory
    //   const reportDir = `/tmp/x-dokedu/reports/${report.id}`
    //   await mkdir(reportDir, { recursive: true })

    //   // Write template file
    //   const templatePath = `${reportDir}/template.typ`
    //   await writeFile(templatePath, reportTemplate.template)

    //   let data: any

    //   switch (reportTemplate.name) {
    //     case "competences":
    //       data = await competencesLoader(report.id)
    //       break
    //     case "entries":
    //       data = await entriesLoader(report.id)
    //       break
    //     case "learned_competences":
    //       data = await learnedCompetencesLoader(report.id)
    //       break
    //     default:
    //       throw new Error(`Unknown report template ${reportTemplate.name}`)
    //   }

    //   // Write the data file
    //   const dataPath = `${reportDir}/data.json`
    //   await writeFile(dataPath, JSON.stringify(data))

    //   // Fetch the logo https://storage.dokedu.org/public/amsel.jpg and store it to the report directory as amsel.jpg
    //   const logoResponse = await fetch("https://app.dokedu.org/assets/amsel-logo.jpg")
    //   const logoBuffer = await logoResponse.arrayBuffer()
    //   const logoPath = `${reportDir}/amsel.jpg`
    //   await writeFile(logoPath, Buffer.from(logoBuffer))

    //   const outputPath = `${reportDir}/report.pdf`

    //   const exitCode = await compileTypstDocument(templatePath, outputPath)
    //   if (exitCode !== 0) throw new Error(`Typst compilation failed with exit code ${exitCode}`)

    //   // Read the generated PDF file
    //   const pdfBuffer = await readFile(outputPath)
    //   console.info(`PDF buffer length: ${pdfBuffer.length}`)

    //   // cleanup
    //   // await rm(templatePath)
    //   // await rm(dataPath)
    //   // await rm(outputPath)
    //   // await rm(logoPath)
    //   // await rmdir(reportDir, { recursive: true })

    //   await useStorage("files").setItemRaw(`reports:${report.id}`, pdfBuffer)
    //   console.info(`Report stored in storage`)

    //   // Update the report status
    //   await useDrizzle().update(reports).set({ status: "done", updatedAt: new Date() }).where(eq(reports.id, id))
    //   console.info(`Report status updated`)

    //   return { result: { success: true } }
    // } catch (error) {
    //   console.error(error)
    //   // Update the report status
    //   await useDrizzle().update(reports).set({ status: "error", updatedAt: new Date() }).where(eq(reports.id, id))
    //   return { result: { success: false } }
    // }

    return { result: { success: true } }
  }
})

async function compileTypstDocument(templatePath: string, outputPath: string) {
  const fontPaths = [
    "/usr/share/fonts", // System fonts
    "/usr/local/share/fonts" // Local system fonts
    // "/usr/share/fonts/truetype/inter" // Our custom Inter fonts
  ].join(":")

  let proc: ChildProcessWithoutNullStreams

  if (process.dev) {
    proc = spawn("typst", ["compile", templatePath, outputPath])
  } else {
    proc = spawn("typst", ["compile", "--font-path", fontPaths, templatePath, outputPath])
  }

  proc.stderr.on("data", (data) => {
    console.error(`Typst compilation error: ${data}`)
  })

  return new Promise((resolve, reject) => {
    proc.on("close", (code) => {
      console.log(`Typst compilation exited with code ${code}`)
      resolve(code)
    })

    proc.on("error", (err) => {
      console.log("Error during Typst compilation:", err)
      reject(err)
    })
  })
}
