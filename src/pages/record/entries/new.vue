<template>
  <PageWrapper>
    <PageHeader class="flex justify-between">
      <div class="text-gray-950 font-medium">Neuer Eintrag</div>
      <button type="button" class="bg-black text-white py-1.5 px-6 rounded-md" @click="onSubmit">Speichern</button>
    </PageHeader>
    <div class="flex justify-between h-full">
      <div class="w-full">
        <textarea v-model="body" placeholder="Schreibe deine Beobachtungen auf..."  class="block w-full text-lg resize-none border-none border-transparent p-8 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-0"/>
      </div>
      <div class="py-4 px-8 w-[400px] border-l min-h-full flex flex-col gap-4">
        <div class="flex gap-4 items-center">
          <label for="date" class="text-gray-500">Datum</label>
          <input v-model="date" type="date" name="date" id="date" class="w-full border-none hover:bg-gray-50 focus:bg-gray-100 rounded-md focus:ring-2 focus:ring-black transition-all">
        </div>
        <div class="flex gap-4">
          <label for="date" class="text-gray-500 mt-2">Tags</label>
          <div class="flex flex-wrap gap-2 hover:bg-gray-50 p-2 rounded-md w-full">
            <DTag v-for="tag in entryTags" :key="tag.id">{{ tag.name }}</DTag>
          </div>
        </div>
        <div>
          <DTag v-for="tag in tags?.tags" :key="tag.id" @click="addEntryTag(tag)">{{ tag.name }}</DTag>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
<script setup lang="ts">
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import {gql, useMutation, useQuery} from "@urql/vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import DTag from "../../../components/d-tag/d-tag.vue";
import tagQuery from "../../../queries/tags.ts"

const router = useRouter()

// today is a date value formatted as yyyy-mm-dd
const today = new Date().toISOString().split('T')[0];

const date = ref(today)
const body = ref('')
const entryTags = ref<Tag[]>([])

interface Tag {
  id: string
  name: string
  color: string
}

function addEntryTag(tag: Tag) {
  if (entryTags.value.find(el => el.id === tag.id)) return
  entryTags.value.push(tag)
}

const { data: tags } = useQuery({
  query: tagQuery
})

const {executeMutation: createEntry} = useMutation(gql`mutation createEntry($input: CreateEntryInput!) {
createEntry(input: $input) {
id
date
body
createdAt
}
}`)

async function onSubmit() {
  const {data, error} = await createEntry({
    input: {
      date: date.value,
      body: body.value,
      userIds: [],
      tagIds: entryTags.value.map(el => el.id)
    }
  })

  if (!error) {
    await router.push({name: "record-entry", params: {id: data.createEntry.id}})
  }
}


</script>