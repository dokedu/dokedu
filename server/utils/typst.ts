import { spawn } from "node:child_process"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { nanoid } from "nanoid"

interface TypstRenderOptions {
  logo?: Buffer
  fontPaths?: string[]
}

export async function typstRenderTemplate(template: string, data: Record<string, any> = {}, options: TypstRenderOptions = {}): Promise<Buffer> {
  // Create a temporary directory
  const tmpDir = `/tmp/x-dokedu/typst/${nanoid()}`
  await mkdir(tmpDir, { recursive: true })

  try {
    // Write the template file
    await writeFile(`${tmpDir}/template.typ`, template)

    // Write the data.json file
    await writeFile(`${tmpDir}/data.json`, JSON.stringify(data))

    // Write logo if provided
    if (options.logo) {
      await writeFile(`${tmpDir}/logo.png`, options.logo)
    }

    // Prepare font paths
    const fontPaths = options.fontPaths || ["/usr/share/fonts", "/usr/local/share/fonts"]

    // Prepare typst command arguments
    const args = ["compile"]

    // Add font paths in production
    if (!process.dev && fontPaths.length > 0) {
      args.push("--font-path", fontPaths.join(":"))
    }

    args.push(`${tmpDir}/template.typ`, `${tmpDir}/output.pdf`)

    // Spawn typst process
    const typst = spawn("typst", args)

    // Capture stdout
    typst.stdout.on("data", (data) => {
      console.log("[Typst Output]:", data.toString())
    })

    // Capture stderr
    let stderrBuffer = ""
    let hasError = false

    typst.stderr.on("data", (data) => {
      const output = data.toString()
      stderrBuffer += output

      // Check if it's a warning or an actual error
      if (output.toLowerCase().includes("error:") && !output.toLowerCase().includes("warning:")) {
        hasError = true
      }

      // Log all stderr output for debugging
      console.warn("[Typst stderr]:", output)
    })

    // Wait for the typst process to finish
    const exitCode = await new Promise<number>((resolve) => {
      typst.on("close", (code) => resolve(code ?? 0))
    })

    // Check for errors
    if (exitCode !== 0 || hasError) {
      throw new Error(`Typst compilation failed with exit code ${exitCode}: ${stderrBuffer}`)
    }

    // Read the output PDF
    const output = await readFile(`${tmpDir}/output.pdf`)

    return output
  } finally {
    // Clean up the temporary directory
    await rm(tmpDir, { recursive: true, force: true })
  }
}
