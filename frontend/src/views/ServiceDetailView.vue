<template>
  <main v-if="service" class="page">
    <PageHero
      :title="service.title"
      :subtitle="service.intro"
      eyebrow="Услуга"
      :image="service.image"
      :image-alt="service.imageAlt"
    >
      <template #actions>
        <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
          <AppButton variant="primary" @click="navigate">Записаться</AppButton>
        </RouterLink>
      </template>
    </PageHero>

    <div class="container detail">
      <article class="detail__article">
        <section
          v-for="(block, idx) in service.sections"
          :key="idx"
          class="detail__block"
        >
          <h2 class="detail__h2 text-h2">{{ block.heading }}</h2>
          <p class="detail__p text-body">{{ block.body }}</p>
        </section>
      </article>

      <section v-if="related.length" class="detail__related" aria-labelledby="related-title">
        <h2 id="related-title" class="detail__h2 text-h2">Связанные услуги</h2>
        <div class="detail__cards">
          <CardService
            v-for="r in related"
            :key="r.slug"
            :title="r.title"
            :description="r.shortDescription"
          >
            <template #media>
              <img :src="r.image" :alt="r.imageAlt" loading="lazy" />
            </template>
            <template #actions>
              <RouterLink v-slot="{ navigate }" :to="`/services/${r.slug}`" custom>
                <AppButton variant="secondary" @click="navigate">Подробнее</AppButton>
              </RouterLink>
            </template>
          </CardService>
        </div>
      </section>

      <BookingBlock
        class="detail__booking"
        title="Запись на услугу"
        description="Укажите телефон — согласуем время и подскажем подготовку."
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import CardService from '@/components/ui/CardService.vue'
import BookingBlock from '@/components/sections/BookingBlock.vue'
import PageHero from '@/components/sections/PageHero.vue'
import { bookingPath } from '@/config/nav'
import { getServiceBySlug, services } from '@/data'

const route = useRoute()
const router = useRouter()

const service = computed(() => getServiceBySlug(route.params.slug as string))

const related = computed(() => {
  const s = service.value
  if (!s) return []
  return s.relatedSlugs
    .map((slug) => services.find((x) => x.slug === slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
})

function ensureFound() {
  if (!getServiceBySlug(route.params.slug as string)) {
    router.replace({ name: 'not-found-explicit' })
  }
}

onBeforeMount(ensureFound)
watch(() => route.params.slug, ensureFound)
</script>

<style scoped>
.detail {
  padding-block: var(--space-32);
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
}

.detail__article {
  max-width: 42rem;
}

.detail__block + .detail__block {
  margin-top: var(--space-24);
}

.detail__h2 {
  margin: 0 0 var(--space-12);
}

.detail__p {
  margin: 0;
  color: var(--color-text-secondary);
}

.detail__related {
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border-subtle);
}

.detail__cards {
  display: grid;
  gap: var(--space-24);
  margin-top: var(--space-24);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .detail__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.detail__booking {
  margin-top: var(--space-8);
}
</style>
