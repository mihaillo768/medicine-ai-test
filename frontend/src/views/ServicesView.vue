<template>
  <main class="page">
    <div class="container page__inner">
      <PageMastheadWithMedia
        title="Услуги"
        :lead="
          'Направления клиники для взрослых пациентов: от первичного приёма до диагностики и консультаций узких специалистов.'
        "
        :image="img.mastheadServices"
        image-alt="Современный интерьер медицинского центра"
      />

      <SectionIntro title="Как мы работаем">
        <p>
          Начните с терапевта или выберите профиль, если направление уже известно. Администратор
          поможет с подготовкой к исследованиям.
        </p>
      </SectionIntro>

      <div class="services-grid">
        <CardService
          v-for="s in services"
          :key="s.slug"
          :title="s.title"
          :description="s.shortDescription"
        >
          <template #media>
            <img :src="s.image" :alt="s.imageAlt" loading="lazy" />
          </template>
          <template #actions>
            <RouterLink v-slot="{ navigate }" :to="`/services/${s.slug}`" custom>
              <AppButton variant="primary" @click="navigate">Подробнее</AppButton>
            </RouterLink>
          </template>
        </CardService>
      </div>
    </div>

    <BottomCta
      title="Не нашли нужную услугу?"
      description="Позвоните — подскажем, к какому специалисту записаться в первую очередь."
    >
      <template #actions>
        <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
          <AppButton variant="primary" @click="navigate">Записаться</AppButton>
        </RouterLink>
        <RouterLink v-slot="{ navigate }" to="/contacts" custom>
          <AppButton variant="secondary" @click="navigate">Контакты</AppButton>
        </RouterLink>
      </template>
    </BottomCta>
  </main>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import CardService from '@/components/ui/CardService.vue'
import BottomCta from '@/components/sections/BottomCta.vue'
import PageMastheadWithMedia from '@/components/sections/PageMastheadWithMedia.vue'
import SectionIntro from '@/components/sections/SectionIntro.vue'
import { bookingPath } from '@/config/nav'
import { img, services } from '@/data'
</script>

<style scoped>
.page__inner {
  padding-block: var(--space-32);
}

.services-grid {
  display: grid;
  gap: var(--space-24);
  margin-top: var(--space-32);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .services-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
