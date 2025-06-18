import { relations } from "drizzle-orm"
import { pgTable, timestamp, text, integer, AnyPgColumn, date, primaryKey, unique, jsonb, index } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

// Types
export type UserRole = "owner" | "admin" | "teacher" | "educator" | "student" | "parent"
export type StudentSex = "male" | "female" | "other"
export type CompetenceType = "subject" | "group" | "competence"
export type UserAttendanceState = "unknown" | "present" | "absent" | "late" | "sick"

// Helpers
const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true })
}

const organisationId = {
  organisationId: text()
    .notNull()
    .references(() => organisations.id)
}

// Tables
export const organisations = pgTable("organisations", {
  id: text().primaryKey().$defaultFn(nanoid),
  name: text().notNull(),
  logoFileId: text(),
  stripeSubscriptionId: text(),
  stripeCustomerId: text().unique(),
  ...timestamps
})

export const files = pgTable("files", {
  id: text().primaryKey().$defaultFn(nanoid),
  name: text().notNull(),
  mimeType: text(),
  size: integer().default(0),
  parentId: text().references((): AnyPgColumn => files.id),
  ...organisationId,
  ...timestamps
})

const userStudent = {
  studentSex: text().$type<StudentSex>().default("other"),
  studentLeftAt: date({ mode: "date" }),
  studentJoinedAt: date({ mode: "date" }),
  studentGrade: text(),
  studentBirthday: date({ mode: "date" }),
  studentNationality: text(),
  studentComments: text(),
  studentBirthplace: text(),
  studentEmoji: text(),
  studentMissedHours: integer(),
  studentMissedHoursExcused: integer()
}

export const users = pgTable("users", {
  id: text().primaryKey().$defaultFn(nanoid),
  firstName: text().notNull(),
  lastName: text().notNull(),
  email: text().unique(),
  password: text(),
  role: text().$type<UserRole>().notNull().default("student"),
  resetPasswordToken: text(),
  resetPasswordExpiresAt: timestamp({ withTimezone: true }),
  ...userStudent,
  ...organisationId,
  ...timestamps
})

export const sessions = pgTable(
  "sessions",
  {
    token: text().notNull().unique(),
    userId: text()
      .notNull()
      .references(() => users.id),
    ...timestamps
  },
  (t) => [primaryKey({ columns: [t.token, t.userId] })]
)

export const entries = pgTable("entries", {
  id: text().primaryKey().$defaultFn(nanoid),
  date: date({ mode: "date" }).notNull(),
  body: text().notNull(),
  userId: text()
    .notNull()
    .references(() => users.id),
  ...organisationId,
  ...timestamps
})

export const entryUsers = pgTable(
  "entry_users",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    entryId: text()
      .notNull()
      .references(() => entries.id),
    userId: text()
      .notNull()
      .references(() => users.id),
    ...organisationId,
    ...timestamps
  },
  (t) => [
    //
    unique().on(t.entryId, t.userId),
    index().on(t.userId, t.entryId)
  ]
)

export const competences = pgTable("competences", {
  id: text().primaryKey().$defaultFn(nanoid),
  name: text().notNull(),
  competenceId: text().references((): AnyPgColumn => competences.id),
  competenceType: text().$type<CompetenceType>().notNull(),
  grades: jsonb().notNull(),
  color: text(),
  parents: jsonb().$type<string[]>(), // Array of parent competence IDs from root to this competence
  sortOrder: integer().default(0),
  createdBy: text().references(() => users.id),
  ...organisationId,
  ...timestamps
})

export const userCompetences = pgTable(
  "user_competences",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    level: integer().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id),
    entryId: text().references(() => entries.id),
    competenceId: text()
      .notNull()
      .references(() => competences.id),
    createdBy: text().references(() => users.id),
    ...organisationId,
    ...timestamps
  },
  (t) => [
    //
    unique().on(t.userId, t.competenceId, t.entryId),
    index().on(t.userId, t.entryId)
  ]
)

export const entryFiles = pgTable(
  "entry_files",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    entryId: text()
      .notNull()
      .references(() => entries.id),
    fileId: text()
      .notNull()
      .references(() => files.id),
    ...organisationId,
    ...timestamps
  },
  (t) => [unique().on(t.entryId, t.fileId)]
)

export const events = pgTable("events", {
  id: text().primaryKey().$defaultFn(nanoid),
  title: text().notNull(),
  body: text().notNull(),
  startsAt: timestamp({ withTimezone: true }).notNull(),
  endsAt: timestamp({ withTimezone: true }).notNull(),
  recurrence: text(),
  ...organisationId,
  ...timestamps
})

