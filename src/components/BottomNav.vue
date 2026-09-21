<script setup>
import { computed } from 'vue'
import { getActiveVenueId } from '../router'
import homeIcon from '../assets/original/nav-home.png'
import reserveIcon from '../assets/original/nav-reserve.png'
import profileIcon from '../assets/original/nav-profile.png'
import homeActiveIcon from '../assets/original/nav-home-active.png'
import reserveActiveIcon from '../assets/original/nav-reserve-active.png'
import profileActiveIcon from '../assets/original/nav-profile-active.png'

const props = defineProps({
  active: { type: String, required: true },
  venueId: { type: String, default: '' },
})

const current = computed(() => props.venueId || getActiveVenueId())
const items = computed(() => [
  { id: 'home', label: '首页', to: `/home/${current.value}`, icon: homeIcon, activeIcon: homeActiveIcon },
  { id: 'reserve', label: '预约', to: `/reserve/${current.value}`, icon: reserveIcon, activeIcon: reserveActiveIcon },
  { id: 'profile', label: '我的', to: '/profile', icon: profileIcon, activeIcon: profileActiveIcon },
])
</script>

<template>
  <nav class="bottom-nav" aria-label="主导航">
    <RouterLink
      v-for="item in items"
      :key="item.id"
      :to="item.to"
      :class="{ active: active === item.id }"
    >
      <span
        class="nav-icon"
        :style="{ backgroundImage: `url(${active === item.id ? item.activeIcon : item.icon})` }"
        aria-hidden="true"
      ></span>
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
