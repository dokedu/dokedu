<template>
  <PageWrapper>
    <PageHeader class="flex gap-4">
      <div class="font-medium text-strong">{{ $t("attendance", 2) }}</div>
      <div class="flex items-center gap-2">
        <button
          @click="today"
          type="submit"
          class="text-sm items-center hover:bg-neutral-100 transition-all rounded-lg border border-neutral-200 shadow-sm focus:!outline-none px-4 text-neutral-700 py-2"
        >
          Today
        </button>
        <div
          @click="previousDate"
          class="w-8 flex items-center justify-center h-8 hover:bg-neutral-100 transition-all rounded-md"
        >
          <ChevronLeft />
        </div>
        <input
          class="text-sm items-center rounded-lg border border-neutral-200 shadow-sm focus:!outline-none"
          v-model="formattedDate"
          type="date"
          name="date"
          id="date"
        />
        <div
          @click="nextDate"
          class="w-8 flex items-center justify-center h-8 hover:bg-neutral-100 transition-all rounded-md"
        >
          <ChevronRight />
        </div>
      </div>

      <input
        class="text-sm items-center rounded-lg border border-neutral-200 shadow-sm focus:!outline-none"
        v-model="search"
        type="text"
        name="search"
        id="search"
        :placeholder="$t('search') + '...'"
      />

      <button
        @click="
          updateDailyAttendance({
            date: date,
            state: UserAttendanceState.Present
          })
        "
        type="submit"
        class="text-sm items-center hover:bg-neutral-100 transition-all rounded-lg border border-neutral-200 shadow-sm focus:!outline-none px-4 text-neutral-700 py-2"
      >
        Alle Anwesend
      </button>
    </PageHeader>
    <div class="w-full select-none min-h-0 overflow-scroll">
      <div class="flex flex-col w-full divide-y divide-neutral-100 overflow-scroll flex-1 pb-4">
        <div v-for="item in filteredData" :key="item.id" class="flex px-8 items-center justify-between py-2.5">
          <div class="text-sm">{{ item.user.firstName }} {{ item.user.lastName }}</div>
          <div class="flex bg-neutral-50 border border-neutral-200 shadow-sm p-0.5 rounded-lg gap-1">
            <div
              v-for="state in states.slice(1, states.length)"
              :key="state"
              class="p-1 w-8 flex items-center justify-center grayscale rounded-md text-center transition-all leading-none h-8 hover:bg-neutral-200"
              :class="{
                'bg-neutral-200 border border-neutral-300 shadow-sm grayscale-0': state === item.state
              }"
              :title="$t(state)"
              @click="setAttendance(item.user.id, state)"
            >
              {{ stateToEmoji(state) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue"
import { ChevronRight, ChevronLeft } from "lucide-vue-next"
import PageHeader from "@/components/page-header.vue"
import PageWrapper from "@/components/page-wrapper.vue"
import { useUpdateDailyAttendanceMutation } from "@/gql/mutations/attendances/updateDailyAttendance"
import { useSetUserAttendanceStateMutation } from "@/gql/mutations/attendances/setUserAttendanceState"
import { useUserAttendanceOverviewQuery } from "@/gql/queries/attendances/userAttendanceOverview"
import { UserAttendanceState } from "@/gql/schema"

const search = ref("")

const date = ref(new Date())
const formattedDate = computed({
  get: () => {
    return date.value.toISOString().substr(0, 10)
  },
  set: (value) => {
    date.value = new Date(value)
  }
})

function today() {
  date.value = new Date()
}

function previousDate() {
  date.value = new Date(date.value.getTime() - 24 * 60 * 60 * 1000 - 1)
}

function nextDate() {
  date.value = new Date(date.value.getTime() + 24 * 60 * 60 * 1000 + 1)
}

const { executeMutation: updateDailyAttendance } = useUpdateDailyAttendanceMutation()
const { executeMutation: setUserAttendanceState } = useSetUserAttendanceStateMutation()

const { data, executeQuery: refresh } = useUserAttendanceOverviewQuery({
  variables: reactive({
    date: date as unknown as never
  }),
  context: {
    additionalTypenames: ["UserAttendance"]
  }
})

const filteredData = computed(() => {
  if (!data) return []

  if (search.value === "") return data.value?.userAttendanceOverview

  return data.value?.userAttendanceOverview.filter((item: any) => {
    return (
      item.user.firstName.toLowerCase().includes(search.value.toLowerCase()) ||
      item.user.lastName.toLowerCase().includes(search.value.toLowerCase())
    )
  })
})

async function setAttendance(userId: string, attendance: UserAttendanceState) {
  await setUserAttendanceState({
    userId: userId,
    date: date.value,
    state: attendance
  })
  await refresh()
}

const states = [
  UserAttendanceState.Unknown,
  UserAttendanceState.Present,
  UserAttendanceState.Absent,
  UserAttendanceState.Late,
  UserAttendanceState.Sick
]

function stateToEmoji(state: UserAttendanceState) {
  switch (state) {
    case UserAttendanceState.Unknown:
      return "❓"
    case UserAttendanceState.Present:
      return "✅"
    case UserAttendanceState.Absent:
      return "❌"
    case UserAttendanceState.Late:
      return "⏰"
    case UserAttendanceState.Sick:
      return "🤒"
    default:
      return "❓"
  }
}
</script>
