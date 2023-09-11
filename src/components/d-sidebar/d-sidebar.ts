import { FunctionalComponent, computed } from "vue";

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
} from "lucide-vue-next";

import type { RouteNamedMap } from "vue-router/auto/routes";
import i18n from "@/i18n.ts";

export interface AppLink {
  icon: FunctionalComponent;
  name: string;
  route: keyof RouteNamedMap;
}

export type UserRole = "owner" | "admin" | "teacher" | "student";

export interface App {
  id: string;
  beta?: boolean;
  allowedUserRoles: UserRole[];
  icon: FunctionalComponent;
  name: string;
  links: AppLink[];
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
        route: "/settings/profile",
      },
    ],
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
        route: "/record/entries/",
      },
      {
        // icon: "users-01",
        icon: Users,
        name: i18n.global.t("student", 2),
        route: "/record/students/",
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
        route: "/record/projects/",
      },
      {
        // icon: "check-done-01",
        icon: CopyCheck,
        name: i18n.global.t("competence", 2),
        route: "/record/competences/",
      },
      {
        icon: PieChart,
        name: i18n.global.t("report", 2),
        route: "/record/reports/",
      },
      {
        icon: Tag,
        name: i18n.global.t("tag", 2),
        route: "/record/tags/",
      },
    ],
  },
  {
    id: "drive",
    beta: true,
    icon: Folder,
    allowedUserRoles: ["owner", "admin", "teacher", "student"],
    name: "Drive",
    links: [
      {
        icon: HardDrive,
        name: i18n.global.t("my_drive"),
        route: "/drive/my-drive/",
      },
      {
        icon: HardDrive,
        name: i18n.global.t("shared_drives"),
        route: "/drive/shared-drives/",
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
        route: "/drive/trash/",
      },
    ],
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
        route: "/admin/general/",
      },
      {
        // icon: "👥",
        icon: Users,
        name: i18n.global.t("user", 2),
        route: "/admin/users",
      },
      {
        // icon: "👥",
        icon: Landmark,
        name: i18n.global.t("billing"),
        route: "/admin/billing/",
      },
      {
        icon: Mails,
        name: i18n.global.t("group", 2),
        route: "/admin/groups",
      },
      {
        icon: Globe,
        name: i18n.global.t("domain", 2),
        route: "/admin/domains",
      },
    ],
  },
  {
    id: "school",
    icon: School,
    allowedUserRoles: ["owner", "admin", "teacher"],
    name: "Schulverwaltung",
    links: [
      {
        // icon: "👥",
        icon: UserSquare,
        name: i18n.global.t("student", 2),
        route: "/school/students",
      },
    ],
  },
]);
