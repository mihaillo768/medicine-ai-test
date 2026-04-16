<template>
  <section
    class="section-intro"
    :aria-labelledby="title ? 'section-intro-title' : undefined"
  >
    <h2 v-if="title" id="section-intro-title" class="section-intro__title text-h2">
      {{ title }}
    </h2>
    <div class="section-intro__content text-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.section-intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  padding-block: var(--space-32);
}

.section-intro__title {
  margin: 0;
  max-width: 42rem;
}

.section-intro__content {
  margin: 0;
  max-width: 48rem;
  color: var(--color-text-secondary);
}

.section-intro__content :deep(p) {
  margin: 0 0 var(--space-16);
}

.section-intro__content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
