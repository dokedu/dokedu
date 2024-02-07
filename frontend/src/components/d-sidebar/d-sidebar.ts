import { computed } from "vue"

import {
  Globe,
  CopyCheck,
  Folder,
  Grid,
  HardDrive,
  Landmark,
  Mails,
  Pen,
  PieChart,
  School,
  Settings,
  Tag,
  Trash2,
  Users,
  UserSquare,
  Wrench,
  TimerIcon,
  MessageCircle,
  InboxIcon,
  MailOpenIcon
} from "lucide-vue-next"

import type { Icon as LucideIcon } from "@/types/types"

import type { RouteNamedMap } from "vue-router/auto/routes"
import i18n from "@/i18n"

export interface AppLink {
  icon: LucideIcon
  name: string
  route: keyof RouteNamedMap
  params?: Record<string, string | number>
}

export type UserRole = "owner" | "admin" | "teacher" | "student"

export interface App {
  id: string
  beta?: boolean
  allowedUserRoles: UserRole[]
  icon: LucideIcon
  name: string
  links: AppLink[]
}

export const apps = computed<App[]>(() => [
  {
    id: "settings",
    icon: Settings,
    allowedUserRoles: [],
    name: i18n.global.t("settings"),
    links: [
      {
        // icon: "file-check-02",
        icon: Settings,
        name: i18n.global.t("settings"),
        route: "/settings/profile"
      }
    ]
  },
  {
    id: "record",
    icon: Pen,
    allowedUserRoles: ["owner", "admin", "teacher"],
    name: "Dokumentation",
    links: [
      {
        // icon: "file-check-02",
        icon: Pen,
        name: i18n.global.t("entry", 2),
        route: "/record/entries/"
      },
      {
        // icon: "users-01",
        icon: Users,
        name: i18n.global.t("student", 2),
        route: "/record/students/"
      },
      // {
      //   // icon: "flag-04",
      //   icon: Flag,
      //   name: "Goals",
      //   route: "home",
      // },
      {
        // icon: "grid-01",
        icon: Grid,
        name: i18n.global.t("project", 2),
        route: "/record/projects/"
      },
      {
        // icon: "check-done-01",
        icon: CopyCheck,
        name: i18n.global.t("competence", 2),
        route: "/record/competences/"
      },
      {
        icon: TimerIcon,
        name: i18n.global.t("attendance", 2),
        route: "/record/attendances/"
      },
      {
        icon: PieChart,
        name: i18n.global.t("report", 2),
        route: "/record/reports/"
      },
      {
        icon: Tag,
        name: i18n.global.t("tag", 2),
        route: "/record/tags/"
      }
    ]
  },
  {
    id: "drive",
    beta: true,
    icon: Folder,
    allowedUserRoles: ["owner", "admin", "teacher"],
    name: "Drive",
    links: [
      {
        icon: HardDrive,
        name: i18n.global.t("my_drive"),
        route: "/drive/my-drive/"
      },
      {
        icon: HardDrive,
        name: i18n.global.t("shared_drives"),
        route: "/drive/shared-drives/"
      },
      // {
      //     icon: Users2,
      //     name: i18n.global.t("shared_with_me"),
      //     route: "/drive/shared-with-me/",
      // },
      // {
      //   icon: Clock,
      //   name: "Recent",
      //   route: "admin-users",
      // },
      // {
      //   icon: Star,
      //   name: "Starred",
      //   route: "admin-users",
      // },
      {
        icon: Trash2,
        name: i18n.global.t("trash"),
        route: "/drive/trash/"
      }
    ]
  },
  {
    id: "admin",
    icon: Wrench,
    allowedUserRoles: ["owner", "admin"],
    name: "Admin",
    links: [
      {
        // icon: "👥",
        icon: Settings,
        name: i18n.global.t("general"),
        route: "/admin/general/"
      },
      {
        // icon: "👥",
        icon: Users,
        name: i18n.global.t("user", 2),
        route: "/admin/users"
      },
      {
        // icon: "👥",
        icon: Landmark,
        name: i18n.global.t("billing"),
        route: "/admin/billing/"
      },
      {
        icon: Mails,
        name: i18n.global.t("group", 2),
        route: "/admin/groups"
      },
      {
        icon: Globe,
        name: i18n.global.t("domain", 2),
        route: "/admin/domains"
      }
    ]
  },
  {
    id: "school",
    icon: School,
    allowedUserRoles: ["owner", "admin", "teacher"],
    name: "Schule",
    links: [
      {
        // icon: "👥",
        icon: UserSquare,
        name: i18n.global.t("student", 2),
        route: "/school/students"
      }
      // {
      //   // icon: "👥",
      //   icon: UserSquare,
      //   name: i18n.global.t("subject", 2),
      //   route: "/school/subjects",
      // },
      // {
      //   // icon: "👥",
      //   icon: UserSquare,
      //   name: i18n.global.t("grade", 2),
      //   route: "/school/grades",
      // },
      // {
      //   // icon: "👥",
      //   icon: UserSquare,
      //   name: i18n.global.t("school_year", 2),
      //   route: "/school/school_years",
      // },
      // {
      //   // icon: "👥",
      //   icon: UserSquare,
      //   name: i18n.global.t("certificate", 2),
      //   route: "/school/certificates",
      // },
    ]
  },
  {
    id: "chat",
    icon: MessageCircle,
    beta: true,
    allowedUserRoles: ["owner", "admin", "teacher", "student"],
    name: "Chat",
    links: [
      {
        icon: MessageCircle,
        name: i18n.global.t("chat"),
        route: "/chat/[tab]",
        params: { tab: "chats" }
      }
    ]
  },
  {
    id: "mail",
    icon: MailOpenIcon,
    allowedUserRoles: ["owner", "admin", "teacher", "student"],
    name: "Mail",
    links: [
      {
        icon: InboxIcon,
        name: i18n.global.t("inbox"),
        route: "/mail/"
      }
    ]
  }
])
