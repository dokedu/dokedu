<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">{{ $t("project", 2) }}</div>
        <input
          v-model="search"
          type="text"
          name="search"
          id="search"
          :placeholder="$t('search')"
          class="h-8 rounded-md border border-stone-100 text-sm text-strong outline-none ring-0 transition-all placeholder:text-subtle focus:border-stone-200 focus:shadow-sm focus:ring-0"
        />
      </div>
      <div class="flex gap-2">
        <router-link :to="{ name: 'record-projects-export' }">
          <d-button type="transparent" :icon-left="Share">{{ $t("export") }}</d-button>
        </router-link>
        <router-link :to="{ name: 'record-projects-new' }">
          <d-button type="primary" :icon-left="Plus"> {{ $t("new") }} </d-button>
        </router-link>
      </div>
    </PageHeader>
    <PageContent>
      <div class="flex flex-col overflow-scroll">
        <router-link
          :to="{ name: 'record-projects-project', params: { id: event.id } }"
          v-for="event in (data?.events?.edges as Event[])"
          class="flex border-b border-stone-100 text-sm transition-all hover:bg-stone-50"
          :class="{
            '!bg-stone-100': event?.id === $route.params.id,
          }"
        >
          <div class="w-2/6 p-2 pl-8 text-strong">{{ event.title }}</div>
          <div class="w-3/6 p-2 pl-8 text-subtle">{{ event.body?.slice(0, 50) }}...</div>
          <div class="w-2/6 p-2 px-4 text-subtle">
            {{ formatDate(new Date(Date.parse(event.startsAt)), "DD.MM.YYYY") }} -
            {{ formatDate(new Date(Date.parse(event.endsAt)), "DD.MM.YYYY") }}
          </div>
        </router-link>
      </div>
    </PageContent>
  </PageWrapper>
  <router-view />
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import PageContent from "../../../components/PageContent.vue";
import { useQuery } from "@urql/vue";
import { formatDate } from "@vueuse/core";
import DButton from "../../../components/d-button/d-button.vue";
import { Plus } from "lucide-vue-next";
import { Share } from "lucide-vue-next";
import { reactive, ref } from "vue";
import { graphql } from "../../../gql";
import { Event } from "@/gql/graphql";

const search = ref("");

const { data } = useQuery({
  query: graphql(`
    query eventWithSearch($search: String) {
      events(search: $search, limit: 300) {
        edges {
          id
          title
          body
          createdAt
          startsAt
          endsAt
        }
      }
    }
  `),
  variables: reactive({ search }),
});
</script>
