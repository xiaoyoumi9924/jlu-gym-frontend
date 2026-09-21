<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getVenue } from '../data/venues'
import { setActiveVenue } from '../router'
import SportCard from '../components/SportCard.vue'
import BottomNav from '../components/BottomNav.vue'

const props = defineProps({
  venueId: { type: String, default: 'song' },
})

const venue = computed(() => getVenue(props.venueId))
const message = ref('')
let messageTimer

watch(venue, (nextVenue) => setActiveVenue(nextVenue.id))
onMounted(() => setActiveVenue(venue.value.id))
onBeforeUnmount(() => window.clearTimeout(messageTimer))

function reserve() {
  window.clearTimeout(messageTimer)
  message.value = '演示页面不连接预约后台'
  messageTimer = window.setTimeout(() => {
    message.value = ''
  }, 1800)
}
</script>

<template>
  <main class="reservation-page">
    <header class="reservation-tab">场地</header>
    <section class="sport-list" :aria-label="`${venue.name}可预约项目`">
      <SportCard
        v-for="sport in venue.sports"
        :key="sport.name"
        :sport="sport"
        @reserve="reserve"
      />
    </section>
    <p v-if="message" role="status" class="toast">{{ message }}</p>
    <BottomNav active="reserve" :venue-id="venue.id" />
  </main>
</template>

<style scoped>
.reservation-page {
  min-height: 100vh;
  padding: 0 6px 92px;
  background: #f6f6f6;
}

.reservation-tab {
  position: relative;
  display: grid;
  height: 70px;
  color: #69baff;
  background: #fff;
  font-size: 22px;
  place-items: center;
}

.reservation-tab::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 44px;
  height: 2px;
  content: '';
  transform: translateX(-50%);
  background: #69baff;
}

.sport-list {
  display: grid;
  margin-top: 7px;
  gap: 8px;
}

.toast {
  position: fixed;
  z-index: 40;
  bottom: 96px;
  left: 50%;
  max-width: min(310px, calc(100% - 32px));
  margin: 0;
  padding: 10px 16px;
  transform: translateX(-50%);
  color: #fff;
  border-radius: 20px;
  background: rgba(0, 0, 0, .72);
  font-size: 14px;
  white-space: nowrap;
}
</style>
