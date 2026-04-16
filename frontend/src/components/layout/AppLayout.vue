<template>
  <div class="app-layout">
    <AppHeader />
    <main id="main-content" class="app-layout__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.app-layout__main {
  flex: 1 0 auto;
  width: 100%;
}
</style>
