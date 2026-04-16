<template>
  <header class="section-heading">
    <h2 :id="headingId || undefined" class="section-heading__title text-h2">{{ title }}</h2>
    <p v-if="description" class="section-heading__description text-body">{{ description }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  /** Для aria-labelledby у секции */
  headingId?: string
}>()
</script>

<style scoped>
.section-heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  max-width: 42rem;
}

.section-heading__title {
  margin: 0;
}

.section-heading__description {
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
