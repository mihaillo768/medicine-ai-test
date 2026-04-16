<template>
  <div class="home">
    <PageHero
      title="Медицинский центр для взрослых пациентов"
      subtitle="Консультации, диагностика и сопровождение терапии — в спокойной атмосфере и с понятными шагами."
      eyebrow="Добро пожаловать"
      :image="img.heroClinic"
      image-alt="Светлый интерьер клиники с зоной ожидания"
    >
      <template #actions>
        <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
          <AppButton variant="primary" @click="navigate">Записаться</AppButton>
        </RouterLink>
        <RouterLink v-slot="{ navigate }" to="/services" custom>
          <AppButton variant="secondary" @click="navigate">Услуги</AppButton>
        </RouterLink>
      </template>
    </PageHero>

    <div class="container home__section">
      <section class="trust" aria-labelledby="trust-title">
        <h2 id="trust-title" class="visually-hidden">Почему нам доверяют</h2>
        <ul class="trust__list">
          <li class="trust__item">
            <p class="trust__value text-h2">15+</p>
            <p class="trust__label text-body">лет амбулаторной практики</p>
          </li>
          <li class="trust__item">
            <p class="trust__value text-h2">40+</p>
            <p class="trust__label text-body">специалистов очного приёма</p>
          </li>
          <li class="trust__item">
            <p class="trust__value text-h2">8:00–21:00</p>
            <p class="trust__label text-body">ежедневная запись без выходных</p>
          </li>
        </ul>
      </section>

      <SectionIntro title="Комплексный подход">
        <p>
          Мы начинаем с терапевтической оценки и при необходимости подключаем кардиолога, невролога и
          диагностику — без лишних назначений.
        </p>
      </SectionIntro>

      <section class="preview" aria-labelledby="preview-services">
        <SectionHeading
          heading-id="preview-services"
          title="Популярные услуги"
          description="Направления, к которым чаще всего обращаются пациенты после первичного приёма."
        />
        <div class="preview__grid preview__grid--services">
          <CardService
            v-for="s in previewServices"
            :key="s.slug"
            :title="s.title"
            :description="s.shortDescription"
          >
            <template #media>
              <img :src="s.image" :alt="s.imageAlt" loading="lazy" />
            </template>
            <template #actions>
              <RouterLink v-slot="{ navigate }" :to="`/services/${s.slug}`" custom>
                <AppButton variant="secondary" @click="navigate">Подробнее</AppButton>
              </RouterLink>
            </template>
          </CardService>
        </div>
        <div class="preview__more">
          <RouterLink v-slot="{ navigate }" to="/services" custom>
            <AppButton variant="ghost" @click="navigate">Все услуги</AppButton>
          </RouterLink>
        </div>
      </section>

      <section class="preview" aria-labelledby="preview-doctors">
        <SectionHeading
          heading-id="preview-doctors"
          title="Врачи"
          description="Знакомство с частью команды — полный список и фильтры на странице «Врачи»."
        />
        <div class="preview__grid preview__grid--doctors">
          <CardDoctor
            v-for="d in previewDoctors"
            :key="d.slug"
            :title="d.name"
            :role="d.role"
            :description="d.shortDescription"
          >
            <template #media>
              <img :src="d.image" :alt="d.imageAlt" loading="lazy" />
            </template>
            <template #actions>
              <RouterLink v-slot="{ navigate }" :to="`/doctors/${d.slug}`" custom>
                <AppButton variant="primary" @click="navigate">Записаться</AppButton>
              </RouterLink>
            </template>
          </CardDoctor>
        </div>
        <div class="preview__more">
          <RouterLink v-slot="{ navigate }" to="/doctors" custom>
            <AppButton variant="ghost" @click="navigate">Все врачи</AppButton>
          </RouterLink>
        </div>
      </section>

      <section class="home-booking" aria-labelledby="home-booking-title">
        <h2 id="home-booking-title" class="visually-hidden">Запись</h2>
        <BookingBlock
          anchor-id="home-booking"
          title="Запись на приём"
          description="Оставьте контакты — перезвоним и согласуем время. Или перейдите в раздел контактов для карты и часов работы."
        />
      </section>
    </div>

    <BottomCta
      title="Нужна консультация?"
      description="Выберите услугу или позвоните по телефону — администратор подскажет ближайшие окна."
    >
      <template #actions>
        <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
          <AppButton variant="primary" @click="navigate">Записаться</AppButton>
        </RouterLink>
        <RouterLink v-slot="{ navigate }" to="/contacts" custom>
          <AppButton variant="ghost" @click="navigate">Контакты</AppButton>
        </RouterLink>
      </template>
    </BottomCta>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import CardDoctor from '@/components/ui/CardDoctor.vue'
import CardService from '@/components/ui/CardService.vue'
import BookingBlock from '@/components/sections/BookingBlock.vue'
import BottomCta from '@/components/sections/BottomCta.vue'
import PageHero from '@/components/sections/PageHero.vue'
import SectionHeading from '@/components/sections/SectionHeading.vue'
import SectionIntro from '@/components/sections/SectionIntro.vue'
import { bookingPath } from '@/config/nav'
import { doctors, img, services } from '@/data'

const previewServices = services.slice(0, 3)
const previewDoctors = doctors.slice(0, 3)
</script>

<style scoped>
.home__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
  padding-bottom: var(--space-32);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.trust__list {
  display: grid;
  gap: var(--space-24);
  margin: 0;
  padding: var(--space-24);
  list-style: none;
  border-radius: var(--radius-16);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
}

@media (min-width: 768px) {
  .trust__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-32);
  }
}

.trust__item {
  margin: 0;
  text-align: center;
}

.trust__value {
  margin: 0 0 var(--space-8);
  color: var(--color-accent-default);
}

.trust__label {
  margin: 0;
  color: var(--color-text-secondary);
}

.preview__grid {
  display: grid;
  gap: var(--space-24);
  margin-top: var(--space-24);
}

.preview__grid--services {
  grid-template-columns: 1fr;
}

.preview__grid--doctors {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .preview__grid--services {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .preview__grid--doctors {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .preview__grid--doctors {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.preview__more {
  margin-top: var(--space-24);
  display: flex;
  justify-content: center;
}

.home-booking {
  margin-top: var(--space-8);
}
</style>
