<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex w-full items-center justify-between gap-4">
        <div class="font-medium text-neutral-950">
          <router-link :to="{ name: '/record/projects/' }">{{ $t("project", 2) }}</router-link>
          / {{ $t("export") }}
        </div>

        <d-button type="primary" size="sm" :icon-right="Printer" @click="print">{{ $t("print") }} </d-button>
      </div>
    </PageHeader>
    <PageContent>
      <div class="flex h-full flex-col text-sm">
        <div class="flex h-full flex-col">
          <div class="flex items-center justify-between px-8 py-2 print:hidden">
            <div class="flex gap-2">
              <input
                v-model="filter.from"
                type="date"
                class="rounded-md border border-neutral-200 px-2 py-1 text-sm shadow-sm"
              />
              <input
                v-model="filter.to"
                type="date"
                class="rounded-md border border-neutral-200 px-2 py-1 text-sm shadow-sm"
              />
              <select
                name="deleted"
                id="deleted"
                v-model="filter.deleted"
                class="w-[140px] rounded-md border border-neutral-200 px-2 py-1 text-sm shadow-sm"
              >
                <option :value="false" :selected="!filter.deleted">{{ $t("active") }}</option>
                <option :value="true" :selected="filter.deleted">{{ $t("with_deleted") }}</option>
              </select>
            </div>
          </div>

          <div v-if="fetching" class="px-8 py-4 text-sm text-strong">{{ $t("loading") }}</div>

          <div
            v-if="events.length > 0"
            class="flex-1 overflow-scroll text-sm ring-neutral-950 ring-opacity-5 print:rounded-none print:p-0 print:shadow-none print:ring-opacity-0"
          >
            <table class="min-w-full divide-y divide-neutral-300">
              <thead class="bg-neutral-50">
                <tr class="divide-x divide-neutral-200">
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                    {{ $t("name") }}
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-neutral-900">
                    {{ $t("description") }}
                  </th>
                  <th scope="col" class="px-2 py-3.5 text-left text-sm font-semibold text-neutral-900">
                    {{ $t("competence", 2) }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200 bg-white">
                <tr v-for="event in events" :key="event.id" class="divide-x divide-neutral-200">
                  <td class="p-3 align-top font-medium text-neutral-700">
                    <div class="mb-2">{{ event.title }}</div>
                    <div class="text-xs text-neutral-500">
                      <span class="font-medium">{{ event.startsAt }}</span>
                      {{ $t("to") }}
                      <span class="font-medium">{{ event.endsAt }}</span>
                    </div>
                  </td>
                  <td class="p-3 align-top text-sm text-neutral-500">{{ event.body }}</td>
                  <td class="space w-3/5 p-0 align-top">
                    <div v-if="event.subjects.length > 0">
                      <div
                        v-for="subject in event.subjects.sort((a, b) => a.subject_name.localeCompare(b.subject_name))"
                        :key="subject.subject_id"
                        class=""
                      >
                        <table class="min-w-full divide-y divide-neutral-200">
                          <thead class="bg-neutral-50">
                            <tr class="divide-x divide-neutral-200">
                              <th scope="col" class="px-2 py-1.5 text-left text-sm font-medium text-neutral-700">
                                <strong>{{ subject.subject_name }}</strong>
                              </th>
                              <th scope="col" class="px-2 py-1.5 text-left text-sm font-medium text-neutral-700">
                                {{ $t("class", 2) }}
                              </th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-neutral-200 bg-white">
                            <tr
                              v-for="competence in subject.competences.sort((a: any, b: any) =>
                                a.name.localeCompare(b.name),
                              )"
                              :key="competence.id"
                              class="divide-x divide-neutral-200"
                            >
                              <td class="p-2 align-top text-sm text-neutral-500">{{ competence.name }}</td>
                              <td class="w-[50px] whitespace-nowrap p-2 text-center align-top text-sm text-neutral-500">
                                {{ gradeToText(competence.grades) }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div v-else class="p-2 pt-3 text-sm text-neutral-500">
                      {{ $t("no_competences") }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="events.length === 0">
            <div v-if="!fetching" class="px-8 py-4 text-sm text-strong">
              {{ $t("no_projects_found") }}
            </div>
          </div>

          <div v-if="events.length >= 1000" class="my-4 rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="ml-3 flex-1 md:flex md:justify-between">
                <p class="text-sm text-blue-700">
                  {{ $t("max_projects_reached") }}
                  <a href="mailto:support@dokedu.org" class="hover:underline"> Dokedu Support</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageHeader from "@/components/page-header.vue";
import PageWrapper from "@/components/page-wrapper.vue";
import PageContent from "@/components/page-content.vue";
import { computed, reactive, ref } from "vue";
import DButton from "../../../components/d-button/d-button.vue";
import { Printer } from "lucide-vue-next";
import { formatDate } from "@vueuse/core";
import { useExportEventsQuery } from "@/gql/queries/events/exportEvents.ts";

function gradeToText(grades: number[]): string {
  if (grades.length > 1) {
    return `${Math.min(...grades)} – ${Math.max(...grades)}`;
  } else if ((grades.length = 1)) {
    return grades[0].toString();
  } else {
    return "-";
  }
}

const filter = ref({
  from: "2000-01-01",
  to: "2100-01-01",
  deleted: false,
});

function print() {
  window.print();
}

type Event = {
  id: string;
  title: string;
  body: string;
  startsAt: string;
  endsAt: string;
  subjects: [any];
};

// @ts-expect-error
const events = computed<Event[] | []>(() => {
  if (!data.value?.exportEvents) {
    return [];
  }

  return data.value.exportEvents.map((event) => {
    if (!event) {
      return null;
    }

    let subjects = [];

    try {
      subjects = JSON.parse(event.subjects);
    } catch (e) {
      // ignore
    }

    return {
      id: event.id,
      title: event.title,
      body: event.body,
      startsAt: formatDate(new Date(event.startsAt), "DD.MM.YYYY"),
      endsAt: formatDate(new Date(event.endsAt), "DD.MM.YYYY"),
      subjects: subjects,
    };
  });
});

const { data, fetching } = useExportEventsQuery({
  variables: reactive({
    input: filter,
  }),
  requestPolicy: "network-only",
});
</script>
