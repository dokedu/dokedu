<template>
  <div class="w-[320px] select-none bg-white rounded-xl shadow overflow-hidden border border-subtle">
    <div class="p-6 bg-muted flex flex-col items-center gap-4 border-b border-default">
      <img height="36" width="36" class="size-9" src="/dokedu-logo-icon-gradient.png" alt="dokedu logo" />
      <div>
        <div class="text-center text-strong text-xl font-semibold leading-7">{{ title }}</div>
        <div class="self-stretch text-center text-stone-500 text-sm font-normal font-['Inter'] leading-tight">
          {{ subtitle }}
        </div>
      </div>
    </div>
    <div class="p-6 gap-4 flex flex-col">
      <slot name="banner" />
      <slot name="form" />
    </div>
    <div class="p-6 bg-subtle gap-1 flex flex-col border-t border-default">
      <div class="text-stone-500 text-xs font-normal font-['Inter'] leading-none">{{ $t("problems_logging_in") }}</div>
      <div class="text-stone-500 text-xs font-normal font-['Inter'] leading-none">
        <span>{{ $t("contact_us_at") }}</span>
        <a
          href="mailto:support@dokedu.org"
          class="inline-block py-1 px-1 font-medium hover:bg-strong hover:text-strong rounded-md"
          >support@dokedu.org</a
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
type Props = {
  title: string
  subtitle: string
}

defineProps<Props>()
</script>
