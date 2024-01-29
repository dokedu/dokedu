<template>
  <PageWrapper>
    <PageHeader>
      <div class="flex w-full items-center justify-between">
        <d-drive-header-breadcrumbs />
        <DButton type="primary" size="md" :icon-left="Plus" @click="newSharedDrive">{{ $t("new") }}</DButton>
      </div>
    </PageHeader>
    <PageContent>
      <DTable
        v-model:variables="pageVariables"
        v-model:selected="selected"
        :columns="columns"
        objectName="buckets"
        :query="BucketsDocument"
        defaultSort="createdAt"
        :additionalTypenames="['Bucket']"
        @row-click="clickRow"
        ref="dFileList"
      >
        <template #name-data="{ column }">
          <div class="flex items-center gap-3">
            <Folder :size="18" class="fill-neutral-700 stroke-colors-default" />
            <div class="text-default">{{ column }}</div>
          </div>
        </template>
        <template #createdAt-data="{ column }">
          <div class="text-default">{{ formatDate(new Date(Date.parse(column)), "DD.MM.YYYY hh:mm") }} Uhr</div>
        </template>
        <template #id-data="{ item }">
          <div class="flex w-full justify-end">
            <d-file-list-dropdown :option-list="optionListWithItem(item)" />
          </div>
        </template>
        <template #empty>
          <d-empty
            :icon="HardDrive"
            :title="$t('no_shared_drives_title')"
            :text="$t('no_shared_drives_text')"
          ></d-empty>
        </template>
      </DTable>
    </PageContent>
  </PageWrapper>

  <DDialogShareDrive v-if="currentItem" :open="shareOpen" :item="currentItem" @close="shareOpen = false" />
  <DDialogRenameDrive v-if="currentItem" :open="renameOpen" :item="currentItem" @close="renameOpen = false" />
</template>

<script setup lang="ts">
import DDriveHeaderBreadcrumbs from "@/components/_drive/d-drive-header-breadcrumbs.vue"
import PageWrapper from "@/components/page-wrapper.vue"
import PageHeader from "@/components/page-header.vue"
import PageContent from "@/components/page-content.vue"
import DTable from "@/components/d-table/d-table.vue"
import DButton from "@/components/d-button/d-button.vue"
import DEmpty from "@/components/d-empty/d-empty.vue"
import type { PageVariables } from "@/types/types"
import { ref } from "vue"
import { Plus, Folder, Edit2, Trash, HardDrive } from "lucide-vue-next"
import router from "@/router/router"
import DDialogShareDrive from "@/components/_drive/d-dialog/d-dialog-share-drive.vue"
import DDialogRenameDrive from "@/components/_drive/d-dialog/d-dialog-rename-drive.vue"
import { formatDate, onClickOutside } from "@vueuse/core"
import i18n from "@/i18n"
import { Share2 } from "lucide-vue-next"
import DFileListDropdown from "@/components/_drive/d-file-list-dropdown.vue"
import type { Option } from "@/components/_drive/d-file-list-dropdown.vue"
import { useDeleteSharedDriveMutation } from "@/gql/mutations/sharedDrives/deleteSharedDrive"
import type { Bucket } from "@/gql/schema"
import { useCreateSharedDriveMutation } from "@/gql/mutations/sharedDrives/createSharedDrive"
import { BucketsDocument } from "@/gql/mutations/sharedDrives/buckets"

const dFileList = ref<any>(null)

const currentItem = ref<Bucket>()
const shareOpen = ref(false)
const renameOpen = ref(false)

const { executeMutation } = useDeleteSharedDriveMutation()

async function deleteSharedDrive(item: any) {
  item.open = false
  if (confirm("Are you sure?")) {
    const { error } = await executeMutation({ id: item.id })
    if (error) {
      alert(error.message)
    }
  }
}

function toggleShareModal(item: any) {
  item.open = false
  currentItem.value = item
  shareOpen.value = true
}

function toggleRenameModal(item: any) {
  item.open = false
  currentItem.value = item
  renameOpen.value = true
}

async function newSharedDrive() {
  const name = prompt("Enter name")

  if (name) {
    await createSharedDrive({ name })
  }
}

const selected = ref<{ id: string }[]>([])

onClickOutside(dFileList, () => {
  selected.value = []
})

async function clickRow(item: any) {
  const isSelected = selected.value.find((f) => f.id === item.id)
  if (!isSelected) return

  await router.push({
    name: "/drive/shared-drives/[id]/",
    params: {
      id: item.id
    }
  })
}

const { executeMutation: createSharedDrive } = useCreateSharedDriveMutation()

const columns = [
  {
    label: "name",
    key: "name",
    width: 0.5
  },
  {
    label: "created_at",
    key: "createdAt"
  },
  {
    label: "-",
    key: "id",
    width: 0.1
  }
]

interface Variables extends PageVariables {}

const pageVariables = ref<Variables[]>([
  {
    limit: 25,
    offset: 0
  }
])

function optionListWithItem(item: File): Option[][] {
  return [
    [
      {
        text: i18n.global.t("rename"),
        icon: Edit2,
        func: () => toggleRenameModal(item)
      },
      {
        text: i18n.global.t("share"),
        icon: Share2,
        func: () => toggleShareModal(item)
      }
    ],
    [
      {
        text: i18n.global.t("delete"),
        icon: Trash,
        func: () => deleteSharedDrive(item)
      }
    ]
  ]
}
</script>
