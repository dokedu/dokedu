<template>
  <PageWrapper>
    <div class="h-full p-3">
      <div
        class="flex h-full min-h-full w-full divide-x divide-stone-100 rounded-xl border border-stone-50 bg-white shadow"
      >
        <div class="col-span-3 flex h-full w-full flex-col px-6 py-4">
          <div class="border-b border-stone-100 pb-4">
            <div class="flex items-center gap-1 text-strong">
              <router-link
                :to="{ name: 'record-students' }"
                class="mr-3 cursor-pointer rounded-lg border border-stone-200 p-2"
              >
                <X :size="16" class="stroke-stone-500"></X>
              </router-link>
              <router-link :to="{ name: 'record-students' }" class="cursor-pointer rounded text-sm font-medium">
                Students
              </router-link>
              <ChevronRight :size="18" class="stroke-stone-500" />
              <span class="text-sm text-stone-950">{{ data?.user?.firstName }} {{ data?.user?.lastName }}</span>
            </div>
          </div>
          <div class="flex h-full flex-col pt-6">
            <div class="flex gap-1">
              <RouterLink :to="{ name: 'record-students-student-competences' }">
                <DButton
                  :type="
                    $route.matched.some(({ path }) => path.includes('/record/students/:id/competences'))
                      ? 'primary'
                      : 'transparent'
                  "
                  size="sm"
                  :icon-left="CopyCheck"
                >
                  Competences
                </DButton>
              </RouterLink>
              <RouterLink :to="{ name: 'record-students-student-entries' }">
                <DButton
                  :type="
                    $route.matched.some(({ path }) => path.includes('/record/students/:id/entries'))
                      ? 'primary'
                      : 'transparent'
                  "
                  size="sm"
                  :icon-left="FileCheck"
                  >Entries</DButton
                >
              </RouterLink>
            </div>
            <div class="mt-4 h-full">
              <RouterView />
            </div>
          </div>
        </div>
        <div class="w-full max-w-xs pb-4 pt-5">
          <div class="border-b border-stone-100 px-6 pb-6 text-sm font-medium">Profile</div>
          <div class="flex flex-col items-center border-b border-stone-100 py-6">
            <div class="h-24 w-24 rounded-full" :class="`bg-${color}-500`">
              <div class="flex h-full w-full items-center justify-center">
                <div class="text-3xl font-bold text-white">
                  {{ data?.user?.firstName[0] }} {{ data?.user?.lastName[0] }}
                </div>
              </div>
            </div>
            <div class="mt-4 text-sm font-medium text-stone-950">
              {{ data?.user?.firstName }} {{ data?.user?.lastName }}
            </div>
          </div>
          <div class="space-y-3 border-b border-stone-100 px-6 py-6">
            <div class="grid grid-cols-3">
              <div class="col-span-2 text-sm text-stone-600">Grade</div>
              <div class="text-sm font-medium text-strong">{{ data?.user?.student?.grade }}</div>
            </div>
            <div class="grid grid-cols-3">
              <div class="col-span-2 text-sm text-stone-600">Joined At</div>
              <div class="text-sm font-medium text-strong">
                {{ data?.user?.student?.joinedAt ? toNormalisedDate(data?.user?.student?.joinedAt) : "-" }}
              </div>
            </div>
            <div class="grid grid-cols-3">
              <div class="col-span-2 text-sm text-stone-600">Left At</div>
              <div class="text-sm font-medium text-strong">
                {{ data?.user?.student?.leftAt ? toNormalisedDate(data?.user?.student?.joinedAt) : "-" }}
              </div>
            </div>
          </div>
          <div class="space-y-3 border-b border-stone-100 px-6 py-6">
            <div class="grid grid-cols-3">
              <div class="col-span-2 text-sm text-stone-600">Entries</div>
              <div class="text-sm font-medium text-strong">{{ data?.user?.student?.entriesCount }}</div>
            </div>
            <div class="grid grid-cols-3">
              <div class="col-span-2 text-sm text-stone-600">Competences</div>
              <div class="text-sm font-medium text-strong">
                {{ data?.user?.student?.competencesCount }}
              </div>
            </div>
            <div class="grid grid-cols-3">
              <div class="col-span-2 text-sm text-stone-600">Projects</div>
              <div class="text-sm font-medium text-strong">
                {{ data?.user?.student?.eventsCount }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "../../../components/PageWrapper.vue";
import { useQuery } from "@urql/vue";
import { useRoute } from "vue-router";
import { ChevronRight, X } from "lucide-vue-next";
import { graphql } from "../../../gql";
import { computed, reactive, ref } from "vue";
import DButton from "../../../components/d-button/d-button.vue";
import { CopyCheck, FileCheck } from "lucide-vue-next";

const route = useRoute();

const id = computed<string>(() => route.params.id as string);

// colors for tailwind
// bg-blue-500
// bg-green-500
// bg-red-500
// bg-purple-500
// bg-indigo-500
// bg-teal-500
// Randomly generate avatar color
const colors = ["blue", "green", "red", "purple", "indigo", "teal"];
const color = ref(colors[Math.floor(Math.random() * colors.length)]);

const toNormalisedDate = (date: string) => {
  const d = new Date(date);

  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();

  return `${day}.${month}.${year}`;
};

const { data } = useQuery({
  query: graphql(`
    query userById($id: ID!) {
      user(id: $id) {
        id
        firstName
        lastName
        student {
          id
          grade
          joinedAt
          leftAt
          entriesCount
          competencesCount
          eventsCount
        }
      }
    }
  `),
  variables: reactive({ id }),
});
</script>
