<template>
  <button
    :type="nativeType"
    class="app-button text-button"
    :class="[`app-button--${variant}`, { 'app-button--block': block }]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    disabled?: boolean
    block?: boolean
    /** HTML type кнопки (для форм — submit) */
    nativeType?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    disabled: false,
    block: false,
    nativeType: 'button',
  },
)
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  min-height: 44px;
  padding: 10px var(--space-24);
  margin: 0;
  border: 1px solid transparent;
  border-radius: var(--radius-12);
  font: inherit;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;
}

.app-button--block {
  width: 100%;
}

.app-button--primary {
  background-color: var(--color-accent-default);
  border-color: var(--color-accent-default);
  color: var(--color-text-on-accent);
}

.app-button--primary:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}

.app-button--secondary {
  background-color: var(--color-bg-surface);
  border-color: var(--color-border-subtle);
  color: var(--color-text-primary);
}

.app-button--secondary:hover:not(:disabled) {
  background-color: var(--color-bg-control-hover);
  border-color: var(--color-border-subtle);
}

.app-button--ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-accent-default);
}

.app-button--ghost:hover:not(:disabled) {
  background-color: var(--color-bg-muted);
  color: var(--color-accent-hover);
}

.app-button:focus {
  outline: none;
}

.app-button:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.app-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
