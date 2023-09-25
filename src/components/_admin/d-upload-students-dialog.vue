<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "radix-vue";

import { X } from "lucide-vue-next";
import { useMutation } from "@urql/vue";
import { graphql } from "@/gql";
import { ref } from "vue";
import { useDropZone } from "@vueuse/core";
import { createNotification } from "@/composables/useToast";

const open = ref(false);
const dropZoneRef = ref<HTMLDivElement>();

async function onDrop(files: File[] | null) {
  if (!files) return;
  console.log(files);

  // ensure files length is 1
  const file = files[0];
  if (!file) return;

  await processFile(file);
}

useDropZone(dropZoneRef, onDrop);

async function onChange(event: any) {
  event.preventDefault();
  const file = event?.target?.files[0];
  if (!file) return;

  const { error, data } = await processFile(file);

  if (data?.importStudents.errors?.length || 0 > 0 || error) {
    return createNotification({
      title: "Error",
      description: "Something went wrong",
    });
  }

  return createNotification({
    title: "Success",
    description: `${data?.importStudents.usersCreated || 0} students imported successfully, ${
      data?.importStudents.usersExisted || 0
    } students already existed`,
  });
}

async function processFile(file: File) {
  const res = await importStudents({
    input: {
      file,
    },
  });

  open.value = false;

  return res;
}

const { executeMutation: importStudents } = useMutation(
  graphql(`
    mutation importStudents($input: ImportStudentsInput!) {
      importStudents(input: $input) {
        usersCreated
        usersExisted
        errors
      }
    }
  `)
);
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger
      class="transition-color group relative inline-flex h-fit select-none items-center justify-center gap-2 overflow-hidden rounded-lg border border-neutral-200 px-4 py-1.5 text-neutral-700 shadow-sm hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
    >
      <slot name="trigger"></slot>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-20 bg-neutral-950/50" />
      <DialogContent
        class="fixed left-1/2 top-1/2 z-20 flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] flex-col gap-4 rounded-md bg-white p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
      >
        <div class="flex w-full items-center justify-between">
          <DialogTitle class="w-fit text-sm"> {{ $t("import_students") }} </DialogTitle>
          <DialogClose
            class="rounded-md p-1 hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          >
            <X :size="18" />
          </DialogClose>
        </div>
        <DialogDescription class="text-sm">
          <div class="flex w-full items-center justify-center">
            <label
              ref="dropZoneRef"
              for="dropzone-file"
              class="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
            >
              <div class="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  class="mb-4 h-8 w-8 text-neutral-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-neutral-500">Your table must comply with the following format:</p>
                <table class="select-none divide-y divide-neutral-200 border border-neutral-200 text-neutral-500">
                  <thead>
                    <tr class="divide-x divide-neutral-200 font-medium text-neutral-500">
                      <td class="px-1 py-0.5">Vorname</td>
                      <td class="px-1 py-0.5">Nachname</td>
                      <td class="px-1 py-0.5">Geburtsdatum</td>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-neutral-200">
                    <tr class="divide-x divide-neutral-200">
                      <td class="px-1 py-0.5">Max</td>
                      <td class="px-1 py-0.5">Mustermann</td>
                      <td class="px-1 py-0.5">MM.DD.YYYY</td>
                    </tr>
                  </tbody>
                </table>
                <p class="my-2 text-sm text-neutral-500">
                  <span class="font-semibold">{{ $t("click_to_upload") }}</span> {{ $t("or_drag_and_drop") }}
                </p>
                <p class="text-xs text-neutral-500">XLXS</p>
              </div>
              <input @change="onChange" id="dropzone-file" type="file" class="hidden" accept=".xlsx" />
            </label>
          </div>
        </DialogDescription>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
