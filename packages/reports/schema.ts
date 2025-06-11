import { z } from "zod"

export const richTextSchema = z.string()

export const lexoString = z.string()

const reportBlockSchema = z.union([
  z.object({
    id: z.string(),
    type: z.enum(["cover"]),
    order: lexoString
  }),
  z.object({
    id: z.string(),
    type: z.enum(["richtext"]),
    order: lexoString,
    text: richTextSchema
  }),
  z.object({
    id: z.string(),
    type: z.enum(["competences"]),
    order: lexoString,
    filter: z.object({
      subjects: z.array(z.string()).default([]),
      level: z.object({
        min: z.number().default(0),
        max: z.number().default(3)
      }),
      date: z.object({
        from: z.date().nullable(),
        to: z.date().nullable()
      })
    })
  })
])

export const reportSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  blocks: z.array(reportBlockSchema)
})