export const entryEvents = pgTable(
  "entry_events",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    entryId: text()
      .notNull()
      .references(() => entries.id),
    eventId: text()
      .notNull()
      .references(() => events.id),
    ...organisationId,
    ...timestamps
  },
  (t) => [
    //
    unique().on(t.entryId, t.eventId),
    index().on(t.eventId, t.entryId)
  ]
)

export type ReportStatus = "draft" | "in_progress" | "in_review" | "completed"

export const reports = pgTable("reports", {
  id: text().primaryKey().$defaultFn(nanoid),
  status: text().$type<ReportStatus>().notNull().default("draft"),
  studentId: text()
    .notNull()
    .references(() => users.id),
  content: jsonb(),
  fileId: text(),
  ...organisationId,
  ...timestamps
})

export const eventCompetences = pgTable(
  "event_competences",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    eventId: text()
      .notNull()
      .references(() => events.id),
    competenceId: text()
      .notNull()
      .references(() => competences.id),
    ...organisationId,
    ...timestamps
  },
  (t) => [unique().on(t.eventId, t.competenceId)]
)

export const tags = pgTable("tags", {
  id: text().primaryKey().$defaultFn(nanoid),
  name: text().notNull(),
  color: text(),
  ...organisationId,
  ...timestamps
})

export const entryTags = pgTable(
  "entry_tags",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    entryId: text()
      .notNull()
      .references(() => entries.id),
    tagId: text()
      .notNull()
      .references(() => tags.id),
    ...organisationId,
    ...timestamps
  },
  (t) => [
    //
    unique().on(t.entryId, t.tagId),
    index().on(t.tagId, t.entryId)
  ]
)

export const userAttendances = pgTable(
  "user_attendances",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    userId: text()
      .notNull()
      .references(() => users.id),
    date: date({ mode: "date" }).notNull(),
    state: text().$type<UserAttendanceState>().notNull(),
    createdBy: text()
      .notNull()
      .references(() => users.id),
    comment: text(),
    minutesDelayed: integer().default(0),
    ...organisationId,
    ...timestamps
  },
  (t) => [unique().on(t.date, t.userId, t.organisationId)]
)

export const groups = pgTable("groups", {
  id: text().primaryKey().$defaultFn(nanoid),
  name: text().notNull(),
  ...organisationId,
  ...timestamps
})

export const groupUsers = pgTable(
  "group_users",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    groupId: text()
      .notNull()
      .references(() => groups.id),
    userId: text()
      .notNull()
      .references(() => users.id),
    ...organisationId,
    ...timestamps
  },
  (t) => [unique().on(t.groupId, t.userId, t.organisationId)]
)

// **** Relations **** ///

export const usersRelations = relations(users, ({ one, many }) => ({
  entries: many(entryUsers),
  userAttendances: many(userAttendances)
}))

export const entryUsersRelations = relations(entryUsers, ({ one, many }) => ({
  entry: one(entries, {
    fields: [entryUsers.entryId],
    references: [entries.id]
  }),
  user: one(users, {
    fields: [entryUsers.userId],
    references: [users.id]
  })
}))

export const entryTagsRelations = relations(entryTags, ({ one, many }) => ({
  entry: one(entries, {
    fields: [entryTags.entryId],
    references: [entries.id]
  }),
  tag: one(tags, {
    fields: [entryTags.tagId],
    references: [tags.id]
  })
}))

export const userCompetencesRelations = relations(userCompetences, ({ one, many }) => ({
  entry: one(entries, {
    fields: [userCompetences.entryId],
    references: [entries.id]
  }),
  competence: one(competences, {
    fields: [userCompetences.competenceId],
    references: [competences.id]
  }),
  user: one(users, {
    fields: [userCompetences.userId],
    references: [users.id]
  })
}))

export const entryEventsRelations = relations(entryEvents, ({ one, many }) => ({
  entry: one(entries, {
    fields: [entryEvents.entryId],
    references: [entries.id]
  }),
  event: one(events, {
    fields: [entryEvents.eventId],
    references: [events.id]
  })
}))

export const entriesRelations = relations(entries, ({ one, many }) => ({
  user: one(users, {
    fields: [entries.userId],
    references: [users.id]
  }),
  entryUsers: many(entryUsers),
  entryTags: many(entryTags),
  userCompetences: many(userCompetences),
  entryEvents: many(entryEvents)
}))

export const userAttendancesRelations = relations(userAttendances, ({ one, many }) => ({
  user: one(users, {
    fields: [userAttendances.userId],
    references: [users.id]
  })
}))

export const reportsRelations = relations(reports, ({ one, many }) => ({
  student: one(users, {
    fields: [reports.studentId],
    references: [users.id]
  })
}))
