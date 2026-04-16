<template>
  <footer class="app-footer">
    <div class="container app-footer__inner">
      <div class="app-footer__brand">
        <RouterLink to="/" class="app-footer__logo-link" aria-label="На главную">
          <AppLogo :mark-size="36" />
        </RouterLink>
        <p class="app-footer__tagline text-caption">
          Взрослая медицина: консультации, диагностика и сопровождение.
        </p>
      </div>

      <nav class="app-footer__nav" aria-label="Разделы сайта">
        <RouterLink
          v-for="item in primaryNav"
          :key="item.to"
          v-slot="{ isExactActive, navigate, href }"
          :to="item.to"
          custom
        >
          <a
            :href="href"
            class="app-footer__link text-body"
            :class="{ 'app-footer__link--active': isExactActive }"
            @click="navigate($event)"
          >
            {{ item.label }}
          </a>
        </RouterLink>
      </nav>

      <div class="app-footer__contacts">
        <p class="app-footer__contacts-title text-caption">Контакты</p>
        <a class="app-footer__contact text-body" :href="siteContacts.phoneHref">{{ siteContacts.phone }}</a>
        <a class="app-footer__contact text-body" :href="siteContacts.emailHref">{{ siteContacts.email }}</a>
        <p class="app-footer__hours text-caption">{{ siteContacts.hours }}</p>
      </div>
    </div>

    <div class="app-footer__legal">
      <div class="container">
        <p class="app-footer__legal-text text-caption">
          © {{ year }} Медцентр. Информация на сайте не является публичной офертой.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import AppLogo from '@/components/ui/AppLogo.vue'
import { primaryNav } from '@/config/nav'
import { siteContacts } from '@/data/site'

const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  flex-shrink: 0;
  margin-top: auto;
  background-color: var(--color-bg-surface);
  border-top: 1px solid var(--color-border-subtle);
}

.app-footer__inner {
  display: grid;
  gap: var(--space-32);
  padding-block: var(--space-32);
}

.app-footer__brand {
  display: flex;
  max-width: 20rem;
  flex-direction: column;
  gap: var(--space-12);
}

.app-footer__logo-link {
  align-self: flex-start;
  text-decoration: none;
  color: inherit;
}

.app-footer__logo-link:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--radius-8);
}

.app-footer__tagline {
  margin: 0;
}

.app-footer__nav {
  display: grid;
  gap: var(--space-12);
}

.app-footer__link {
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color 0.15s ease;
}

.app-footer__link:hover {
  color: var(--color-accent-default);
}

.app-footer__link--active {
  color: var(--color-accent-default);
}

.app-footer__contacts {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.app-footer__contacts-title {
  margin: 0 0 var(--space-4);
  font-weight: 600;
  color: var(--color-text-primary);
}

.app-footer__contact {
  text-decoration: none;
  color: var(--color-accent-default);
}

.app-footer__contact:hover {
  color: var(--color-accent-hover);
}

.app-footer__hours {
  margin: var(--space-8) 0 0;
}

.app-footer__legal {
  padding-block: var(--space-16);
  background-color: var(--color-bg-muted);
  border-top: 1px solid var(--color-border-subtle);
}

.app-footer__legal-text {
  margin: 0;
  text-align: center;
}

@media (min-width: 768px) {
  .app-footer__inner {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }

  .app-footer__nav {
    gap: var(--space-8);
  }
}
</style>
