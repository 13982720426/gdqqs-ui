<template>
  <div class="title">
    <label class="title-label">{{ this.$props.title}}</label>
    <div class="title-content">
        <slot></slot>
    </div>
  </div>
</template>

<script setup name="OfferSaveTitle">
import { defineProps} from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
@import "@/assets/styles/variables.module.scss";

.title {
  padding: 24px;
  background-color: #fff;

  .title-label {
    padding-left: 12px;
    position: relative;
    margin-bottom: 16px;
    display: inline-block;

    &::before {
      position: absolute;
      content: ' ';
      width: 4px;
      height: 100%;
      border-radius: 0 2px 2px 0;
      background-color: $--color-primary;
      left: 0;
      top: 0;
    }
  }
}
</style>