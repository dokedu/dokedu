<script setup lang="ts">
import { ref, onMounted } from 'vue'; // Import ref and onMounted

definePageMeta({
  layout: "settings"
});

// Reactive variable for the organisation name
const organisationName = ref('');
// Reactive variable for loading state
const isLoading = ref(false);
// Reactive variable for error messages
const errorMessage = ref('');
// Reactive variable for success messages
const successMessage = ref('');

// Function to fetch the current organisation name
async function fetchOrganisationName() {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    // Assuming the GET endpoint returns an array, we take the first element
    const response = await $fetch('/api/organisations'); 
    if (response && response.length > 0) {
      organisationName.value = response[0].name;
    } else {
      errorMessage.value = 'Organisation data not found.';
    }
  } catch (error) {
    console.error('Error fetching organisation name:', error);
    errorMessage.value = 'Failed to load organisation name. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// Function to save the updated organisation name
async function saveOrganisationName() {
  if (!organisationName.value.trim()) {
    errorMessage.value = 'Organisation name cannot be empty.';
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  try {
    const response = await $fetch('/api/organisations', {
      method: 'PATCH',
      body: { name: organisationName.value }
    });
    if (response && response.organisation) {
      organisationName.value = response.organisation.name;
      successMessage.value = 'Organisation name updated successfully!';
    }
  } catch (error: any) {
    console.error('Error updating organisation name:', error);
    if (error.data && error.data.message) {
        errorMessage.value = `Error: ${error.data.message}`;
    } else {
        errorMessage.value = 'Failed to update organisation name. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
}

// Fetch the organisation name when the component is mounted
onMounted(() => {
  fetchOrganisationName();
});

</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Organisation</DHeaderTitle>
    </DHeader>

    <DPageContent>
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center p-4">Loading...</div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Success:</strong>
        <span class="block sm:inline">{{ successMessage }}</span>
      </div>
      
      <div v-if="!isLoading">
        <form @submit.prevent="saveOrganisationName" class="space-y-4">
          <div>
            <DInput
              v-model="organisationName"
              label="Organisation Name"
              placeholder="Enter organisation name"
              id="organisationName"
              :disabled="isLoading"
            />
          </div>
          <div>
            <DButton type="submit" :disabled="isLoading">
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </DButton>
          </div>
        </form>
      </div>
    </DPageContent>
  </DPage>
</template>
