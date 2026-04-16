<template>
  <main class="page">
    <div class="container page__inner">
      <PageMastheadWithMedia
        title="Врачи"
        :lead="
          'Команда амбулаторного центра. Используйте фильтр по направлению или выберите врача из списка.'
        "
        :image="img.mastheadDoctors"
        image-alt="Врачи на совещании в клинике"
      />

      <div class="filters" role="group" aria-label="Фильтр по специализации">
        <AppTag
          v-for="opt in filterOptions"
          :key="opt.key"
          :selected="specialty === opt.key"
          @click="specialty = opt.key"
        >
          {{ opt.label }}
        </AppTag>
      </div>

      <div class="doctors-grid">
        <CardDoctor
          v-for="d in filtered"
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
              <AppButton variant="primary" @click="navigate">Подробнее</AppButton>
            </RouterLink>
          </template>
        </CardDoctor>
      </div>
    </div>

    <BottomCta
      title="Подобрать врача по жалобам"
      description="Если не уверены в специализации — начните с терапевта, он направит дальше."
    >
      <template #actions>
        <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
          <AppButton variant="primary" @click="navigate">Записаться</AppButton>
        </RouterLink>
        <RouterLink v-slot="{ navigate }" to="/services" custom>
          <AppButton variant="ghost" @click="navigate">Услуги</AppButton>
        </RouterLink>
      </template>
    </BottomCta>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTag from '@/components/ui/AppTag.vue'
import CardDoctor from '@/components/ui/CardDoctor.vue'
import BottomCta from '@/components/sections/BottomCta.vue'
import PageMastheadWithMedia from '@/components/sections/PageMastheadWithMedia.vue'
import { bookingPath } from '@/config/nav'
import { doctorsBySpecialty, img, specialtyLabels } from '@/data'
import type { DoctorSpecialty } from '@/data/types'

const specialty = ref<DoctorSpecialty | 'all'>('all')

const filterOptions = computed(() => {
  const keys: (DoctorSpecialty | 'all')[] = [
    'all',
    'therapy',
    'cardio',
    'neuro',
    'diag',
    'surgery',
  ]
  return keys.map((key) => ({ key, label: specialtyLabels[key] }))
})

const filtered = computed(() => doctorsBySpecialty(specialty.value))
</script>

<style scoped>
.page__inner {
  padding-block: var(--space-32);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
  margin-bottom: var(--space-24);
}

.doctors-grid {
  display: grid;
  gap: var(--space-24);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .doctors-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .doctors-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
