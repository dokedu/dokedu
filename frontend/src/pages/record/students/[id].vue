<template>
  <PageWrapper>
    <div class="flex h-full min-h-full w-full divide-x divide-neutral-100 rounded-xl bg-white">
      <div class="flex w-full flex-col">
        <div class="border-b border-neutral-100 py-4 px-6">
          <div class="flex items-center gap-1 text-strong">
            <router-link :to="{ name: '/record/students/' }" class="mr-2">
              <DIconButton :icon="X" size="md"></DIconButton>
            </router-link>
            <router-link :to="{ name: '/record/students/' }" class="cursor-pointer rounded text-sm font-medium">
              {{ $t("student", 2) }}
            </router-link>
            <ChevronRight :size="18" class="stroke-neutral-500" />
            <span class="text-sm text-neutral-950">
              {{ data?.user?.firstName }} {{ data?.user?.lastName }} {{ data?.user?.student?.emoji }}
            </span>
          </div>
        </div>
        <div class="flex flex-col grow min-h-0 flex-1">
          <RouterView />
        </div>
      </div>
      <div class="w-full max-w-xs pb-4">
        <div class="flex flex-col items-center border-b border-neutral-100 py-6">
          <div class="h-24 w-24 rounded-full" :class="`bg-${color}-500`">
            <div class="flex h-full w-full items-center justify-center">
              <div class="text-3xl font-semibold text-white">
                {{ data?.user?.firstName[0] }}{{ data?.user?.lastName[0] }}
              </div>
            </div>
          </div>
          <div class="mt-4 text-sm font-medium text-neutral-950">
            {{ data?.user?.firstName }} {{ data?.user?.lastName }}
            {{ data?.user?.student?.emoji }}
          </div>
        </div>
        <div class="space-y-3 border-b border-neutral-100 px-6 py-6">
          <div class="grid grid-cols-3">
            <div class="col-span-2 text-sm text-neutral-600">{{ $t("grade") }}</div>
            <div class="text-sm font-medium text-strong">{{ data?.user?.student?.grade }}</div>
          </div>
          <div class="grid grid-cols-3">
            <div class="col-span-2 text-sm text-neutral-600">{{ $t("joined_at") }}</div>
            <div class="text-sm font-medium text-strong">
              {{ data?.user?.student?.joinedAt ? toNormalisedDate(data?.user?.student?.joinedAt) : "-" }}
            </div>
          </div>
          <div class="grid grid-cols-3">
            <div class="col-span-2 text-sm text-neutral-600">{{ $t("left_at") }}</div>
            <div class="text-sm font-medium text-strong">
              {{ data?.user?.student?.leftAt ? toNormalisedDate(data?.user?.student?.joinedAt) : "-" }}
            </div>
          </div>
        </div>
        <div class="space-y-3 border-b border-neutral-100 px-6 py-6">
          <div class="grid grid-cols-3">
            <div class="col-span-2 text-sm text-neutral-600">{{ $t("entry", 2) }}</div>
            <div class="text-sm font-medium text-strong">{{ data?.user?.student?.entriesCount }}</div>
          </div>
          <div class="grid grid-cols-3">
            <div class="col-span-2 text-sm text-neutral-600">{{ $t("competence", 2) }}</div>
            <div class="text-sm font-medium text-strong">
              {{ data?.user?.student?.competencesCount }}
            </div>
          </div>
          <div class="grid grid-cols-3">
            <div class="col-span-2 text-sm text-neutral-600">{{ $t("project", 2) }}</div>
            <div class="text-sm font-medium text-strong">
              {{ data?.user?.student?.eventsCount }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "../../../components/page-wrapper.vue"
import { useRoute } from "vue-router/auto"
import { ChevronRight, X } from "lucide-vue-next"
import { computed, reactive, ref } from "vue"
import DIconButton from "@/components/d-icon-button/d-icon-button.vue"
import { definePage } from "vue-router/auto"
import { useUserByIdQuery } from "@/gql/queries/users/userById"

definePage({
  redirect: () => ({ name: "/record/students/[id]/competences/" })
})

const route = useRoute<"/record/students/[id]">()

const id = computed<string>(() => route.params.id as string)

// colors for tailwind
// bg-blue-500
// bg-green-500
// bg-red-500
// bg-purple-500
// bg-indigo-500
// bg-teal-500
// Randomly generate avatar color
const colors = ["blue", "green", "red", "purple", "indigo", "teal"]
const color = ref(colors[Math.floor(Math.random() * colors.length)])

const toNormalisedDate = (date: string) => {
  const d = new Date(date)

  const day = String(d.getUTCDate()).padStart(2, "0")
  const month = String(d.getUTCMonth() + 1).padStart(2, "0")
  const year = d.getUTCFullYear()

  return `${day}.${month}.${year}`
}

const { data } = useUserByIdQuery({
  variables: reactive({ id })
})
</script>
