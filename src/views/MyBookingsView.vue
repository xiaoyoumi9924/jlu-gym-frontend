<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getVenue } from '../data/venues'
import { cancelMockBooking, getMockBooking } from '../data/mockBooking'

const router = useRouter()
const booking = ref(getMockBooking())
const venue = computed(() => booking.value ? getVenue(booking.value.venueId) : null)
const sport = computed(() => venue.value?.sports.find((item) => item.name === booking.value?.sportName) ?? null)

function cancelBooking() {
  booking.value = cancelMockBooking()
}
</script>

<template>
  <main class="my-bookings-page">
    <header class="booking-tabs">
      <div class="tab active">场地</div>
    </header>

    <button class="date-filter" type="button">
      <span>选择日期区间</span>
      <span class="chevron" aria-hidden="true">〉</span>
    </button>

    <section v-if="booking" class="order-card" data-booking-card>
      <div class="order-head">
        <span>订单号：{{ booking.orderNo }}</span>
        <span v-if="booking.status === 'cancelled'" class="cancelled">已取消</span>
      </div>

      <div class="order-body">
        <div class="sport-photo-wrap">
          <img v-if="sport" class="sport-photo" :src="sport.image" :alt="booking.sportName">
          <div class="photo-bottom" aria-hidden="true"></div>
        </div>

        <div class="order-info">
          <p>场地：{{ booking.sportName }}</p>
          <p>数量： <em>{{ booking.quantity }}</em></p>
          <p>购买时间：{{ booking.purchaseTime }}</p>
          <div class="order-actions">
            <button type="button" @click="router.push('/my-bookings/detail')">查看详情</button>
            <button v-if="booking.status !== 'cancelled'" type="button" @click="cancelBooking">取消预约</button>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="empty-state">
      <img src="../assets/original/my-booking.png" alt="">
      <p>暂无预约</p>
    </section>

    <button class="floating-back" type="button" @click="router.push('/profile')">
      <span aria-hidden="true">↶</span>
      <small>返回我的</small>
    </button>
  </main>
</template>

<style scoped>
.my-bookings-page {
  position: relative;
  min-height: 100vh;
  padding: 0 12px 76px;
  background: #f6f6f6;
}

.booking-tabs {
  height: 72px;
  margin: 0 -12px 14px;
  padding-top: 23px;
  border-radius: 0 0 8px 8px;
  background: #fff;
  text-align: center;
}

.tab {
  position: relative;
  display: inline-block;
  min-width: 46px;
  padding-bottom: 20px;
  color: #72b8f3;
  font-size: 20px;
}

.tab::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  content: '';
  background: #73b9f6;
}

.date-filter {
  display: flex;
  width: 100%;
  height: 48px;
  margin-bottom: 24px;
  padding: 0 12px;
  color: #333;
  border: 0;
  border-radius: 7px;
  background: #fff;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
}

.chevron {
  color: #aaa;
  font-size: 28px;
  font-weight: 200;
}

.order-card {
  padding: 13px 11px 18px;
  border-radius: 7px;
  background: #fff;
}

.order-head {
  display: flex;
  min-width: 0;
  margin-bottom: 9px;
  color: #aaa;
  justify-content: space-between;
  font-size: 13px;
  white-space: nowrap;
}

.order-head > :first-child {
  overflow: hidden;
  text-overflow: ellipsis;
}

.cancelled {
  margin-left: 10px;
  flex: 0 0 auto;
}

.order-body {
  display: grid;
  grid-template-columns: 126px minmax(0, 1fr);
  gap: 25px;
}

.sport-photo-wrap {
  position: relative;
  width: 126px;
  height: 126px;
  overflow: hidden;
  border-radius: 6px;
  background: #efefef;
}

.sport-photo {
  width: 126px;
  height: 92px;
  object-fit: cover;
}

.photo-bottom {
  height: 34px;
  background: #eee;
}

.order-info {
  min-width: 0;
  color: #909090;
  font-size: 15px;
}

.order-info p {
  margin: 2px 0 21px;
  white-space: nowrap;
}

.order-info em {
  color: #5dc5f5;
  font-style: normal;
}

.order-actions {
  display: flex;
  margin-top: -6px;
  justify-content: flex-end;
  gap: 11px;
}

.order-actions button {
  min-width: 78px;
  height: 36px;
  padding: 0 10px;
  color: #fff;
  border: 0;
  border-radius: 6px;
  background: #69c3ed;
  font-size: 16px;
}

.empty-state {
  display: grid;
  min-height: 320px;
  color: #bbb;
  place-content: center;
  justify-items: center;
  gap: 14px;
}

.empty-state img {
  width: 58px;
  height: 58px;
  object-fit: contain;
  opacity: .45;
}

.empty-state p { margin: 0; font-size: 14px; }

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
