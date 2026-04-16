<template>
  <main class="page">
    <div class="container page__inner">
      <header class="page__masthead">
        <h1 class="page__title text-h1">Контакты</h1>
        <p class="page__lead text-body">
          Как нас найти, связаться по телефону или почте и оставить заявку на запись.
        </p>
      </header>

      <div class="contacts">
        <section class="contacts__block" aria-labelledby="contacts-info">
          <h2 id="contacts-info" class="text-h3">Режим и адрес</h2>
          <ul class="contacts__list text-body">
            <li>
              <span class="contacts__label text-caption">Адрес</span>
              <span>{{ siteContacts.address }}</span>
            </li>
            <li>
              <span class="contacts__label text-caption">Телефон</span>
              <a :href="siteContacts.phoneHref">{{ siteContacts.phone }}</a>
            </li>
            <li>
              <span class="contacts__label text-caption">E-mail</span>
              <a :href="siteContacts.emailHref">{{ siteContacts.email }}</a>
            </li>
            <li>
              <span class="contacts__label text-caption">Часы работы</span>
              <span>{{ siteContacts.hours }}</span>
            </li>
          </ul>
        </section>

        <section class="contacts__map" aria-label="Карта проезда">
          <iframe
            class="contacts__iframe"
            title="Карта — медицинский центр"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            :src="siteContacts.mapEmbedUrl"
          />
          <a
            class="contacts__map-link text-caption"
            :href="siteContacts.mapLinkUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть карту в новой вкладке
          </a>
        </section>
      </div>

      <BookingBlock
        anchor-id="booking"
        title="Запись на приём"
        description="Оставьте телефон — перезвоним в рабочие часы и предложим ближайшие окна."
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import BookingBlock from '@/components/sections/BookingBlock.vue'
import { siteContacts } from '@/data'
</script>

<style scoped>
.page__inner {
  padding-block: var(--space-32);
  display: flex;
  flex-direction: column;
  gap: var(--space-32);
}

.page__masthead {
  margin-bottom: 0;
}

.page__title {
  margin: 0 0 var(--space-12);
}

.page__lead {
  margin: 0;
  max-width: 42rem;
  color: var(--color-text-secondary);
}

.contacts {
  display: grid;
  gap: var(--space-24);
}

@media (min-width: 960px) {
  .contacts {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    align-items: start;
  }
}

.contacts__block {
  padding: var(--space-24);
  border-radius: var(--radius-16);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
}

.contacts__block .text-h3 {
  margin: 0 0 var(--space-16);
}

.contacts__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.contacts__list li {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.contacts__label {
  color: var(--color-text-secondary);
}

.contacts__list a {
  color: var(--color-accent-default);
  text-decoration: none;
}

.contacts__list a:hover {
  color: var(--color-accent-hover);
}

.contacts__map {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.contacts__iframe {
  width: 100%;
  min-height: 280px;
  border: 0;
  border-radius: var(--radius-16);
  background-color: var(--color-bg-muted);
}

.contacts__map-link {
  color: var(--color-accent-default);
}
</style>
