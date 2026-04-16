<template>
  <header class="page-masthead">
    <div class="page-masthead__text">
      <h1 class="page-masthead__title text-h1">{{ title }}</h1>
      <p v-if="lead" class="page-masthead__lead text-body">{{ lead }}</p>
    </div>
    <figure class="page-masthead__figure">
      <img
        class="page-masthead__img"
        :src="image"
        :alt="imageAlt"
        loading="lazy"
        decoding="async"
      />
    </figure>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  lead?: string
  image: string
  imageAlt: string
}>()
</script>

<style scoped>
.page-masthead {
  display: grid;
  gap: var(--space-24);
  margin-bottom: var(--space-32);
  align-items: center;
}

@media (min-width: 768px) {
  .page-masthead {
    grid-template-columns: minmax(0, 1fr) minmax(0, 280px);
    gap: var(--space-32);
  }
}

@media (min-width: 960px) {
  .page-masthead {
    grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
  }
}

.page-masthead__title {
  margin: 0 0 var(--space-12);
}

.page-masthead__lead {
  margin: 0;
  max-width: 42rem;
  color: var(--color-text-secondary);
}

.page-masthead__figure {
  margin: 0;
  border-radius: var(--radius-16);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  background-color: var(--color-bg-muted);
}

.page-masthead__img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}
</style>
