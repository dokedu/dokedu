<template>
  <div
    ref="sheet"
    class="absolute right-0 top-0 h-screen w-full max-w-md overflow-scroll bg-white shadow-md shadow-stone-300"
  >
    <div class="p-4">
      <div class="mb-4 select-none text-sm font-medium text-strong">New project</div>
      <div class="mb-4 flex flex-col gap-2">
        <div class="flex min-h-[8rem] w-full items-center justify-start rounded-lg bg-stone-100">
          <div class="mx-auto text-center">
            <Image class="mx-auto mb-1 stroke-stone-300" :size="48" :stroke-width="1" />
            <div class="select-none text-center text-xs text-stone-500">
              Add a cover image <br />
              by clicking or dropping a file
            </div>
          </div>
        </div>
        <input
          v-model="title"
          class="block w-full select-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
          type="text"
          name="name"
          id="name"
          placeholder="Name of the project"
          required
        />
        <textarea
          ref="textarea"
          v-model="description"
          class="block min-h-[6rem] w-full select-none resize-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
          name="description"
          id="description"
          cols="30"
          rows="3"
          placeholder="Think of some magical description"
          required
        />
        <div>
          <label for="starts" class="mb-1 block text-xs font-medium leading-6 text-stone-900">Starts at</label>
          <input
            v-model="starts"
            class="block w-full select-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
            type="datetime-local"
            name="starts"
            id="starts"
            required
          />
        </div>
        <div>
          <label for="ends" class="mb-1 block text-xs font-medium leading-6 text-stone-900">Ends at</label>
          <input
            v-model="ends"
            class="block w-full select-none rounded-md border-0 py-2 text-sm text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:ring-2 focus:ring-inset focus:ring-black"
            type="datetime-local"
            name="ends"
            id="ends"
            required
          />
        </div>
      </div>
      <div class="flex justify-between">
        <d-button type="outline" @click="cancel">Cancel</d-button>
        <d-button type="primary" :icon-left="Plus" @click="create">Create</d-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside, onKeyStroke, useTextareaAutosize } from "@vueuse/core";
import { ref } from "vue";
import { useRouter } from "vue-router";
import dButton from "../../../components/d-button/d-button.vue";
import { Plus, Image } from "lucide-vue-next";
import { useMutation } from "@urql/vue";
import { graphql } from "../../../gql";

const router = useRouter();
const sheet = ref<HTMLElement | null>(null);

const { textarea, input: description } = useTextareaAutosize();
const title = ref("");
const starts = ref("");
const ends = ref("");

async function cancel() {
  // TODO: if user has already written some content, ask for confirmation before closing
  await router.push({ name: "record-projects" });
}

onClickOutside(sheet, async () => {
  await cancel();
});

onKeyStroke("Escape", async () => {
  await cancel();
});

const { executeMutation: createEvent } = useMutation(
  graphql(`
    mutation createEvent($input: CreateEventInput!) {
      createEvent(input: $input) {
        id
        title
        image {
          id
        }
        body
        startsAt
        endsAt
        recurrence
        createdAt
      }
    }
  `)
);

async function create() {
  if (!title.value) {
    alert("Please provide a title");
    return;
  }

  if (!description.value) {
    alert("Please provide a description");
    return;
  }

  if (!starts.value) {
    alert("Please provide a start date");
    return;
  }

  if (!ends.value) {
    alert("Please provide an end date");
    return;
  }

  const startsAt = new Date(starts.value).toISOString();
  const endsAt = new Date(ends.value).toISOString();

  const event = {
    title: title.value,
    body: description.value,
    startsAt: startsAt,
    endsAt: endsAt,
  };

  try {
    await createEvent({ input: event });
    await router.push({ name: "record-projects" });
    await cancel();
  } catch (e) {
    alert(e);
  }
}
</script>
