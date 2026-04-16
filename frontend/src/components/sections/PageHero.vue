<template>
  <section class="page-hero" :aria-labelledby="titleId">
    <div class="page-hero__media">
      <img class="page-hero__img" :src="image" :alt="imageAlt" loading="eager" decoding="async" />
      <div class="page-hero__overlay" aria-hidden="true" />
    </div>
    <div class="container page-hero__content">
      <p v-if="eyebrow" class="page-hero__eyebrow text-caption">{{ eyebrow }}</p>
      <h1 :id="titleId" class="page-hero__title text-h1">{{ title }}</h1>
      <p v-if="subtitle" class="page-hero__subtitle text-body">{{ subtitle }}</p>
      <div v-if="$slots.actions" class="page-hero__actions">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  title: string
  subtitle?: string
  eyebrow?: string
  image: string
  imageAlt: string
}>()

const uid = useId()
const titleId = `page-hero-${uid}`
</script>

<style scoped>
.page-hero {
  position: relative;
  display: grid;
  min-height: 280px;
  align-items: end;
  margin-bottom: var(--space-32);
}

@media (min-width: 768px) {
  .page-hero {
    min-height: 360px;
    border-radius: 0 0 var(--radius-16) var(--radius-16);
    overflow: hidden;
  }
}

.page-hero__media {
  position: absolute;
  inset: 0;
  background-color: var(--color-bg-muted);
}

.page-hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgb(26 46 50 / 78%) 0%,
    rgb(26 46 50 / 35%) 45%,
    rgb(26 46 50 / 15%) 100%
  );
}

.page-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-12);
  padding-block: var(--space-32);
  color: var(--color-text-on-accent);
}

.page-hero__eyebrow {
  margin: 0;
  color: rgb(255 255 255 / 85%);
}

.page-hero__title {
  margin: 0;
  color: var(--color-text-on-accent);
}

.page-hero__subtitle {
  margin: 0;
  max-width: 40rem;
  color: rgb(255 255 255 / 92%);
}

.page-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  margin-top: var(--space-12);
}
</style>
