import type {
  competences,
  entries,
  entryEvents,
  entryFiles,
  entryTags,
  entryUsers,
  eventCompetences,
  events,
  files,
  groups,
  groupUsers,
  organisations,
  reports,
  reportTemplates,
  tags,
  userAttendances,
  userCompetences,
  users
} from "~~/server/database/schema"

export type DCompetence = typeof competences.$inferSelect
export type DEntry = typeof entries.$inferSelect
export type DEntryEvent = typeof entryEvents.$inferSelect
export type DEntryFile = typeof entryFiles.$inferSelect
export type DEntryTag = typeof entryTags.$inferSelect
export type DEntryUser = typeof entryUsers.$inferSelect
export type DEventCompetence = typeof eventCompetences.$inferSelect
export type DEvent = typeof events.$inferSelect
export type DFile = typeof files.$inferSelect
export type DGroupUser = typeof groupUsers.$inferSelect
export type DGroup = typeof groups.$inferSelect
export type DOrganisation = typeof organisations.$inferSelect
export type DReportTemplate = typeof reportTemplates.$inferSelect
export type DReport = typeof reports.$inferSelect
export type DTag = typeof tags.$inferSelect
export type DUserAttendance = typeof userAttendances.$inferSelect
export type DUserCompetence = typeof userCompetences.$inferSelect
export type DUser = typeof users.$inferSelect
