<template>
  <article class="card-service">
    <div class="card-service__media">
      <slot name="media">
        <div class="card-service__media-placeholder" aria-hidden="true" />
      </slot>
    </div>
    <div class="card-service__body">
      <h3 class="card-service__title text-h3">{{ title }}</h3>
      <p v-if="description" class="card-service__text text-body">{{ description }}</p>
      <div v-if="$slots.actions" class="card-service__actions">
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<style scoped>
.card-service {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-16);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
}

.card-service__media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: var(--color-bg-muted);
}

.card-service__media :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-service__media-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    145deg,
    var(--color-bg-muted) 0%,
    var(--color-border-subtle) 100%
  );
}

.card-service__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-12);
  padding: var(--space-24);
}

.card-service__title {
  margin: 0;
}

.card-service__text {
  margin: 0;
  flex: 1;
  color: var(--color-text-secondary);
}

.card-service__actions {
  margin-top: auto;
  padding-top: var(--space-8);
}
</style>
