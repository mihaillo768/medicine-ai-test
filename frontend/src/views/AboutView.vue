<template>
  <main class="page">
    <PageHero
      title="О центре"
      subtitle="Взрослая медицина в формате амбулатории: внимание к деталям, прозрачные рекомендации и уважение к вашему времени."
      eyebrow="Медцентр"
      :image="img.hall"
      image-alt="Светлый коридор клиники"
    >
      <template #actions>
        <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
          <AppButton variant="primary" @click="navigate">Записаться</AppButton>
        </RouterLink>
      </template>
    </PageHero>

    <div class="container about">
      <SectionIntro title="Миссия">
        <p>{{ aboutContent.mission }}</p>
      </SectionIntro>

      <section class="values" aria-labelledby="values-title">
        <h2 id="values-title" class="text-h2">Ценности</h2>
        <ul class="values__list">
          <li v-for="(v, i) in aboutContent.values" :key="i" class="values__item">
            <h3 class="text-h3">{{ v.title }}</h3>
            <p class="text-body">{{ v.text }}</p>
          </li>
        </ul>
      </section>
    </div>

    <BottomCta
      title="Хотите познакомиться с командой?"
      description="На странице «Врачи» доступны профили специалистов и фильтр по направлениям."
    >
      <template #actions>
        <RouterLink v-slot="{ navigate }" to="/doctors" custom>
          <AppButton variant="primary" @click="navigate">Врачи</AppButton>
        </RouterLink>
        <RouterLink v-slot="{ navigate }" to="/services" custom>
          <AppButton variant="ghost" @click="navigate">Услуги</AppButton>
        </RouterLink>
      </template>
    </BottomCta>
  </main>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import BottomCta from '@/components/sections/BottomCta.vue'
import PageHero from '@/components/sections/PageHero.vue'
import SectionIntro from '@/components/sections/SectionIntro.vue'
import { bookingPath } from '@/config/nav'
import { aboutContent, img } from '@/data'
</script>

<style scoped>
.about {
  padding-block: var(--space-32);
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
}

.values .text-h2 {
  margin: 0 0 var(--space-24);
}

.values__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-24);
}

@media (min-width: 768px) {
  .values__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.values__item {
  margin: 0;
  padding: var(--space-24);
  border-radius: var(--radius-16);
  border: 1px solid var(--color-border-subtle);
  background-color: var(--color-bg-surface);
}

.values__item .text-h3 {
  margin: 0 0 var(--space-8);
}

.values__item .text-body {
  margin: 0;
  color: var(--color-text-secondary);
}
</style>
