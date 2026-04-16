<template>
  <main class="page">
    <div class="container page__inner">
      <PageMastheadWithMedia
        title="Цены"
        :lead="
          'Ориентиры по стоимости консультаций и исследований. Точную сумму уточняйте при записи.'
        "
        :image="img.mastheadPrices"
        image-alt="Зона регистратуры в медицинском центре"
      />

      <p class="prices__disclaimer text-caption">{{ priceDisclaimer }}</p>

      <div class="prices">
        <section
          v-for="cat in priceCategories"
          :key="cat.title"
          class="prices__section"
        >
          <h2 class="prices__cat text-h2">{{ cat.title }}</h2>
          <ul class="prices__list">
            <li v-for="row in cat.items" :key="row.name" class="prices__row">
              <div class="prices__name text-body">{{ row.name }}</div>
              <div class="prices__price text-body">{{ row.price }}</div>
              <p v-if="row.note" class="prices__note text-caption">{{ row.note }}</p>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <BottomCta
      title="Нужна консультация?"
      description="Запишитесь онлайн или по телефону — подскажем, какие исследования могут понадобиться."
    >
      <template #actions>
        <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
          <AppButton variant="primary" @click="navigate">Записаться</AppButton>
        </RouterLink>
      </template>
    </BottomCta>
  </main>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import BottomCta from '@/components/sections/BottomCta.vue'
import PageMastheadWithMedia from '@/components/sections/PageMastheadWithMedia.vue'
import { bookingPath } from '@/config/nav'
import { img, priceCategories, priceDisclaimer } from '@/data'
</script>

<style scoped>
.page__inner {
  padding-block: var(--space-32);
}

.prices__disclaimer {
  margin: 0 0 var(--space-32);
  max-width: 48rem;
  color: var(--color-text-secondary);
}

.prices {
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
}

.prices__cat {
  margin: 0 0 var(--space-16);
}

.prices__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.prices__row {
  display: grid;
  gap: var(--space-4) var(--space-16);
  padding: var(--space-16);
  border-radius: var(--radius-12);
  border: 1px solid var(--color-border-subtle);
  background-color: var(--color-bg-surface);
  grid-template-columns: 1fr auto;
}

.prices__note {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--color-text-secondary);
}

@media (min-width: 768px) {
  .prices__row {
    grid-template-columns: 1fr auto;
    align-items: baseline;
  }
}
</style>
