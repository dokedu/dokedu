<template>
  <div ref="wrapper" class="flex flex-1 items-center gap-2 overflow-hidden text-strong">
    <template v-for="(item, index) in items" :key="item.route">
      <span v-if="index !== 0">/</span>
      <router-link
        v-if="index === 0"
        :to="item.route"
        @dragover.prevent="(event: DragEvent) => dragover(event, 0)"
        @drop="(event: DragEvent) => drop(event, 0)"
        class="line-clamp-1 text-ellipsis rounded-lg px-1 py-0.5 font-medium hover:bg-neutral-100"
        :class="{
          ' border-blue-500 bg-blue-100': dragoverItem === 0,
        }"
      >
        {{ item.title }}
      </router-link>
      <router-link
        v-else-if="index !== items.length - 1"
        :to="item.route"
        @dragover.prevent="(event: DragEvent) => dragover(event, item)"
        @drop="(event: DragEvent) => drop(event, item)"
        @dragleave="dragoverItem = null"
        class="line-clamp-1 text-ellipsis rounded-lg px-1 py-0.5 font-medium hover:bg-neutral-100"
        :class="{
          ' border-blue-500 bg-blue-100': dragoverItem === item.route.params.id,
        }"
      >
        {{ item.title }}
      </router-link>
      <div v-else class="line-clamp-1 text-ellipsis rounded-lg px-1 py-0.5">
        {{ item.title }}
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router/auto";
import { useI18n } from "vue-i18n";
import { useMoveFileMutation } from "@/gql/mutations/files/moveFile.ts";
import { useFileByIdQuery } from "@/gql/queries/files/fileById.ts";
import { useBucketByIdQuery } from "@/gql/mutations/buckets/bucketById.ts";

const { t } = useI18n();

type RouteNameMyDrive = "/drive/my-drive/folders/[id]";
type RouteNameSharedDrive = "/drive/shared-drives/[id]/folders/[folderId]";
const routeNameSharedDrive = "/drive/shared-drives/[id]/folders/[folderId]";
type RouteName =
  | RouteNameMyDrive
  | RouteNameSharedDrive
  | "/drive/my-drive/"
  | "/drive/shared-drives/"
  | "/drive/shared-drives/[id]/";

const route = useRoute<RouteName>();

const dragoverItem = ref<string | number | null>(null);

function dragover(_: DragEvent, item: any) {
  if (item === 0) {
    dragoverItem.value = 0;
    return;
  }
  if (item.route.params.id === dragoverItem.value) return;
  console.log("Dragover", item.route.params.id);
  dragoverItem.value = item.route.params.id;
}

async function drop(event: DragEvent, row: any) {
  const id: string | undefined = event.dataTransfer?.getData("dokedu/vnd.dokedu-drive-file");
  const targetId =
    row === 0 ? null : row.route.name === "/drive/shared-drives/[id]/" ? null : row.route.params.folderId;

  if (!id) return;
  if (id === targetId) return;

  console.log(row);

  console.log({
    id: id,
    targetId: targetId,
  });

  await moveFile({
    input: {
      id: id,
      targetId: targetId,
    },
  });

  // prevent
  event.preventDefault();
  dragoverItem.value = null;
}

const { executeMutation: moveFile } = useMoveFileMutation();

const folderId = computed(() => {
  if (route.name === routeNameSharedDrive) {
    return route.params.folderId;
  } else if (route.name === "/drive/my-drive/folders/[id]") {
    return route.params.id;
  }

  return "";
});

const bucketId = computed(() => {
  if (route.name === "/drive/shared-drives/[id]/" || route.name === "/drive/shared-drives/[id]/folders/[folderId]") {
    return route.params.id;
  } else {
    return "";
  }
});

const { data: folder } = useFileByIdQuery({
  variables: reactive({
    id: folderId,
  }),
  pause: computed(() => {
    return folderId.value === undefined || folderId.value === null;
  }),
});

const { data: bucket } = useBucketByIdQuery({
  variables: reactive({
    id: bucketId,
  }),
  pause: computed(() => {
    return !route.name.includes("/drive/shared-drives/[id]/");
  }),
});

const items = computed<any[]>(() => {
  const isMyDriveRoute = route.name.includes("/drive/my-drive/");
  const rootTo = isMyDriveRoute ? "/drive/my-drive/" : "/drive/shared-drives/";
  const folderTo = isMyDriveRoute ? "/drive/my-drive/folders/[id]" : "/drive/shared-drives/[id]/folders/[folderId]";
  const parents = folder.value?.file.parents || [];
  const title = isMyDriveRoute ? t("my_drive") : t("shared_drives");

  const createPath = (title: string, routeName: string, id: string, folderId?: string) => {
    return {
      title,
      bucketId: null,
      route: {
        name: routeName,
        params: isMyDriveRoute ? { id } : { id, folderId },
      },
    };
  };

  const paths = [
    {
      title: title,
      route: {
        name: rootTo,
      },
    },
  ] as {
    title: string;
    bucketId: string | null;
    route: { name: string; params?: { id?: string; folderId?: string } };
  }[];

  if (route.name === "/drive/shared-drives/[id]/" || route.name === "/drive/shared-drives/[id]/folders/[folderId]") {
    paths.push({
      title: bucket.value?.bucket.name || "loading",
      bucketId: route.name === "/drive/shared-drives/[id]/" ? (bucket.value ? bucket.value.bucket.id : null) : null,
      route: {
        name: "/drive/shared-drives/[id]/",
        params: { id: route.params.id },
      },
    });

    for (const parent of parents) {
      paths.push(createPath(parent.name, folderTo, route.params.id, parent.id));
    }
  } else {
    for (const parent of parents) {
      paths.push(createPath(parent.name, folderTo, parent.id));
    }
  }

  if (folder.value?.file.name) {
    paths.push(createPath(folder.value.file.name, folderTo, folder.value.file.id));
  }

  return paths;
});
</script>
