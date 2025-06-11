import { competences, organisations } from "~~/server/database/schema"
import { useDrizzle } from "~~/server/utils/drizzle"
import { nanoid } from "nanoid"

async function importCompetencesRecursively() {
  const db = useDrizzle()

  // 1) fetch your organisation
  const [organisation] = await db.select().from(organisations).limit(1)
  if (!organisation) throw new Error("No organisation found")

  // 2) your nested data
  const data = [
    {
      id: nanoid(),
      name: "Mathe",
      color: "red",
      grades: [1, 2, 3],
      children: [
        {
          id: nanoid(),
          name: "Analysis",
          children: [
            {
              id: nanoid(),
              name: "Analysis 1"
            },
            {
              id: nanoid(),
              name: "Analysis 2"
            }
          ]
        }
      ]
    }
  ]

  // 3) Wrap inserts in a transaction for safety
  await db.transaction(async (tx) => {
    // recursive helper
    async function insertNode(
      node: {
        id?: string
        name: string
        color?: string
        grades?: number[]
        children?: (typeof node)[]
      },
      parentId: string | null = null
    ) {
      const id = node.id ?? nanoid()
      await tx.insert(competences).values({
        id,
        name: node.name,
        competenceType: "subject",
        color: node.color ?? "",
        grades: node.grades ?? [],
        competenceId: parentId,
        organisationId: organisation.id
      })
      if (node.children) {
        for (const child of node.children) {
          await insertNode(child, id)
        }
      }
    }

    // start recursion
    for (const root of data) {
      await insertNode(root, null)
    }
  })

  console.log("All competences imported.")
}

// run it
await importCompetencesRecursively()

process.exit(1)
