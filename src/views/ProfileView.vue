<script setup>
import { getActiveVenueId } from '../router'
import { profile } from '../data/venues'
import BottomNav from '../components/BottomNav.vue'
import avatar from '../assets/original/profile-avatar.png'
import male from '../assets/original/male.png'
import booking from '../assets/original/my-booking.png'
import invite from '../assets/original/my-invite.png'
import tickets from '../assets/original/ticket-record.png'
import comingSoon from '../assets/original/coming-soon.png'

const actions = [
  { label: '我的预约', icon: booking, to: '/my-bookings' },
  { label: '我的邀请', icon: invite },
  { label: '购票记录', icon: tickets },
  { label: '敬请期待...', icon: comingSoon },
]
</script>

<template>
  <main class="profile-page">
    <section class="profile-hero">
      <img class="avatar" :src="avatar" alt="李子涵头像">
      <div class="profile-copy">
        <h1>
          <span data-profile-name>{{ profile.name }}</span>
          <img :src="male" alt="男">
        </h1>
        <p data-student-id>学号：{{ profile.studentId }}</p>
      </div>
    </section>

    <section class="assistant-card">
      <h2>我的助手</h2>
      <div class="divider"></div>
      <div class="assistant-grid">
        <template v-for="action in actions" :key="action.label">
          <RouterLink v-if="action.to" :to="action.to" class="assistant-action">
            <img :src="action.icon" alt="">
            <span>{{ action.label }}</span>
          </RouterLink>
          <button v-else type="button" class="assistant-action">
            <img :src="action.icon" alt="">
            <span>{{ action.label }}</span>
          </button>
        </template>
      </div>
    </section>

    <BottomNav active="profile" :venue-id="getActiveVenueId()" />
  </main>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 6px 8px 92px;
  background: #f6f6f6;
}

.profile-hero {
  display: flex;
  min-height: 136px;
  padding: 16px;
  color: #fff;
  background: linear-gradient(115deg, #83b9f6, #7be9b0);
  align-items: flex-start;
  gap: 18px;
}

.avatar {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, .6);
  border-radius: 50%;
}

.profile-copy {
  min-width: 0;
}

.profile-hero h1 {
  display: flex;
  margin: 4px 0 14px;
  font-size: 25px;
  align-items: center;
  gap: 9px;
}

.profile-hero h1 img {
  width: 23px;
  height: 23px;
}

.profile-hero p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.assistant-card {
  margin: 14px 6px;
  padding: 18px 12px 24px;
  border-radius: 8px;
  background: #fff;
}

.assistant-card h2 {
  margin: 0 0 21px;
  font-size: 24px;
}

.divider {
  height: 1px;
  background: #ddd;
}

.assistant-grid {
  display: grid;
  margin-top: 24px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 0;
}

.assistant-action {
  display: flex;
  min-width: 0;
  width: 100%;
  padding: 0;
  color: #999;
  border: 0;
  background: transparent;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.assistant-grid img {
  width: 50px;
  height: 50px;
  margin: 0 0 8px;
  object-fit: contain;
}

.assistant-grid span {
  display: block;
  width: 100%;
  overflow: hidden;
  font-size: 15px;
  line-height: 1.35;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
