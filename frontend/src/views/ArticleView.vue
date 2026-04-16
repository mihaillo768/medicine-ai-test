<template>
  <main v-if="post" class="page">
    <article class="article">
      <header class="article__hero container">
        <p class="article__meta text-caption">
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          · {{ post.readTime }} · {{ post.author }}
        </p>
        <h1 class="article__title text-h1">{{ post.title }}</h1>
        <p class="article__excerpt text-body">{{ post.excerpt }}</p>
      </header>

      <div class="article__cover-wrap">
        <img
          class="article__cover"
          :src="post.coverImage"
          :alt="post.coverAlt"
          loading="eager"
          decoding="async"
        />
      </div>

      <div class="container article__body prose">
        <template v-for="(block, i) in post.sections" :key="i">
          <p v-if="block.type === 'p'" class="text-body">{{ block.content }}</p>
          <h2 v-else-if="block.type === 'h2'" class="text-h2">{{ block.content }}</h2>
          <h3 v-else-if="block.type === 'h3'" class="text-h3">{{ block.content }}</h3>
          <ul
            v-else-if="block.type === 'ul'"
            class="article__ul text-body"
          >
            <li v-for="(li, j) in block.content" :key="j">{{ li }}</li>
          </ul>
        </template>
      </div>

      <footer class="container article__footer">
        <RouterLink v-slot="{ navigate }" to="/blog" custom>
          <AppButton variant="secondary" @click="navigate">Все статьи</AppButton>
        </RouterLink>
        <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
          <AppButton variant="primary" @click="navigate">Записаться</AppButton>
        </RouterLink>
      </footer>
    </article>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import { bookingPath } from '@/config/nav'
import { getPostBySlug } from '@/data'

const route = useRoute()
const router = useRouter()

const post = computed(() => getPostBySlug(route.params.slug as string))

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

function ensureFound() {
  if (!getPostBySlug(route.params.slug as string)) {
    router.replace({ name: 'not-found-explicit' })
  }
}

onBeforeMount(ensureFound)
watch(() => route.params.slug, ensureFound)
</script>

<style scoped>
.article__hero {
  padding-block: var(--space-32) var(--space-24);
}

.article__meta {
  margin: 0 0 var(--space-12);
  color: var(--color-text-secondary);
}

.article__title {
  margin: 0 0 var(--space-16);
}

.article__excerpt {
  margin: 0;
  max-width: 42rem;
  color: var(--color-text-secondary);
}

.article__cover-wrap {
  margin-inline: calc(-1 * var(--container-padding-x));
  margin-bottom: var(--space-32);
  background-color: var(--color-bg-muted);
}

.article__cover {
  display: block;
  width: 100%;
  max-height: 420px;
  object-fit: cover;
}

.article__body {
  padding-bottom: var(--space-32);
  max-width: 42rem;
}

.article__body .text-body,
.article__body .text-h2,
.article__body .text-h3 {
  margin: 0 0 var(--space-16);
}

.article__body .text-h2 {
  margin-top: var(--space-32);
}

.article__body .text-h3 {
  margin-top: var(--space-24);
}

.article__ul {
  margin: 0 0 var(--space-16);
  padding-left: 1.25rem;
}

.article__footer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
  padding-bottom: var(--space-32);
  border-top: 1px solid var(--color-border-subtle);
  padding-top: var(--space-24);
}
</style>
