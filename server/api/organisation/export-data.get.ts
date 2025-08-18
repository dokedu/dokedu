import { eq } from "drizzle-orm"
import archiver from "archiver"
import { stringify } from "csv-stringify/sync"
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
    // Fetch all data for the organization
    const [
      organisationData,
      usersData,
      entriesData,
      entryUsersData,
      competencesData,
      userCompetencesData,
      entryFilesData,
      eventsData,
      entryEventsData,
      reportsData,
      eventCompetencesData,
      tagsData,
      entryTagsData,
      userAttendancesData,
      groupsData,
      groupUsersData,
      filesData
    ] = await Promise.all([
      db.select().from(organisations).where(eq(organisations.id, orgId)),
      // Exclude sensitive user data: password, resetPasswordToken, resetPasswordExpiresAt
      db
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
        .where(eq(users.organisationId, orgId)),
      db.select().from(entries).where(eq(entries.organisationId, orgId)),
      db.select().from(entryUsers).where(eq(entryUsers.organisationId, orgId)),
      db.select().from(competences).where(eq(competences.organisationId, orgId)),
      db.select().from(userCompetences).where(eq(userCompetences.organisationId, orgId)),
      db.select().from(entryFiles).where(eq(entryFiles.organisationId, orgId)),
      db.select().from(events).where(eq(events.organisationId, orgId)),
      db.select().from(entryEvents).where(eq(entryEvents.organisationId, orgId)),
      db.select().from(reports).where(eq(reports.organisationId, orgId)),
      db.select().from(eventCompetences).where(eq(eventCompetences.organisationId, orgId)),
      db.select().from(tags).where(eq(tags.organisationId, orgId)),
      db.select().from(entryTags).where(eq(entryTags.organisationId, orgId)),
      db.select().from(userAttendances).where(eq(userAttendances.organisationId, orgId)),
      db.select().from(groups).where(eq(groups.organisationId, orgId)),
      db.select().from(groupUsers).where(eq(groupUsers.organisationId, orgId)),
      db.select().from(files).where(eq(files.organisationId, orgId))
    ])

    // Create ZIP archive
    const archive = archiver("zip", {
      zlib: { level: 9 } // Maximum compression
    })

    // Helper function to convert data to CSV
    const dataToCSV = (data: any[], columns?: string[]) => {
      if (data.length === 0) {
        // Return header only for empty data
        return columns ? stringify([columns]) : ""
      }

      // Convert dates and complex objects to strings
      const processedData = data.map((row) => {
        const processed: any = {}
        for (const [key, value] of Object.entries(row)) {
          if (value instanceof Date) {
            processed[key] = value.toISOString()
          } else if (value !== null && typeof value === "object") {
            processed[key] = JSON.stringify(value)
          } else {
            processed[key] = value
          }
        }
        return processed
      })

      return stringify(processedData, {
        header: true,
        columns: columns || Object.keys(data[0])
      })
    }

    // Add CSV files to archive
    const exportData = [
      { name: "organisations.csv", data: organisationData },
      { name: "users.csv", data: usersData },
      { name: "entries.csv", data: entriesData },
      { name: "entry_users.csv", data: entryUsersData },
      { name: "competences.csv", data: competencesData },
      { name: "user_competences.csv", data: userCompetencesData },
      { name: "entry_files.csv", data: entryFilesData },
      { name: "events.csv", data: eventsData },
      { name: "entry_events.csv", data: entryEventsData },
      { name: "reports.csv", data: reportsData },
      { name: "event_competences.csv", data: eventCompetencesData },
      { name: "tags.csv", data: tagsData },
      { name: "entry_tags.csv", data: entryTagsData },
      { name: "user_attendances.csv", data: userAttendancesData },
      { name: "groups.csv", data: groupsData },
      { name: "group_users.csv", data: groupUsersData },
      { name: "files.csv", data: filesData }
    ]

    for (const { name, data } of exportData) {
      const csv = dataToCSV(data)
      archive.append(csv, { name })
    }

    // Add metadata file
    const metadata = {
      exportDate: new Date().toISOString(),
      organisationId: orgId,
      organisationName: organisationData[0]?.name || "Unknown",
      exportedBy: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      },
      recordCounts: {
        organisations: organisationData.length,
        users: usersData.length,
        entries: entriesData.length,
        entryUsers: entryUsersData.length,
        competences: competencesData.length,
        userCompetences: userCompetencesData.length,
        entryFiles: entryFilesData.length,
        events: eventsData.length,
        entryEvents: entryEventsData.length,
        reports: reportsData.length,
        eventCompetences: eventCompetencesData.length,
        tags: tagsData.length,
        entryTags: entryTagsData.length,
        userAttendances: userAttendancesData.length,
        groups: groupsData.length,
        groupUsers: groupUsersData.length,
        files: filesData.length
      },
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

    // Set response headers
    const fileName = `dokedu-export-${orgId}-${new Date().toISOString().split("T")[0]}.zip`
    setHeader(event, "Content-Type", "application/zip")
    setHeader(event, "Content-Disposition", `attachment; filename="${fileName}"`)

    // Return the archive stream
    return sendStream(event, archive)
  } catch (error) {
    console.error("Error exporting data:", error)
    throw createError({ statusCode: 500, message: "Failed to export data" })
  }
})
