<template>
  <div class="rounded-md bg-stone-50 px-4 py-3">
    <div class="flex flex-col gap-2 text-sm">
      <div>Repeat</div>
      <div class="flex items-center gap-1">
        <label for="every">every</label>
        <input
          v-model="every"
          class="w-12 rounded-md border border-stone-200 px-1 py-0.5 text-sm"
          type="number"
          name="every"
          id="every"
          min="1"
        />
        <select
          v-model="interval"
          name="interval"
          id="interval"
          class="min-w-[90px] rounded-md border border-stone-200 px-1 py-0.5 text-sm"
        >
          <option value="days">{{ every > 1 ? "days" : "day" }}</option>
          <option value="weeks">{{ every > 1 ? "weeks" : "week" }}</option>
          <option value="months">{{ every > 1 ? "months" : "month" }}</option>
          <option value="years">{{ every > 1 ? "years" : "year" }}</option>
        </select>
      </div>
      <div v-if="interval === 'weeks'" class="flex items-center gap-2">
        <div>on</div>
        <div class="flex gap-2">
          <div v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="day">
            <label
              :class="[
                'cursor-pointer',
                repeatOnDays.includes(day)
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-white text-stone-900 ring-1 ring-inset ring-stone-300 hover:bg-stone-50',
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold sm:flex-1',
              ]"
            >
              {{ day }}
              <input v-model="repeatOnDays" class="sr-only" type="checkbox" name="on" id="on" :value="day" />
            </label>
          </div>
        </div>
      </div>
      <div v-if="interval === 'months'">
        <div>on</div>
        <div>
          <input type="radio" name="on" id="on" value="exact" />
          <label for="exact">the nth</label>
        </div>
        <div>
          <input type="radio" name="on" id="on" value="xth day of week" class="text-sm" />
          <label for="xth day of week">the xth day of week</label>
        </div>
      </div>
      <div>
        <div>Ends</div>
        <div class="mt-2">
          <div class="flex flex-col items-start gap-1">
            <div class="flex items-center gap-2">
              <input v-model="ends" type="radio" name="ends" id="ends" value="never" />
              <label for="never">Never</label>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="ends" type="radio" name="ends" id="ends" value="date" class="text-sm" />
              <label for="on">On</label>
              <div class="flex items-center gap-2" :class="{ 'opacity-50': ends !== 'date' }">
                <input
                  class="rounded-md border border-stone-200 px-1 py-0.5 text-sm"
                  type="date"
                  :disabled="ends !== 'date'"
                  name="on-date"
                  id="on-date"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="ends" type="radio" name="ends" id="ends" value="after" class="text-sm" />
              <label for="after">After</label>
              <div class="flex items-center gap-2" :class="{ 'opacity-50': ends !== 'after' }">
                <input
                  class="w-12 rounded-md border border-stone-200 px-1 py-0.5 text-sm"
                  :disabled="ends !== 'after'"
                  type="number"
                  name="after-times"
                  id="after-times"
                  value="1"
                  min="1"
                />
                <span>times</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const repeatOnDays = ref([] as string[]);
const every = ref(1);
const interval = ref("days");
const ends = ref("never");
</script>
