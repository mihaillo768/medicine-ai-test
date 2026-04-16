<template>
  <main v-if="doctor" class="page">
    <div class="container detail">
      <div class="detail__layout">
        <div class="detail__portrait">
          <img
            class="detail__img"
            :src="doctor.image"
            :alt="doctor.imageAlt"
            loading="eager"
            width="640"
            height="853"
          />
        </div>
        <div>
          <p class="detail__role text-caption">{{ doctor.role }}</p>
          <h1 class="detail__name text-h1">{{ doctor.name }}</h1>
          <div class="detail__bio">
            <p v-for="(p, i) in doctor.bio" :key="i" class="text-body">{{ p }}</p>
          </div>
          <div class="detail__cta">
            <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
              <AppButton variant="primary" @click="navigate">Записаться к врачу</AppButton>
            </RouterLink>
            <RouterLink v-slot="{ navigate }" to="/doctors" custom>
              <AppButton variant="ghost" @click="navigate">Все врачи</AppButton>
            </RouterLink>
          </div>
        </div>
      </div>

      <BookingBlock
        class="detail__booking"
        title="Запись"
        :description="`Заявка на приём к ${doctor.name.split(' ')[0]}`"
      />

      <section v-if="others.length" class="detail__others" aria-labelledby="others-title">
        <h2 id="others-title" class="text-h2">Другие врачи</h2>
        <div class="detail__cards">
          <CardDoctor
            v-for="d in others"
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
                <AppButton variant="secondary" @click="navigate">Профиль</AppButton>
              </RouterLink>
            </template>
          </CardDoctor>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import CardDoctor from '@/components/ui/CardDoctor.vue'
import BookingBlock from '@/components/sections/BookingBlock.vue'
import { bookingPath } from '@/config/nav'
import { doctors, getDoctorBySlug } from '@/data'

const route = useRoute()
const router = useRouter()

const doctor = computed(() => getDoctorBySlug(route.params.slug as string))

const others = computed(() => {
  const d = doctor.value
  if (!d) return []
  return doctors.filter((x) => x.slug !== d.slug).slice(0, 3)
})

function ensureFound() {
  if (!getDoctorBySlug(route.params.slug as string)) {
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

.detail__layout {
  display: grid;
  gap: var(--space-32);
  align-items: start;
}

@media (min-width: 768px) {
  .detail__layout {
    grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  }
}

.detail__portrait {
  border-radius: var(--radius-16);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  background-color: var(--color-bg-muted);
}

.detail__img {
  display: block;
  width: 100%;
  height: auto;
  vertical-align: middle;
}

.detail__role {
  margin: 0 0 var(--space-8);
  color: var(--color-accent-default);
}

.detail__name {
  margin: 0 0 var(--space-16);
}

.detail__bio {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.detail__bio .text-body {
  margin: 0;
  color: var(--color-text-secondary);
}

.detail__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  margin-top: var(--space-24);
}

.detail__others .text-h2 {
  margin: 0 0 var(--space-24);
}

.detail__cards {
  display: grid;
  gap: var(--space-24);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .detail__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
