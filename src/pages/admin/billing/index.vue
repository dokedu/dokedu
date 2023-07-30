<template>
  <page-wrapper class="relative">
    <page-header class="select-none justify-between">
      <div class="flex items-center gap-4">
        <div class="font-medium text-stone-950">{{ $t("billing") }}</div>
      </div>
    </page-header>
    <div
      class="absolute left-0 top-0 z-10 flex h-full w-full select-none items-center justify-center bg-stone-500/10 font-semibold text-stone-500 backdrop-blur-sm"
    >
      <div>This is still a work in progress. Please contact us if you want to change your plan.</div>
    </div>
    <div class="flex select-none gap-4 px-8 py-4 text-sm text-subtle">
      <div class="w-full max-w-xl">
        <div class="flex w-full items-center justify-between gap-8 rounded-lg bg-stone-100 p-4">
          <div class="flex flex-col gap-1">
            <div class="font-medium text-default">Standard</div>
            <div class="text-lg text-default">5 €</div>
            <div class="text-xs">{{ $t("per_member_monthly") }}</div>
          </div>
          <div>
            <d-button size="sm">{{ $t("change_plan") }}</d-button>
          </div>
        </div>
        <div class="mt-8">
          <div class="text-default">{{ $t("billing") }}</div>
          <div class="mt-2 divide-y divide-stone-200">
            <div class="py-2">
              <div class="grid grid-cols-3">
                <div class="text-default">{{ $t("payment_method") }}</div>
                <div>{{ $t("bankaccount_ending_in") }} {{ 1234 }}</div>
                <div class="text-right">
                  <d-button size="xs" type="transparent">{{ $t("update") }}</d-button>
                </div>
              </div>
            </div>
            <div class="py-2">
              <div class="grid grid-cols-3 items-center">
                <div class="text-default">{{ $t("billing_period") }}</div>
                <div class="">{{ $t("monthly") }}</div>
              </div>
            </div>
            <div class="py-2">
              <div class="grid grid-cols-3">
                <div class="text-default">{{ $t("billing_email") }}</div>
                <div>muster@dokedu.org</div>
                <div class="text-right">
                  <d-button size="xs" type="transparent">{{ $t("update") }}</d-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </page-wrapper>
  <router-view />
</template>
<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import PageWrapper from "@/components/PageWrapper.vue";
import DButton from "@/components/d-button/d-button.vue";
</script>
