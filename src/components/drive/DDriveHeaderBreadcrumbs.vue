<template>
  <div ref="wrapper" class="flex flex-1 items-center gap-2 overflow-hidden text-strong">
    <template v-for="(item, index) in items" :key="item.route">
      <span v-if="index !== 0">/</span>
      <router-link
        v-if="index !== items.length - 1"
        :to="item.route"
        class="line-clamp-1 text-ellipsis rounded-lg px-1 py-0.5 hover:bg-stone-100"
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
import { graphql } from "@/gql";
import { useQuery } from "@urql/vue";
import { computed, reactive } from "vue";
import { useRoute } from "vue-router/auto";
import { useI18n } from "vue-i18n";

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

const { data: folder } = useQuery({
  query: graphql(`
    query fileById($id: ID!) {
      file(id: $id) {
        id
        name
        parents {
          id
          name
        }
      }
    }
  `),
  variables: reactive({
    id: folderId,
  }),
  pause: computed(() => {
    return folderId.value === undefined || folderId.value === null;
  }),
});

const { data: bucket } = useQuery({
  query: graphql(`
    query bucketById($id: ID!) {
      bucket(id: $id) {
        id
        name
      }
    }
  `),
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
  ] as { title: string; route: { name: string; params?: { id?: string; folderId?: string } } }[];

  if (route.name === "/drive/shared-drives/[id]/" || route.name === "/drive/shared-drives/[id]/folders/[folderId]") {
    paths.push({
      title: bucket.value?.bucket.name || "loading",
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
