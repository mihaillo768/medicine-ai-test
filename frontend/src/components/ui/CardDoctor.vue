<template>
  <article class="card-doctor">
    <div class="card-doctor__media">
      <slot name="media">
        <div class="card-doctor__media-placeholder" aria-hidden="true" />
      </slot>
    </div>
    <div class="card-doctor__body">
      <h3 class="card-doctor__title text-h3">{{ title }}</h3>
      <p v-if="role" class="card-doctor__role text-caption">{{ role }}</p>
      <p v-if="description" class="card-doctor__text text-body">{{ description }}</p>
      <div v-if="$slots.actions" class="card-doctor__actions">
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  role?: string
  description?: string
}>()
</script>

<style scoped>
.card-doctor {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-16);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
}

.card-doctor__media {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background-color: var(--color-bg-muted);
}

.card-doctor__media :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-doctor__media-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    160deg,
    var(--color-bg-muted) 0%,
    var(--color-border-subtle) 100%
  );
}

.card-doctor__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-8);
  padding: var(--space-24);
}

.card-doctor__title {
  margin: 0;
}

.card-doctor__role {
  margin: 0;
  color: var(--color-accent-default);
}

.card-doctor__text {
  margin: 0;
  flex: 1;
  color: var(--color-text-secondary);
}

.card-doctor__actions {
  margin-top: auto;
  padding-top: var(--space-8);
}
</style>
