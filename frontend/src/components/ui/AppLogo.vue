<template>
  <div class="app-logo" :style="cssVars">
    <img
      class="app-logo__mark"
      src="@/assets/logo.svg"
      alt=""
      width="40"
      height="40"
      decoding="async"
    />
    <span class="app-logo__wordmark text-h3">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Видимое название для вспомогательных технологий и подписи */
    title?: string
    /** Ширина знака в px */
    markSize?: number
  }>(),
  {
    title: 'Медцентр',
    markSize: 40,
  },
)

const cssVars = computed(() => ({
  '--app-logo-mark-size': `${props.markSize}px`,
}))
</script>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-12);
}

.app-logo__mark {
  width: var(--app-logo-mark-size);
  height: var(--app-logo-mark-size);
  flex-shrink: 0;
}

.app-logo__wordmark {
  margin: 0;
  color: var(--color-text-primary);
  font-weight: 600;
  letter-spacing: -0.02em;
}
</style>
