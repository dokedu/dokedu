<template>
  <div  class="p-4">
    <p>
      <strong>Welcome to Dokedu!</strong> We are still setting things up. You are probably a developer reading this. You can navigate to different apps using one of the following links:
    </p>
    <ul class="mt-4">
      <li><router-link :to="{ name: 'admin-users' }">-> admin users</router-link></li>
    </ul>
  </div>
</template>
<script setup lang="ts">
</script>