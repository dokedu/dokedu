<template>
  <form @submit="onSubmit" class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <div>Neue Kompetenz</div>
      <div class="p-0.5 rounded-md hover:bg-neutral-100" @click="emit('close')"><XIcon /></div>
    </div>
    <div>
      <input
        class="block text-sm w-full rounded-md border-0 py-2.5 px-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-900"
        placeholder="Name der Kompetenz"
        name="name"
        v-model="name"
        type="text"
      />
      <div v-show="errors.name" class="text-red-500 mt-2">{{ errors.name }}</div>
    </div>
    <div>
      <DSelect label="Fach" v-model="parentId" v-model:search="subjectSearch" searchable :options="subjectsOptions" />
      <div v-show="errors.parentId" class="text-red-500 mt-2">{{ errors.parentId }}</div>
    </div>
    <button
      class="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 transition-color group relative inline-flex h-fit select-none items-center justify-center gap-2 overflow-hidden rounded-lg border shadow-sm border-neutral-200 text-neutral-700 hover:bg-neutral-100 py-2 px-3 text-sm"
      type="submit"
    >
      Erstellen
    </button>
  </form>
</template>

<script lang="ts" setup>
import { Form, useForm, useField } from "vee-validate";
import DSelect from "@/components/d-select/d-select.vue";
import { computed, reactive, ref } from "vue";
import { XIcon } from "lucide-vue-next";
import * as yup from "yup";
import { useSubjectsDataQuery } from "@/gql/queries/competences/subjectsData.ts";
import { useCreateCompetenceMutation } from "@/gql/mutations/competences/createCompetence.ts";

yup.setLocale({
  mixed: {
    required: "Dieses Feld ist erforderlich",
  },
  string: {
    min: "Dieses Feld muss mindestens ${min} Zeichen lang sein",
    max: "Dieses Feld darf maximal ${max} Zeichen lang sein",
  },
});

const subjectSearch = ref("");

const schema = yup.object({
  name: yup.string().required().min(3).max(100).label("Name"),
  parentId: yup.string().required().label("Fach"),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: name } = useField("name");
const { value: parentId } = useField<string>("parentId");

const onSubmit = handleSubmit(async (values) => {
  console.log(values);

  const { data, error } = await createCompetence({
    input: values as { name: string; parentId: string },
  });

  if (error) {
    return alert(error.message);
  }

  // wait 1s
  await new Promise((resolve) => setTimeout(resolve, 250));

  emit("created", data?.createCompetence);
  emit("close");
});

const emit = defineEmits(["close", "created"]);

const { data: subjectsData } = useSubjectsDataQuery({
  variables: reactive({ search: subjectSearch }),
});

const { executeMutation: createCompetence } = useCreateCompetenceMutation();

const subjectsOptions = computed(() => {
  if (!subjectsData.value?.competences?.edges) return [];
  return subjectsData.value.competences.edges.map((subject: any) => ({
    label: subject.name,
    value: subject.id,
  }));
});
</script>
