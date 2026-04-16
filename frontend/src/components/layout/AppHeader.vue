<template>
  <header class="app-header">
    <div class="container app-header__bar">
      <RouterLink to="/" class="app-header__logo-link" aria-label="На главную">
        <AppLogo />
      </RouterLink>

      <nav class="app-header__nav app-header__nav--desktop" aria-label="Основное меню">
        <RouterLink
          v-for="item in primaryNav"
          :key="item.to"
          v-slot="{ isExactActive, navigate, href }"
          :to="item.to"
          custom
        >
          <a
            :href="href"
            class="app-header__link text-body"
            :class="{ 'app-header__link--active': isExactActive }"
            @click="navigate($event)"
          >
            {{ item.label }}
          </a>
        </RouterLink>
      </nav>

      <div class="app-header__actions app-header__actions--desktop">
        <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
          <AppButton variant="primary" @click="navigate">Запись</AppButton>
        </RouterLink>
      </div>

      <button
        id="mobile-menu-button"
        type="button"
        class="app-header__burger text-button"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-menu-panel"
        :aria-label="mobileOpen ? 'Закрыть меню' : 'Открыть меню'"
        @click="toggleMobile"
      >
        <span class="app-header__burger-line" aria-hidden="true" />
        <span class="app-header__burger-line" aria-hidden="true" />
        <span class="app-header__burger-line" aria-hidden="true" />
      </button>
    </div>

    <Teleport to="body">
      <div
        v-show="mobileOpen"
        id="mobile-menu-panel"
        class="app-header__mobile-root"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div class="app-header__mobile-backdrop" @click="closeMobileDismiss" />
        <div class="app-header__mobile-sheet">
          <div class="container app-header__mobile-inner">
            <div class="app-header__mobile-head">
              <p id="mobile-menu-title" class="app-header__mobile-title text-h3">Меню</p>
              <button
                type="button"
                class="app-header__mobile-close text-button"
                aria-label="Закрыть меню"
                @click="closeMobileDismiss"
              >
                <span class="app-header__mobile-close-icon" aria-hidden="true">×</span>
              </button>
            </div>
            <nav class="app-header__mobile-nav" aria-label="Мобильное меню">
              <RouterLink
                v-for="item in primaryNav"
                :key="item.to"
                v-slot="{ isExactActive, navigate, href }"
                :to="item.to"
                custom
              >
                <a
                  :href="href"
                  class="app-header__mobile-link text-h3"
                  :class="{ 'app-header__mobile-link--active': isExactActive }"
                  @click="
                    (e) => {
                      navigate(e)
                      closeMobile()
                    }
                  "
                >
                  {{ item.label }}
                </a>
              </RouterLink>
            </nav>
            <RouterLink v-slot="{ navigate }" :to="bookingPath" custom>
              <AppButton variant="primary" block @click="onBookingClick(navigate)">Запись</AppButton>
            </RouterLink>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppLogo from '@/components/ui/AppLogo.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { bookingPath, primaryNav } from '@/config/nav'

const mobileOpen = ref(false)

const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobile() {
  mobileOpen.value = false
}

/** Закрытие жестом «назад» (оверлей, ×, Esc) — возвращаем фокус на кнопку меню. */
function closeMobileDismiss() {
  closeMobile()
  requestAnimationFrame(() => {
    document.getElementById('mobile-menu-button')?.focus()
  })
}

function onBookingClick(navigate: () => void) {
  navigate()
  closeMobile()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && mobileOpen.value) {
    e.preventDefault()
    closeMobileDismiss()
  }
}

watch(mobileOpen, (open) => {
  document.body.classList.toggle('app-shell--menu-open', open)
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('app-shell--menu-open')
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border-subtle);
}

.app-header__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-24);
  min-height: 72px;
  padding-block: var(--space-12);
}

.app-header__logo-link {
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
}

.app-header__logo-link:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--radius-8);
}

.app-header__nav--desktop {
  display: none;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-8) var(--space-24);
}

.app-header__link {
  padding: var(--space-8) 0;
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color 0.15s ease;
}

.app-header__link:hover {
  color: var(--color-accent-default);
}

.app-header__link--active {
  color: var(--color-accent-default);
}

.app-header__actions--desktop {
  display: none;
  flex-shrink: 0;
}

.app-header__burger {
  display: flex;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-12);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.app-header__burger:hover {
  background-color: var(--color-bg-muted);
}

.app-header__burger:focus {
  outline: none;
}

.app-header__burger:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.app-header__burger-line {
  display: block;
  width: 20px;
  height: 2px;
  border-radius: 1px;
  background-color: currentColor;
}

.app-header__mobile-root {
  position: fixed;
  inset: 0;
  z-index: 200;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.app-header__mobile-backdrop {
  position: absolute;
  inset: 0;
  background-color: rgb(26 46 50 / 45%);
}

.app-header__mobile-sheet {
  position: absolute;
  inset: 0;
  display: flex;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  flex-direction: column;
  align-items: stretch;
  pointer-events: none;
  overflow-x: hidden;
  animation: app-header-sheet-in 0.2s ease-out;
}

.app-header__mobile-inner {
  display: flex;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: auto;
  overflow-x: hidden;
  max-height: 100%;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: var(--space-32);
  flex-direction: column;
  gap: var(--space-24);
  border-radius: 0 0 var(--radius-16) var(--radius-16);
  background-color: var(--color-bg-surface);
  /* Размытие без «разъезда» влево-вправо за край экрана */
  box-shadow: 0 var(--space-16) var(--space-24) -12px rgb(26 46 50 / 14%);
  pointer-events: auto;
}

.app-header__mobile-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-16);
  min-width: 0;
}

.app-header__mobile-title {
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--color-text-primary);
}

.app-header__mobile-close {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin: 0;
  padding: 0;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-12);
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.app-header__mobile-close:hover {
  background-color: var(--color-bg-muted);
}

.app-header__mobile-close:focus {
  outline: none;
}

.app-header__mobile-close:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.app-header__mobile-close-icon {
  display: block;
  margin-top: -2px;
}

.app-header__mobile-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.app-header__mobile-link {
  padding: var(--space-12) 0;
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 600;
  overflow-wrap: anywhere;
}

.app-header__mobile-link--active {
  color: var(--color-accent-default);
}

@keyframes app-header-sheet-in {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 1280px) {
  .app-header__nav--desktop {
    display: flex;
  }

  .app-header__actions--desktop {
    display: block;
  }

  .app-header__burger {
    display: none;
  }
}
</style>
