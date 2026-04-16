<template>
  <main class="page">
    <div class="container page__inner">
      <PageMastheadWithMedia
        title="Блог"
        :lead="
          'Короткие материалы о здоровье, подготовке к приёмам и навигации по обследованиям.'
        "
        :image="img.mastheadBlog"
        image-alt="Книги и материалы для чтения о здоровье"
      />

      <ul class="blog-list">
        <li v-for="post in blogPosts" :key="post.slug" class="blog-card">
          <RouterLink :to="`/blog/${post.slug}`" class="blog-card__link">
            <div class="blog-card__media">
              <img :src="post.coverImage" :alt="post.coverAlt" loading="lazy" />
            </div>
            <div class="blog-card__body">
              <p class="blog-card__meta text-caption">
                <time :datetime="post.date">{{ formatDate(post.date) }}</time>
              </p>
              <h2 class="blog-card__title text-h3">{{ post.title }}</h2>
              <p class="blog-card__excerpt text-body">{{ post.excerpt }}</p>
              <span class="blog-card__cta text-button">Читать</span>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>

    <BottomCta
      title="Есть вопрос по здоровью?"
      description="Индивидуальные рекомендации — только на очной консультации."
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
import { img } from '@/data'
import { blogPosts } from '@/data'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
</script>

<style scoped>
.page__inner {
  padding-block: var(--space-32);
}

.blog-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.blog-card {
  margin: 0;
}

.blog-card__link {
  display: grid;
  gap: var(--space-24);
  overflow: hidden;
  border-radius: var(--radius-16);
  border: 1px solid var(--color-border-subtle);
  background-color: var(--color-bg-surface);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

@media (min-width: 768px) {
  .blog-card__link {
    grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
  }
}

.blog-card__link:hover {
  border-color: var(--color-accent-default);
  box-shadow: 0 var(--space-8) var(--space-24) rgb(26 46 50 / 8%);
}

.blog-card__link:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.blog-card__media {
  aspect-ratio: 16 / 10;
  background-color: var(--color-bg-muted);
}

.blog-card__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding: var(--space-24);
}

.blog-card__meta {
  margin: 0;
  color: var(--color-text-secondary);
}

.blog-card__title {
  margin: 0;
}

.blog-card__excerpt {
  margin: 0;
  flex: 1;
  color: var(--color-text-secondary);
}

.blog-card__cta {
  margin-top: var(--space-8);
  color: var(--color-accent-default);
}
</style>
