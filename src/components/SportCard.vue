<script setup>
defineProps({
  sport: { type: Object, required: true },
})

defineEmits(['reserve'])
</script>

<template>
  <article class="sport-card" :data-sport="sport.name">
    <img :src="sport.image" :alt="sport.name">
    <div class="sport-copy">
      <p>项目：{{ sport.name }}</p>
      <p>开始营业时间：<em>{{ sport.time }}</em></p>
    </div>
    <button type="button" @click="$emit('reserve', sport)">预约场地</button>
  </article>
</template>

<style scoped>
.sport-card {
  display: grid;
  min-height: 110px;
  padding: 11px;
  border-radius: 8px;
  background: #fff;
  grid-template-columns: 88px minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
}

.sport-card img {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 6px;
}

.sport-copy {
  min-width: 0;
}

.sport-copy p {
  margin: 8px 0;
  overflow: hidden;
  color: #888;
  font-size: 15px;
  white-space: nowrap;
}

.sport-copy em {
  color: #69c9f4;
  font-style: normal;
}

.sport-card button {
  padding: 12px 10px;
  color: #fff;
  border: 0;
  border-radius: 7px;
  background: #72c8ee;
  white-space: nowrap;
}

@media (max-width: 370px) {
  .sport-card {
    grid-template-columns: 78px minmax(0, 1fr) auto;
    gap: 8px;
  }

  .sport-card img {
    width: 78px;
    height: 78px;
  }

  .sport-copy p {
    font-size: 14px;
  }

  .sport-card button {
    padding: 11px 7px;
  }
}
</style>
