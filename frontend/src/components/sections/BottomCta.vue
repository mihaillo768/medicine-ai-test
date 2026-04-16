<template>
  <section class="bottom-cta" :aria-labelledby="titleId">
    <div class="container bottom-cta__inner">
      <h2 :id="titleId" class="bottom-cta__title text-h2">{{ title }}</h2>
      <p v-if="description" class="bottom-cta__text text-body">{{ description }}</p>
      <div class="bottom-cta__actions">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

defineProps<{
  title: string
  description?: string
}>()

const uid = useId()
const titleId = computed(() => `bottom-cta-${uid}`)
</script>

<style scoped>
.bottom-cta {
  padding-block: var(--space-32);
  background-color: var(--color-bg-muted);
  border-block: 1px solid var(--color-border-subtle);
}

.bottom-cta__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
  align-items: flex-start;
}

.bottom-cta__title {
  margin: 0;
  max-width: 36rem;
}

.bottom-cta__text {
  margin: 0;
  max-width: 40rem;
  color: var(--color-text-secondary);
}

.bottom-cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  align-items: center;
}
</style>
