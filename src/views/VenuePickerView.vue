<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { venues } from '../data/venues'
import { setActiveVenue } from '../router'
import VenueCard from '../components/VenueCard.vue'
import BookingSetupModal from '../components/BookingSetupModal.vue'
import logo from '../assets/original/logo.png'

const router = useRouter()
const venueChoices = [venues.song, venues.qianwei]
const showBookingSetup = ref(false)
const showSaveSuccess = ref(false)

function openBookingSetup() {
  showBookingSetup.value = true
}

function handleSaved() {
  showBookingSetup.value = false
  showSaveSuccess.value = true
}

function closeSaveSuccess() {
  showSaveSuccess.value = false
}

function selectVenue(venue) {
  setActiveVenue(venue.id)
  router.push(`/home/${venue.id}`)
}
</script>

<template>
  <main class="venue-picker">
    <img class="platform-logo" :src="logo" alt="宋治平体育馆预约系统标志" @click="openBookingSetup">
    <h1>宋治平体育馆预约系统</h1>
    <p>宋治平体育馆</p>
    <section class="venue-list" aria-label="选择场馆">
      <VenueCard
        v-for="venue in venueChoices"
        :key="venue.id"
        :venue="venue"
        @select="selectVenue"
      />
    </section>
    <BookingSetupModal
      v-if="showBookingSetup"
      @close="showBookingSetup = false"
      @saved="handleSaved"
    />

    <div v-if="showSaveSuccess" class="success-backdrop" role="presentation">
      <section
        class="success-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-success-title"
        data-save-success
      >
        <button
          class="success-close"
          type="button"
          aria-label="关闭保存成功提示"
          @click="closeSaveSuccess"
        >×</button>
        <div class="success-mark" aria-hidden="true">✓</div>
        <h2 id="save-success-title">保存成功</h2>
        <button class="success-confirm" type="button" data-success-confirm @click="closeSaveSuccess">
          确定
        </button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.venue-picker {
  min-height: 100vh;
  padding: 92px 30px 30px;
  text-align: center;
  background: #f7f7f7;
}

.platform-logo {
  width: 112px;
  height: 112px;
  margin: 0 auto;
  object-fit: contain;
}

.venue-picker h1 {
  margin: 36px 0 46px;
  font-size: 30px;
  font-weight: 400;
}

.venue-picker > p {
  margin: 0;
  color: #aaa;
  font-size: 19px;
}

.venue-list {
  display: grid;
  margin-top: 36px;
  gap: 8px;
}

.success-backdrop {
  position: fixed;
  z-index: 110;
  inset: 0;
  display: grid;
  padding: 24px;
  background: rgba(0, 0, 0, .42);
  place-items: center;
}

.success-dialog {
  position: relative;
  width: min(100%, 310px);
  padding: 30px 24px 22px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 12px 36px rgba(0, 0, 0, .2);
}

.success-close {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 34px;
  height: 34px;
  padding: 0;
  color: #999;
  border: 0;
  background: transparent;
  font-size: 28px;
  line-height: 1;
}

.success-mark {
  display: grid;
  width: 54px;
  height: 54px;
  margin: 0 auto 14px;
  color: #fff;
  border-radius: 50%;
  background: #7ecef4;
  font-size: 32px;
  place-items: center;
}

.success-dialog h2 {
  margin: 0 0 24px;
  color: #333;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.success-confirm {
  width: 100%;
  height: 42px;
  color: #fff;
  border: 0;
  border-radius: 7px;
  background: #7ecef4;
  font-size: 16px;
}

@media (max-width: 370px) {
  .venue-picker {
    padding-right: 20px;
    padding-left: 20px;
  }

  .venue-picker h1 {
    font-size: 26px;
  }
}
</style>
