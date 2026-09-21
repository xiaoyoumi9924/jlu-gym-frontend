<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getVenue } from '../data/venues'
import { setActiveVenue } from '../router'
import BottomNav from '../components/BottomNav.vue'
import arrangementIcon from '../assets/original/venue-arrangement.png'
import ticketIcon from '../assets/original/online-ticket.png'
import bookingIcon from '../assets/original/venue-booking.png'
import comingSoonIcon from '../assets/original/coming-soon.png'

const props = defineProps({
  venueId: { type: String, default: 'song' },
})

const venue = computed(() => getVenue(props.venueId))
const slide = ref(0)
let timer

function startCarousel() {
  window.clearInterval(timer)
  timer = window.setInterval(() => {
    slide.value = (slide.value + 1) % venue.value.banners.length
  }, 4500)
}

function selectSlide(index) {
  slide.value = index
  startCarousel()
}

watch(venue, (nextVenue) => {
  setActiveVenue(nextVenue.id)
  slide.value = 0
  startCarousel()
})

onMounted(() => {
  setActiveVenue(venue.value.id)
  startCarousel()
})

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <main class="home-page">
    <section class="venue-panel">
      <header>
        <h1>{{ venue.name }}</h1>
        <RouterLink to="/venues">查看其他校区 <span aria-hidden="true">〉</span></RouterLink>
      </header>

      <div class="carousel">
        <img class="hero" :src="venue.banners[slide]" :alt="`${venue.name}场馆`">
        <div class="carousel-dots" aria-label="轮播图选择">
          <button
            v-for="(_, index) in venue.banners"
            :key="index"
            type="button"
            :data-slide="index"
            :class="{ current: index === slide }"
            :aria-label="`查看第 ${index + 1} 张场馆图片`"
            :aria-current="index === slide ? 'true' : undefined"
            @click="selectSlide(index)"
          ></button>
        </div>
      </div>

      <p class="address">
        <svg class="info-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
          <circle cx="12" cy="9" r="2.3" />
        </svg>
        <span>{{ venue.address }}</span>
      </p>
      <div class="description">
        <p>
          <svg class="info-svg book-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17H7.5A2.5 2.5 0 0 0 5 21.5V4.5Z" />
            <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H19" />
          </svg>
          <span class="description-text">{{ venue.description }}</span>
          <button type="button">更多</button>
        </p>
        <a :href="`tel:${venue.phone}`">
          <svg class="phone-svg" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7.1 3.2 9.4 7 7.9 8.7c1.2 2.6 3.1 4.6 5.7 5.8l1.7-1.5 3.7 2.3c.5.3.7.9.5 1.4-.8 2-2.4 3.3-4.4 3.3C9.4 20 4 14.6 4 7.9c0-2 1.2-3.7 3.1-4.7Z" />
          </svg>
          <small>联系电话</small>
        </a>
      </div>
    </section>

    <section class="schedule">
      <img :src="arrangementIcon" alt="">
      <strong>场馆安排</strong>
      <span>查看</span>
      <i aria-hidden="true"></i>
    </section>

    <section class="online">
      <h2>在线功能</h2>
      <div class="feature-grid">
        <button type="button"><img :src="ticketIcon" alt=""><span>在线购票</span></button>
        <RouterLink :to="`/reserve/${venue.id}`"><img :src="bookingIcon" alt=""><span>场地预约</span></RouterLink>
        <button type="button"><img :src="comingSoonIcon" alt=""><span>敬请期待...</span></button>
      </div>
    </section>

    <BottomNav active="home" :venue-id="venue.id" />
  </main>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 10px 10px 92px;
  background: #f6f6f6;
}

.venue-panel,
.online {
  padding: 14px 12px;
  border-radius: 9px;
  background: #fff;
}

.venue-panel header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.venue-panel h1 {
  margin: 0 0 16px;
  font-size: 21px;
}

.venue-panel header a {
  color: #666;
  font-size: 16px;
}

.carousel {
  position: relative;
}

.hero {
  width: 100%;
  height: 184px;
  object-fit: cover;
  border-radius: 7px;
}

.carousel-dots {
  position: absolute;
  right: 0;
  bottom: 8px;
  left: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.carousel-dots button {
  width: 7px;
  height: 7px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, .52);
}

.carousel-dots .current {
  background: #fff;
}

.address {
  display: flex;
  margin: 15px 0 9px;
  color: #6b6b6b;
  font-size: 15px;
  align-items: center;
  gap: 5px;
}

.info-svg {
  width: 17px;
  height: 21px;
  flex: 0 0 auto;
  fill: none;
  stroke: #707070;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.description {
  display: grid;
  min-height: 50px;
  grid-template-columns: minmax(0, 1fr) 78px;
}

.description p {
  display: flex;
  min-width: 0;
  margin: 0;
  padding-right: 8px;
  color: #3f3f3f;
  font-size: 15px;
  font-weight: 600;
  border-right: 1px solid #e7e7e7;
  align-items: center;
}

.book-svg {
  width: 17px;
  height: 21px;
  margin-right: 5px;
}

.description-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.description p button {
  flex: 0 0 auto;
  padding: 0 0 0 3px;
  color: #5bc4f6;
  border: 0;
  background: #fff;
  font-size: 15px;
  white-space: nowrap;
}

.description a {
  display: grid;
  color: #707070;
  place-items: center;
}

.phone-svg {
  width: 30px;
  height: 30px;
  fill: none;
  stroke: #707070;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.9;
}

.description small {
  margin-top: 2px;
  font-size: 13px;
}

.schedule {
  position: relative;
  display: flex;
  min-height: 72px;
  margin: 10px 0;
  padding: 0 24px;
  overflow: hidden;
  background: #fff;
  align-items: center;
  gap: 22px;
}

.schedule img {
  width: 46px;
  height: 42px;
  object-fit: contain;
}

.schedule strong {
  color: #666;
  font-size: 17px;
}

.schedule span {
  color: var(--lime);
  font-size: 17px;
}

.schedule i {
  position: absolute;
  right: -10px;
  bottom: -10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 9, 148, .4);
}

.online {
  padding-top: 17px;
  padding-bottom: 18px;
}

.online h2 {
  margin: 0 0 25px;
  font-size: 22px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
}

.feature-grid > * {
  display: grid;
  padding: 0;
  color: #999;
  border: 0;
  background: transparent;
  place-items: center;
  gap: 8px;
}

.feature-grid img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.feature-grid span {
  font-size: 15px;
}
</style>
