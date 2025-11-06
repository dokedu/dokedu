import { eq } from "drizzle-orm"
import archiver from "archiver"
import { stringify } from "csv-stringify"
import {
  organisations,
  users,
  entries,
  entryUsers,
  competences,
  userCompetences,
  entryFiles,
  events,
  entryEvents,
  reports,
  eventCompetences,
  tags,
  entryTags,
  userAttendances,
  groups,
  groupUsers,
  files
} from "../../database/schema"

const BATCH_SIZE = 1000 // Process 1000 rows at a time

// Helper function to stream table data to CSV
const streamTableToCSV = async (tableName: string, query: any, archive: archiver.Archiver): Promise<number> => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      let offset = 0
      let rowCount = 0

      // Create CSV stringifier as a stream
      const stringifier = stringify({
        header: true
      })

      // Add the CSV stream to the archive
      archive.append(stringifier, { name: `${tableName}.csv` })

      // Fetch and stream data in batches
      while (true) {
        const batch = await query.limit(BATCH_SIZE).offset(offset)

        if (batch.length === 0) {
          break
        }

        // Process each row
        for (const row of batch) {
          // Convert dates and objects
          const finalRow: any = {}
          for (const [key, value] of Object.entries(row)) {
            if (value instanceof Date) {
              finalRow[key] = value.toISOString()
            } else if (value !== null && typeof value === "object") {
              finalRow[key] = JSON.stringify(value)
            } else {
              finalRow[key] = value
            }
          }

          stringifier.write(finalRow)
          rowCount++
        }

        // If we got fewer rows than batch size, we're done
        if (batch.length < BATCH_SIZE) {
          break
        }

        offset += BATCH_SIZE
      }

      // Close the stringifier stream
      stringifier.end()
      resolve(rowCount)
    } catch (error) {
      reject(error)
    }
  })
}

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event)
  if (!secure) throw createError({ statusCode: 401, message: "Unauthorized" })

  // Only allow admins and owners to export data
  if (user.role !== "admin" && user.role !== "owner") {
    throw createError({ statusCode: 403, message: "Forbidden: Only admins and owners can export data" })
  }

  const orgId = secure.organisationId
  const db = useDrizzle()

  try {
    // Create ZIP archive
    const archive = archiver("zip", {
      zlib: { level: 9 } // Maximum compression
    })

    // Set response headers BEFORE streaming
    const fileName = `dokedu-export-${orgId}-${new Date().toISOString().split("T")[0]}.zip`
    setHeader(event, "Content-Type", "application/zip")
    setHeader(event, "Content-Disposition", `attachment; filename="${fileName}"`)

    // Start streaming response immediately
    const responsePromise = sendStream(event, archive)

    // Get organisation data for metadata (small query, can be done upfront)
    const orgData = await db.select().from(organisations).where(eq(organisations.id, orgId))

    // Define all tables to export
    const tablesToExport = [
      {
        name: "organisations",
        query: db.select().from(organisations).where(eq(organisations.id, orgId)).$dynamic()
      },
      {
        name: "users",
        query: db
          .select({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            role: users.role,
            // Student fields
            studentSex: users.studentSex,
            studentLeftAt: users.studentLeftAt,
            studentJoinedAt: users.studentJoinedAt,
            studentGrade: users.studentGrade,
            studentBirthday: users.studentBirthday,
            studentNationality: users.studentNationality,
            studentComments: users.studentComments,
            studentBirthplace: users.studentBirthplace,
            studentEmoji: users.studentEmoji,
            studentMissedHours: users.studentMissedHours,
            studentMissedHoursExcused: users.studentMissedHoursExcused,
            // Organization and timestamps
            organisationId: users.organisationId,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            deletedAt: users.deletedAt
          })
          .from(users)
          .where(eq(users.organisationId, orgId))
          .$dynamic()
      },
      {
        name: "entries",
        query: db.select().from(entries).where(eq(entries.organisationId, orgId)).$dynamic()
      },
      {
        name: "entry_users",
        query: db.select().from(entryUsers).where(eq(entryUsers.organisationId, orgId)).$dynamic()
      },
      {
        name: "competences",
        query: db.select().from(competences).where(eq(competences.organisationId, orgId)).$dynamic()
      },
      {
        name: "user_competences",
        query: db.select().from(userCompetences).where(eq(userCompetences.organisationId, orgId)).$dynamic()
      },
      {
        name: "entry_files",
        query: db.select().from(entryFiles).where(eq(entryFiles.organisationId, orgId)).$dynamic()
      },
      {
        name: "events",
        query: db.select().from(events).where(eq(events.organisationId, orgId)).$dynamic()
      },
      {
        name: "entry_events",
        query: db.select().from(entryEvents).where(eq(entryEvents.organisationId, orgId)).$dynamic()
      },
      {
        name: "reports",
        query: db.select().from(reports).where(eq(reports.organisationId, orgId)).$dynamic()
      },
      {
        name: "event_competences",
        query: db.select().from(eventCompetences).where(eq(eventCompetences.organisationId, orgId)).$dynamic()
      },
      {
        name: "tags",
        query: db.select().from(tags).where(eq(tags.organisationId, orgId)).$dynamic()
      },
      {
        name: "entry_tags",
        query: db.select().from(entryTags).where(eq(entryTags.organisationId, orgId)).$dynamic()
      },
      {
        name: "user_attendances",
        query: db.select().from(userAttendances).where(eq(userAttendances.organisationId, orgId)).$dynamic()
      },
      {
        name: "groups",
        query: db.select().from(groups).where(eq(groups.organisationId, orgId)).$dynamic()
      },
      {
        name: "group_users",
        query: db.select().from(groupUsers).where(eq(groupUsers.organisationId, orgId)).$dynamic()
      },
      {
        name: "files",
        query: db.select().from(files).where(eq(files.organisationId, orgId)).$dynamic()
      }
    ]

    // Stream each table sequentially
    const recordCounts: Record<string, number> = {}
    for (const { name, query } of tablesToExport) {
      const count = await streamTableToCSV(name, query, archive)
      recordCounts[name] = count
    }

    // Add metadata file
    const metadata = {
      exportDate: new Date().toISOString(),
      organisationId: orgId,
      organisationName: orgData[0]?.name || "Unknown",
      exportedBy: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      },
      recordCounts,
      dataPrivacy: {
        excludedTables: ["sessions"],
        excludedColumns: {
          users: ["password", "resetPasswordToken", "resetPasswordExpiresAt"]
        },
        note: "Sensitive authentication data has been excluded from this export for security reasons."
      }
    }
    archive.append(JSON.stringify(metadata, null, 2), { name: "export_metadata.json" })

    // Finalize archive
    await archive.finalize()

    // Wait for response to finish
    return responsePromise
  } catch (error) {
    console.error("Error exporting data:", error)
    throw createError({ statusCode: 500, message: "Failed to export data" })
  }
})
