<template>
  <section class="app-main">
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!settingsStore.topNav"
    />
    <router-view v-slot="{ Component, route }">
<!--      <transition name="fade-transform" mode="out-in">-->
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
<!--      </transition>-->
    </router-view>
  </section>
</template>

<script setup>
import Breadcrumb from "@/components/Breadcrumb";
import useTagsViewStore from "@/store/modules/tagsView";
import useSettingsStore from "@/store/modules/settings";

const tagsViewStore = useTagsViewStore();
const settingsStore = useSettingsStore();
const route = useRoute();
tagsViewStore.addCachedView(route);
const cachedViews = computed(() => {
  return tagsViewStore.cachedViews;
});
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 0 12px;
  background-color: #F5F5F5;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 17px;
  }
}
</style>
