<template>
  <div class="not-found page-shell">
    <div class="container not-found__layout">
      <div class="not-found__copy">
        <p class="not-found__code text-h1">404</p>
        <h1 class="not-found__title text-h2">Страница не найдена</h1>
        <p class="not-found__text text-body">
          Проверьте адрес или вернитесь на главную.
        </p>
        <div class="not-found__actions">
          <RouterLink v-slot="{ navigate }" to="/" custom>
            <AppButton variant="primary" @click="navigate">На главную</AppButton>
          </RouterLink>
          <RouterLink v-slot="{ navigate }" to="/services" custom>
            <AppButton variant="secondary" @click="navigate">Услуги</AppButton>
          </RouterLink>
        </div>
      </div>
      <figure class="not-found__figure">
        <img
          class="not-found__img"
          :src="img.notFound"
          alt="Нейтральный декоративный фон"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import { img } from '@/data'
</script>

<style scoped>
.page-shell {
  padding-block: var(--space-32);
}

.not-found__layout {
  display: grid;
  gap: var(--space-32);
  align-items: center;
}

@media (min-width: 768px) {
  .not-found__layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 320px);
  }
}

.not-found__copy {
  min-width: 0;
}

.not-found__figure {
  margin: 0;
  border-radius: var(--radius-16);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  background-color: var(--color-bg-muted);
}

.not-found__img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.not-found__code {
  margin: 0 0 var(--space-8);
  color: var(--color-accent-default);
}

.not-found__title {
  margin: 0 0 var(--space-16);
}

.not-found__text {
  margin: 0 0 var(--space-24);
  color: var(--color-text-secondary);
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
}
</style>
