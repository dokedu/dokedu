<script setup lang="ts">
import { computed, ref } from "vue"
import {
  AlarmClockPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleSlashIcon,
  ClockIcon,
  HospitalIcon,
  MessageSquareQuoteIcon,
  UserCheckIcon
} from "lucide-vue-next"
import type { DUserAttendance, DUser } from "~/types/models"

const date = ref(new Date())

const utcDate = computed(() => {
  return date.value.toUTCString()
})

const { data: users, refresh } = await useFetch("/api/user_attendances", {
  params: {
    date: utcDate
  }
})

const search = ref("")

const stateIcons: any = {
  present: UserCheckIcon,
  absent: CircleSlashIcon,
  late: ClockIcon,
  sick: HospitalIcon
}

const possibleStates = ["present", "absent", "late", "sick"]
type DUserAttendanceState = keyof typeof possibleStates

async function updateState(userId: string, state: DUserAttendanceState) {
  console.log(`Update user attendance ${userId} to ${state}`)
  await $fetch(`/api/user_attendances`, {
    method: "PUT",
    body: {
      userId: userId,
      state: state,
      date: date.value
    }
  })
  await refresh()
}

const modal = ref<string | null>(null)
const userAttendance = ref<string | null>(null)
const delayedTime = ref<number | null>(null)

function openDelayedTimeModal(_userAttendance: DUserAttendance) {
  modal.value = "latetime"
  userAttendance.value = _userAttendance
}

async function updateDelayedTime() {
  console.log("update delayed time", userAttendance.value)
  modal.value = null
  // await useStore().updateUserAttendanceMinutesDelayed(userAttendanceId.value!, delayedTime.value!)

  await $fetch(`/api/user_attendances`, {
    method: "PUT",
    body: {
      state: userAttendance.value.state,
      userId: userAttendance.value.userId,
      minutesDelayed: delayedTime.value!,
      date: date.value
    }
  })

  userAttendance.value = null
  delayedTime.value = null

  await refresh()
}

// Modal for the comment
const comment = ref<string | null>(null)

function openCommentModal(_userAttendance: DUserAttendance) {
  modal.value = "comment"
  comment.value = _userAttendance.comment
  userAttendance.value = _userAttendance
}

async function updateComment() {
  console.log("update comment")
  modal.value = null
  // await useStore().updateUserAttendanceComment(userAttendanceId.value!, comment.value!)

  await $fetch(`/api/user_attendances`, {
    method: "PUT",
    body: {
      state: userAttendance.value.state,
      userId: userAttendance.value.userId,
      comment: comment.value,
      date: date.value
    }
  })

  userAttendance.value = null
  comment.value = null

  await refresh()
}

function previousDay() {
  // const __date = new Date(date.value)
  // __date.setDate(__date.getDate() - 1)
  // date.value = __date.toISOString().split("T")[0]
}

function nextDay() {
  // const __date = new Date(date.value)
  // __date.setDate(__date.getDate() + 1)
  // date.value = __date.toISOString().split("T")[0]
}
</script>

<template>
  <DPage>
    <DHeader>
      <DHeaderTitle>Anwesenheit</DHeaderTitle>
      <DInputSearch v-model="search" />

      <template #right>
        <DButton :icon-left="ChevronLeftIcon" variant="secondary" @click="previousDay" />
        <input v-model="date" type="date" class="rounded border-none bg-neutral-100 px-2 py-0.5 text-sm" />
        <DButton :icon-left="ChevronRightIcon" variant="secondary" @click="nextDay" />
      </template>
    </DHeader>

    <DPageContent>
      <div v-for="user in users" class="group flex items-center justify-between gap-4 rounded-md py-0.5 pr-0.5 pl-2 hover:bg-neutral-50">
        <div class="flex items-center gap-2">
          <div class="line-clamp-1 text-sm text-neutral-700">{{ user.firstName }} {{ user.lastName }}</div>
          <div v-if="user.userAttendances[0]">
            <DTag v-if="user.userAttendances[0].state === 'present'" color="green">Anwesend</DTag>
            <DTag v-if="user.userAttendances[0].state === 'absent'" color="red">Abwesend</DTag>
            <DTag v-if="user.userAttendances[0].state === 'late'" color="orange">Verspätung</DTag>
            <DTag v-if="user.userAttendances[0].state === 'sick'" color="teal">Krank</DTag>
          </div>
          <div v-if="user.userAttendances?.[0]?.state === 'late'" class="flex items-center gap-2">
            <DButton variant="secondary" :icon-left="AlarmClockPlusIcon" @click="openDelayedTimeModal(user.userAttendances?.[0])"> </DButton>
          </div>
          <div v-if="user.userAttendances?.[0]?.state === 'late' && user.userAttendances?.[0]?.minutesDelayed" class="text-sm text-neutral-500">
            {{ user.userAttendances?.[0]?.minutesDelayed }} Minuten
          </div>
        </div>
        <div class="flex gap-2">
          <div
            class="flex items-center gap-2"
            :class="[
              user.userAttendances?.[0]?.state !== 'present' && user.userAttendances?.[0]?.comment ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            ]"
            v-if="user.userAttendances?.[0]?.state !== 'present'"
          >
            <div class="flex items-center gap-2">
              <DButton variant="secondary" :icon-left="MessageSquareQuoteIcon" @click="openCommentModal(user.userAttendances?.[0])"> </DButton>
            </div>
          </div>
          <DButtonGroup>
            <DButton
              v-for="state in possibleStates"
              :key="state"
              @click="updateState(user.id, state)"
              :icon-left="stateIcons[state] ? stateIcons[state] : null"
              :variant="user.userAttendances?.[0]?.state === state ? 'primary' : 'secondary'"
            >
            </DButton>
          </DButtonGroup>
        </div>
      </div>
    </DPageContent>

    <DModal titel="Verspätungszeit" v-if="modal === 'latetime'" @close="modal = null" confirm-text="Speichern" @confirm="updateDelayedTime">
      <div class="p-4 text-sm text-neutral-500">
        <DInput v-model="delayedTime" type="number" name="time" id="time" class="w-full" placeholder="Verspätungszeit in Minuten" />
      </div>
    </DModal>

    <DModal titel="Kommentar" v-if="modal === 'comment'" @close="modal = null" confirm-text="Speichern" @confirm="updateComment()">
      <div class="p-4 text-sm text-neutral-500">
        <textarea
          v-model="comment"
          name="comment"
          id="comment"
          placeholder="Kommentar"
          class="w-full rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-300 focus:ring-0 focus:outline-0"
        ></textarea>
      </div>
    </DModal>
  </DPage>
</template>
