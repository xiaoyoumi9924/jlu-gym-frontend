<script setup>
import venueArrow from '../assets/original/venue-arrow.png'

defineProps({
  venue: { type: Object, required: true },
})

defineEmits(['select'])
</script>

<template>
  <button class="venue-card" type="button" @click="$emit('select', venue)">
    <img class="venue-thumb" :src="venue.thumb" :alt="venue.name">
    <strong>{{ venue.name }}</strong>
    <img class="venue-chevron" :src="venueArrow" alt="" aria-hidden="true">
  </button>
</template>

<style scoped>
.venue-card {
  display: grid;
  width: 100%;
  min-height: 112px;
  padding: 16px 18px;
  color: #333;
  text-align: left;
  border: 0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 0 #ccc;
  grid-template-columns: 82px 1fr auto;
  align-items: center;
  gap: 18px;
}

.venue-thumb {
  width: 82px;
  height: 82px;
  object-fit: cover;
  border-radius: 50%;
}

.venue-card strong {
  font-size: 25px;
  font-weight: 400;
  white-space: nowrap;
}

.venue-chevron {
  display: block;
  width: 25px;
  height: auto;
  object-fit: contain;
}
</style>
