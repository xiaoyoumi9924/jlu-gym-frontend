<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getVenue } from '../data/venues'
import { getMockBooking } from '../data/mockBooking'
import EntryCodeModal from '../components/EntryCodeModal.vue'
import miniQr from '../assets/original/mini-entry-qr.png'

const router = useRouter()
const booking = ref(getMockBooking())
const showEntryCode = ref(false)
const venue = computed(() => booking.value ? getVenue(booking.value.venueId) : null)
const sport = computed(() => venue.value?.sports.find((item) => item.name === booking.value?.sportName) ?? null)
const courtLabel = computed(() => booking.value ? `${booking.value.sportName}${booking.value.courtNumber}` : '')
</script>

<template>
  <main class="detail-page">
    <section v-if="booking" class="detail-card">
      <div class="sport-thumb-wrap">
        <img v-if="sport" class="sport-thumb" :src="sport.image" :alt="booking.sportName">
        <div class="thumb-bottom" aria-hidden="true"></div>
      </div>

      <div class="detail-copy">
        <button class="mini-qr" type="button" aria-label="查看入场码" @click="showEntryCode = true">
          <img class="mini-qr-glyph" :src="miniQr" alt="">
        </button>
        <p>场地：{{ courtLabel }}</p>
        <p>开始时间：{{ booking.date }} <em>{{ booking.startTime }}</em></p>
        <p>结束时间：{{ booking.date }} <em>{{ booking.endTime }}</em></p>
        <button class="companion" type="button">同行人</button>
      </div>
    </section>

    <section v-else class="empty-detail">暂无预约</section>

    <button class="floating-back" type="button" @click="router.push('/my-bookings')">
      <span aria-hidden="true">↶</span>
      <small>返回预约</small>
    </button>

    <EntryCodeModal v-if="showEntryCode && booking" :court-label="courtLabel" @close="showEntryCode = false" />
  </main>
</template>

<style scoped>
.detail-page {
  position: relative;
  min-height: 100vh;
  padding: 29px 27px 70px;
  background: #f7f7f7;
}

.detail-card {
  display: grid;
  min-height: 190px;
  padding: 22px 21px;
  border-radius: 8px;
  background: #fff;
  grid-template-columns: 126px minmax(0, 1fr);
  gap: 17px;
}

.sport-thumb-wrap {
  position: relative;
  width: 126px;
  height: 126px;
  overflow: hidden;
  border-radius: 7px;
  background: #eee;
}

.sport-thumb {
  width: 126px;
  height: 91px;
  object-fit: cover;
}

.thumb-bottom {
  position: absolute;
  right: 7px;
  bottom: -8px;
  left: 7px;
  height: 27px;
  border-radius: 7px 7px 0 0;
  background: #ddd;
}

.detail-copy {
  position: relative;
  min-width: 0;
  padding-top: 0;
  color: #8e8e8e;
  font-size: 15px;
}

.detail-copy p {
  margin: 0 0 19px;
  white-space: nowrap;
}

.detail-copy em {
  color: #55bdf2;
  font-style: normal;
}

.mini-qr {
  position: absolute;
  top: -1px;
  right: 0;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  background: transparent;
}

.mini-qr-glyph {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.companion {
  min-width: 66px;
  height: 36px;
  padding: 0 12px;
  color: #fff;
  border: 0;
  border-radius: 7px;
  background: #67c3ee;
  font-size: 16px;
}

.empty-detail {
  display: grid;
  min-height: 280px;
  color: #aaa;
  place-items: center;
}

.floating-back {
  position: fixed;
  z-index: 8;
  right: max(calc((100vw - 430px) / 2 + 14px), 14px);
  bottom: 68px;
  display: grid;
  width: 48px;
  height: 48px;
  padding: 4px 0 3px;
  color: #fff;
  border: 0;
  border-radius: 50%;
  background: #999;
  place-items: center;
}

.floating-back span {
  margin-bottom: -5px;
  font-size: 26px;
  line-height: 1;
}

.floating-back small {
  font-size: 7px;
  line-height: 1;
}
</style>
