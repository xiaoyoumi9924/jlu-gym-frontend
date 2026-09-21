<script setup>
import fixedQr from '../assets/original/fixed-entry-qr.png'
import ticketFrame from '../assets/original/entry-code-ticket.png'

defineProps({
  courtLabel: { type: String, required: true },
})

const emit = defineEmits(['close'])

const ticketSize = { width: '240px', height: '300px' }
const qrSize = { width: '150px', height: '150px' }
</script>

<template>
  <div class="entry-backdrop" @click.self="emit('close')">
    <section class="entry-ticket" :style="ticketSize" role="dialog" aria-modal="true" aria-label="入场码">
      <img class="ticket-frame" :src="ticketFrame" alt="" aria-hidden="true">
      <button class="entry-close" type="button" aria-label="关闭" @click="emit('close')"></button>
      <p class="court-label">{{ courtLabel }}</p>
      <h2>入场码</h2>
      <img class="entry-qr" :style="qrSize" :src="fixedQr" alt="固定入场二维码">
    </section>
  </div>
</template>

<style scoped>
.entry-backdrop {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
  padding: 24px;
  background: rgba(0, 0, 0, .52);
  align-items: center;
  justify-content: center;
}

.entry-ticket {
  position: relative;
  box-sizing: border-box;
  flex: 0 0 auto;
  padding: 0;
  overflow: visible;
  background: transparent;
  color: #222;
}

.ticket-frame {
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  object-fit: contain;
}

.entry-close {
  position: absolute;
  z-index: 2;
  top: 20px;
  right: 24px;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
}

.entry-close::before,
.entry-close::after {
  position: absolute;
  top: 9.5px;
  left: 0;
  width: 20px;
  height: 1px;
  content: '';
  background: #555;
}

.entry-close::before { transform: rotate(45deg); }
.entry-close::after { transform: rotate(-45deg); }

.court-label {
  position: relative;
  z-index: 1;
  margin: 40px 40px 0;
  font-size: 16px;
  line-height: 22px;
}

.entry-ticket h2 {
  position: relative;
  z-index: 1;
  margin: 10px 0 20px;
  color: #4493d5;
  font-size: 24px;
  font-weight: 400;
  line-height: 29px;
  text-align: center;
}

.entry-qr {
  position: relative;
  z-index: 1;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}
</style>
