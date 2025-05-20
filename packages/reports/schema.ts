import { z } from "zod"

export const reportsSettingSchema = z.object({
  id: z.string()
})

export const reportStatusSchema = z.enum(["draft", "in_progress", "done"])

export const richTextSchema = z.string()

export const reportSchema = z.object({
  id: z.string(),
  status: reportStatusSchema,
  student: z.object({
    id: z.string(),
    name: z.string(),
    surname: z.string(),
    birthdate: z.date(),
    grade: z.number().min(1).max(13)
  }),
  header: richTextSchema,
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      order: z.string(),
      description: richTextSchema
    })
  ),
  subjects: z.object({
    id: z.string(),
    name: z.string(),
    competences: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        level: z.number().min(1).max(3)
      })
    )
  }),
  footer: richTextSchema
})
