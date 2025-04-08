<script setup lang="ts">
import { PenIcon, UsersIcon, GridIcon, BadgeCheckIcon, CalendarDaysIcon, ChartPieIcon, TagsIcon, LogOutIcon, Settings2Icon } from "lucide-vue-next"

const links = [
  {
    name: "Einträge",
    to: "/entries",
    icon: PenIcon
  },
  {
    name: "Schüler",
    to: "/students",
    icon: UsersIcon
  },
  {
    name: "Projekte",
    to: "/projects",
    icon: GridIcon
  },
  {
    name: "Kompetenzen",
    to: "/competences",
    icon: BadgeCheckIcon
  },
  {
    name: "Anwesenheit",
    to: "/attendances",
    icon: CalendarDaysIcon
  },
  {
    name: "Berichte",
    to: "/reports",
    icon: ChartPieIcon
  },
  {
    name: "Tags",
    to: "/tags",
    icon: TagsIcon
  }
]

const footerLinks = [
  {
    name: "Einstellungen",
    to: "/settings/organisation",
    icon: Settings2Icon
  },
  {
    name: "Abmelden",
    to: "/logout",
    icon: LogOutIcon
  }
]
</script>

<template>
  <div class="flex h-full max-h-screen flex-col sm:flex-row">
    <DPageSidebar :links="links" :footer-links="footerLinks" />
    <main class="flex-1 overflow-scroll">
      <slot></slot>
    </main>
  </div>
</template>
