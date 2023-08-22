<template>
  <DDialog :open="open" @close="onClose()" class="min-w-[450px]">
    <template #header>
      <div class="flex items-center justify-between">
        <div>Share drive</div>
        <button @click="onClose">
          <X class="h-4 w-4 text-stone-600"></X>
        </button>
      </div>
    </template>
    <template #main>
      <div class="space-y-4">
        <div v-if="permission == FilePermission.Manager" class="grow space-y-1 text-sm">
          <div class="text-subtle">Users</div>
          <DSelect
            v-model="selectedUser"
            :options="userOptions"
            label="Select user"
            placeholder="Select user"
            @select="onCreateShare"
          ></DSelect>
        </div>
        <div class="space-y-2 text-sm">
          <div class="text-subtle">Shared with</div>
          <div class="h-[200px] space-y-2 overflow-y-auto">
            <div
              v-for="share in shares?.shares"
              class="flex items-center justify-between gap-2 rounded-md bg-stone-50 px-3 py-2"
            >
              <div>{{ share.user.firstName }} {{ share.user.lastName }}</div>
              <div class="flex items-center gap-4">
                <DSelect
                  v-if="permission == FilePermission.Manager"
                  v-model="share.permission"
                  :options="permissionOptions"
                  label="Select permission"
                  placeholder="Select permission"
                  :removable="false"
                  @select="onEditShare(share as ShareUser)"
                ></DSelect>
                <div v-else class="text-sm text-subtle">{{ share.permission }}</div>
                <button
                  v-if="permission == FilePermission.Manager"
                  class="flex h-8 w-8 items-center justify-center rounded-md p-1 hover:bg-stone-100"
                  @click="removeShare(share as ShareUser)"
                >
                  <Trash class="h-4 w-4 text-stone-600"></Trash>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DDialog>
</template>

<script lang="ts" setup>
import { graphql } from "@/gql";
import DDialog from "../d-dialog/d-dialog.vue";
import { ShareUser, type Bucket } from "@/gql/graphql";
import { useQuery, useMutation } from "@urql/vue";
import { X, Trash } from "lucide-vue-next";
import { computed, reactive, ref } from "vue";
import DSelect from "../d-select/d-select.vue";
import { FilePermission } from "@/gql/graphql";

interface Props {
  open: boolean;
  item: Bucket;
}
const props = defineProps<Props>();
const emit = defineEmits(["close", "share"]);
const bucketId = computed(() => props.item?.id);
const permission = computed(() => props.item?.permission || FilePermission.Viewer);

const permissionOptions = [
  {
    label: "Viewer",
    value: FilePermission.Viewer,
  },
  {
    label: "Manager",
    value: FilePermission.Manager,
  },
];

function onClose() {
  emit("close");
}

const { data: users } = useQuery({
  query: graphql(`
    query shareUsers {
      users(filter: { role: [owner, admin, teacher] }) {
        edges {
          id
          firstName
          lastName
        }
      }
    }
  `),
});
const sharesQuery = graphql(`
  query BucketShares($input: ShareInput!) {
    shares(input: $input) {
      user {
        id
        firstName
        lastName
      }
      permission
    }
  }
`);

const shareContext = { additionalTypenames: ["ShareUser"] };
const { data: shares } = useQuery({
  query: sharesQuery,
  context: shareContext,
  variables: {
    input: reactive({
      bucketId,
    }),
  },
});

const { data: me } = useQuery({
  query: graphql(`
    query meBucketShare {
      me {
        id
      }
    }
  `),
});

const selectedUser = ref<string>();
const userOptions = computed(() => {
  // Filter out current user
  const myId = me?.value?.me?.id;
  let filteredUsers = users?.value?.users?.edges?.filter((user: any) => user.id !== myId);

  // Filter out users that are already shared with
  const sharedWith = shares?.value?.shares?.map((share: any) => share.user.id);
  filteredUsers = filteredUsers?.filter((user: any) => !sharedWith?.includes(user.id));

  return filteredUsers?.map((user: any) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id,
  }));
});

const { executeMutation: createShare } = useMutation(
  graphql(`
    mutation createShare($input: CreateShareInput!) {
      createShare(input: $input) {
        permission
        user {
          id
          firstName
          lastName
        }
      }
    }
  `)
);

const { executeMutation: deleteShare } = useMutation(
  graphql(`
    mutation deleteShare($input: DeleteShareInput!) {
      deleteShare(input: $input) {
        user {
          id
        }
      }
    }
  `)
);

const { executeMutation: editShare } = useMutation(
  graphql(`
    mutation editShare($input: CreateShareInput!) {
      editShare(input: $input) {
        permission
        user {
          id
          firstName
          lastName
        }
      }
    }
  `)
);

async function onCreateShare(id: string) {
  await createShare({
    input: reactive({
      bucketId,
      user: id,
      permission: FilePermission.Viewer,
    }),
  });

  selectedUser.value = undefined;
}

async function removeShare(share: ShareUser) {
  await deleteShare({
    input: reactive({
      bucketId,
      user: share.user.id,
    }),
  });
}

async function onEditShare(share: ShareUser) {
  await editShare({
    input: reactive({
      bucketId,
      user: share.user.id,
      permission: share.permission,
    }),
  });
}
</script>
