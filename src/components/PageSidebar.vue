<template>
  <header class="bg-gray-100 max-w-[230px] w-full h-screen p-1 flex flex-col justify-between border-r border-gray-200">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center py-1 px-3">
        <div class="flex gap-3">
          <div>{{ apps.find(el => el.id === activeApp).icon }}</div>
          <router-link :to="{ name: 'home'}" class="text-gray-700 hover:text-gray-950 duration-100 hover:font-medium transition-all">Musterschule</router-link>
        </div>
        <div class="border p-2 rounded-md hover:bg-gray-200 border-gray-300 transition-all" @click="switchApp">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.66667 1.33333C4.66667 0.596954 5.26362 0 6 0C6.73638 0 7.33333 0.596954 7.33333 1.33333C7.33333 2.06971 6.73638 2.66667 6 2.66667C5.26362 2.66667 4.66667 2.06971 4.66667 1.33333Z" fill="#374151"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.66667 6C4.66667 5.26362 5.26362 4.66667 6 4.66667C6.73638 4.66667 7.33333 5.26362 7.33333 6C7.33333 6.73638 6.73638 7.33333 6 7.33333C5.26362 7.33333 4.66667 6.73638 4.66667 6Z" fill="#374151"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.66667 10.6667C4.66667 9.93029 5.26362 9.33333 6 9.33333C6.73638 9.33333 7.33333 9.93029 7.33333 10.6667C7.33333 11.403 6.73638 12 6 12C5.26362 12 4.66667 11.403 4.66667 10.6667Z" fill="#374151"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.33333 1.33333C9.33333 0.596954 9.93029 0 10.6667 0C11.403 0 12 0.596954 12 1.33333C12 2.06971 11.403 2.66667 10.6667 2.66667C9.93029 2.66667 9.33333 2.06971 9.33333 1.33333Z" fill="#374151"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.33333 6C9.33333 5.26362 9.93029 4.66667 10.6667 4.66667C11.403 4.66667 12 5.26362 12 6C12 6.73638 11.403 7.33333 10.6667 7.33333C9.93029 7.33333 9.33333 6.73638 9.33333 6Z" fill="#374151"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.33333 10.6667C9.33333 9.93029 9.93029 9.33333 10.6667 9.33333C11.403 9.33333 12 9.93029 12 10.6667C12 11.403 11.403 12 10.6667 12C9.93029 12 9.33333 11.403 9.33333 10.6667Z" fill="#374151"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 1.33333C0 0.596954 0.596954 0 1.33333 0C2.06971 0 2.66667 0.596954 2.66667 1.33333C2.66667 2.06971 2.06971 2.66667 1.33333 2.66667C0.596954 2.66667 0 2.06971 0 1.33333Z" fill="#374151"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 6C0 5.26362 0.596954 4.66667 1.33333 4.66667C2.06971 4.66667 2.66667 5.26362 2.66667 6C2.66667 6.73638 2.06971 7.33333 1.33333 7.33333C0.596954 7.33333 0 6.73638 0 6Z" fill="#374151"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10.6667C0 9.93029 0.596954 9.33333 1.33333 9.33333C2.06971 9.33333 2.66667 9.93029 2.66667 10.6667C2.66667 11.403 2.06971 12 1.33333 12C0.596954 12 0 11.403 0 10.6667Z" fill="#374151"/>
          </svg>
        </div>
      </div>
      <div>
        <router-link
            v-for="link in apps.find(el => el.id === activeApp).links" :to="{ name: link.route}"
            class="flex gap-3 duration-100 text-gray-700 px-3 p-1 hover:bg-gray-200 rounded-md transition-all hover:text-gray-950 hover:font-medium"
            active-class="bg-gray-200 font-medium text-gray-950"
        >
          <div>
            {{ link.icon}}
          </div>
          <div>
            {{ link.name}}
          </div>
        </router-link>
      </div>
    </div>
    <div>
      <router-link :to="{ name: 'login'}" class="px-4 py-4 block text-gray-500">Log out</router-link>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {useRoute} from "vue-router";

const activeApp = ref<string>('record')

const route = useRoute()

interface AppLink {
  icon: string
  name: string
  route: string
}

interface App {
  id: string
  icon: string
  name: string
  links: AppLink[]
}

const apps: App[] = [
  {
    id: 'record',
    icon: '🖊️',
    name: "Dokumentation",
    links: [
      {
        icon: "📑️",
        name: "Einträge",
        route: "record-entries"
      },
      {
        icon: "📑️",
        name: "Students",
        route: "record-students"
      },
      {
        icon: "📑️",
        name: "Goals",
        route: "home"
      },
      {
        icon: "📑️",
        name: "Projects",
        route: "home"
      },
      {
        icon: "📑️",
        name: "Competences",
        route: "home"
      },
      {
        icon: "📑️",
        name: "Reports",
        route: "home"
      }
    ]
  },
  {
    id: 'admin',
    icon: '🛠️',
    name: "Admin",
    links: [
      {
        icon: "👥",
        name: "Users",
        route: "admin-users"
      }
    ]
  }
]

function switchApp() {
  activeApp.value = activeApp.value === 'record' ? 'admin' : 'record'
}

</script>