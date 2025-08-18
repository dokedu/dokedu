<script setup lang="ts">
import { UsersIcon, ArrowLeft, SchoolIcon, UserIcon, DownloadIcon } from "lucide-vue-next"

const links = [
  {
    name: "Zurück",
    to: "/entries",
    icon: ArrowLeft
  },
  {
    name: "Organisation",
    to: "/settings/organisation",
    icon: SchoolIcon
  },
  {
    name: "Benutzer",
    to: "/settings/users",
    icon: UsersIcon
  },
  {
    name: "Schüler",
    to: "/settings/students",
    icon: UsersIcon
  },
  {
    name: "Datenexport",
    to: "/settings/data-export",
    icon: DownloadIcon
  }
  // {
  //   name: "Profil",
  //   to: "/settings/profile",
  //   icon: UserIcon
  // }
]
</script>

<template>
  <div class="flex h-full max-h-screen flex-col sm:flex-row">
    <DPageSidebar :links="links" :footer-links="[]" />
    <main class="flex-1 overflow-scroll">
      <slot></slot>
    </main>
  </div>
</template>
