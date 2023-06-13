<template>
  <PageWrapper>
    <PageHeader class="justify-between">
      <div class="font-medium text-stone-950">Users</div>
      <d-button type="primary" :icon-left="UserPlus">New</d-button>
    </PageHeader>
    <table class="select-none text-sm">
      <thead>
        <tr>
          <th class="bg-stone-100 p-2 pl-8 text-left font-normal text-strong">First name</th>
          <th class="bg-stone-100 p-2 text-left font-normal text-strong">Last name</th>
          <th class="bg-stone-100 p-2 text-left font-normal text-strong">Role</th>
          <th class="bg-stone-100 p-2 text-left font-normal text-strong">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in data?.users?.edges" class="text-default hover:bg-stone-100">
          <td class="p-2 pl-8">{{ user.firstName }}</td>
          <td class="p-2">{{ user.lastName }}</td>
          <td class="p-2">{{ user.role }}</td>
          <td class="p-2">{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
  </PageWrapper>
</template>
<script setup lang="ts">
import { gql, useQuery } from "@urql/vue";
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";
import DButton from "../../../components/d-button/d-button.vue";
import { UserPlus } from "lucide-vue-next";

const { data } = useQuery({
  query: gql`
    query {
      users {
        edges {
          id
          email
          role
          firstName
          lastName
        }
      }
    }
  `,
});
</script>
