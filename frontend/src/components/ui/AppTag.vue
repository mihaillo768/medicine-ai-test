<template>
  <button
    type="button"
    class="app-tag text-caption"
    :class="{ 'app-tag--selected': selected }"
    :aria-pressed="selected"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    selected?: boolean
    disabled?: boolean
  }>(),
  {
    selected: false,
    disabled: false,
  },
)
</script>

<style scoped>
.app-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: var(--space-8) var(--space-16);
  margin: 0;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-8);
  background-color: var(--color-bg-surface);
  color: var(--color-text-secondary);
  font: inherit;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.app-tag:hover:not(:disabled):not(.app-tag--selected) {
  border-color: var(--color-accent-default);
  color: var(--color-text-primary);
}

.app-tag--selected {
  border-color: var(--color-accent-default);
  background-color: var(--color-bg-muted);
  color: var(--color-accent-default);
  font-weight: 600;
}

.app-tag:focus {
  outline: none;
}

.app-tag:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.app-tag:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
