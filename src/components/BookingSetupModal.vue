<script setup>
import { computed, reactive, ref } from 'vue'
import { getVenue, venues } from '../data/venues'
import { saveMockBooking, timeSlots } from '../data/mockBooking'

const emit = defineEmits(['close', 'saved'])

const today = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const form = reactive({
  venueId: 'qianwei',
  sportName: venues.qianwei.sports[0].name,
  date: today(),
  timeSlot: '17:30–19:30',
  courtNumber: '4',
})
const error = ref('')

const currentVenue = computed(() => getVenue(form.venueId))

function changeVenue() {
  form.sportName = currentVenue.value.sports[0].name
}

function submit() {
  error.value = ''
  try {
    const booking = saveMockBooking(form)
    emit('saved', booking)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '保存失败'
  }
}
</script>

<template>
  <div class="booking-modal-backdrop" role="presentation" @click.self="emit('close')">
    <section class="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <header class="booking-modal-header">
        <h2 id="booking-modal-title">预约设置</h2>
        <button type="button" class="close-button" aria-label="关闭" @click="emit('close')">×</button>
      </header>

      <form class="booking-form" @submit.prevent="submit">
        <label>
          <span>体育馆</span>
          <select v-model="form.venueId" @change="changeVenue">
            <option value="qianwei">前卫体育馆</option>
            <option value="song">宋治平体育馆</option>
          </select>
        </label>

        <label>
          <span>运动项目</span>
          <select v-model="form.sportName">
            <option v-for="sport in currentVenue.sports" :key="sport.name" :value="sport.name">
              {{ sport.name }}
            </option>
          </select>
        </label>

        <label>
          <span>日期</span>
          <input v-model="form.date" type="date" required>
        </label>

        <label>
          <span>时间段</span>
          <select v-model="form.timeSlot">
            <option v-for="slot in timeSlots" :key="slot" :value="slot">{{ slot }}</option>
          </select>
        </label>

        <label>
          <span>场地号</span>
          <input v-model="form.courtNumber" type="number" min="1" max="30" inputmode="numeric" required>
        </label>

        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button type="submit" class="save-button">保存预约</button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.booking-modal-backdrop {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  padding: 22px;
  background: rgba(0, 0, 0, .42);
  place-items: center;
}

.booking-modal {
  width: min(100%, 350px);
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 12px 36px rgba(0, 0, 0, .2);
  text-align: left;
}

.booking-modal-header {
  display: flex;
  min-height: 56px;
  padding: 0 16px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.booking-modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 19px;
  font-weight: 600;
}

.close-button {
  width: 34px;
  height: 34px;
  padding: 0;
  color: #999;
  border: 0;
  background: transparent;
  font-size: 28px;
  line-height: 1;
}

.booking-form {
  display: grid;
  padding: 18px 18px 20px;
  gap: 14px;
}

.booking-form label {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  color: #555;
  font-size: 15px;
}

.booking-form select,
.booking-form input {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: 0;
  background: #fff;
  font: inherit;
}

.booking-form select:focus,
.booking-form input:focus {
  border-color: #7ecef4;
}

.form-error {
  margin: 0;
  color: #e55;
  font-size: 13px;
  text-align: center;
}

.save-button {
  height: 42px;
  margin-top: 2px;
  color: #fff;
  border: 0;
  border-radius: 7px;
  background: #7ecef4;
  font-size: 16px;
}
</style>
