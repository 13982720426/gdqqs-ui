<template>
  <div>
    <span class="date-text">{{ dateText }}</span>
  </div>
</template>

<script setup>
import { parseTime } from '@/utils/hanta'

const dateText = ref();
setInterval(() => {
    dateText.value = parseTime(new Date(), '{y}年{m}月{d}日 星期{a} {h}:{i}:{s}')
}, 1000);
</script>

<style lang="scss" scoped>
.date-text {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  margin-right: 6px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
