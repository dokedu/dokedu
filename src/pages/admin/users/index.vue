<template>
  <PageWrapper>
    <PageHeader>
      <div class="text-gray-950 font-medium">Users</div>
    </PageHeader>
    <table class="select-none">
      <thead>
      <tr>
        <th class="p-2 bg-gray-100">Email</th>
        <th class="p-2 bg-gray-100">First name</th>
        <th class="p-2 bg-gray-100">Last name</th>
        <th class="p-2 bg-gray-100"></th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="user in data?.users?.edges" class="hover:bg-gray-100">
          <td class="p-2">{{user.email}}</td>
          <td class="p-2">{{user.firstName}}</td>
          <td class="p-2">{{user.lastName}}</td>
          <td class="p-2 hover:underline" @click="clicked(user)" >Edit</td>
        </tr>
      <tr class="hover:bg-gray-100">
        <td class="p-2" colspan="4">New</td>
      </tr>
      </tbody>
    </table>
  </PageWrapper>
</template>
<script setup lang="ts">
import { gql, useQuery} from "@urql/vue";
import PageHeader from "../../../components/PageHeader.vue";
import PageWrapper from "../../../components/PageWrapper.vue";

const { data } = useQuery({
  query: gql`query {
  users {
    edges {
      id
      email
      role
      firstName
      lastName
    }
  }
}`
});

function clicked(user) {
  alert(user.id)
}
</script>