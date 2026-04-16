<template>
  <div class="app-field">
    <label class="app-field__label text-caption" :for="textareaId">{{ label }}</label>
    <textarea
      :id="textareaId"
      class="app-field__textarea text-body"
      :class="{ 'app-field__textarea--error': isInvalid }"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="isInvalid ? 'true' : undefined"
      :aria-describedby="describedBy"
      :value="modelValue"
      @input="onInput"
    />
    <p
      v-if="isInvalid && errorMessage"
      :id="errorId"
      class="app-field__error text-caption"
      role="alert"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    modelValue?: string
    name?: string
    rows?: number
    placeholder?: string
    disabled?: boolean
    error?: boolean
    errorMessage?: string
  }>(),
  {
    modelValue: '',
    rows: 4,
    disabled: false,
    error: false,
    errorMessage: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const baseId = useId()
const textareaId = computed(() => `textarea-${baseId}`)
const errorId = computed(() => `textarea-err-${baseId}`)

const isInvalid = computed(() => props.error)

const describedBy = computed(() =>
  isInvalid.value && props.errorMessage ? errorId.value : undefined,
)

function onInput(e: Event) {
  const el = e.target as HTMLTextAreaElement
  emit('update:modelValue', el.value)
}
</script>

<style scoped>
.app-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  width: 100%;
}

.app-field__label {
  color: var(--color-text-secondary);
}

.app-field__textarea {
  width: 100%;
  margin: 0;
  padding: 12px var(--space-16);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-12);
  background-color: var(--color-bg-surface);
  color: var(--color-text-primary);
  resize: vertical;
  min-height: 6rem;
  font: inherit;
  line-height: 24px;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.app-field__textarea::placeholder {
  color: var(--color-text-secondary);
  opacity: 1;
}

.app-field__textarea:hover:not(:disabled) {
  border-color: var(--color-accent-default);
}

.app-field__textarea:focus {
  outline: none;
  border-color: var(--color-accent-default);
  box-shadow: 0 0 0 1px var(--color-accent-default);
}

.app-field__textarea:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  box-shadow: none;
}

.app-field__textarea--error {
  border-color: var(--color-semantic-error);
}

.app-field__textarea--error:focus,
.app-field__textarea--error:focus-visible {
  border-color: var(--color-semantic-error);
  box-shadow: 0 0 0 1px var(--color-semantic-error);
  outline-color: var(--color-semantic-error);
}

.app-field__textarea:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background-color: var(--color-bg-muted);
}

.app-field__error {
  margin: 0;
  color: var(--color-semantic-error);
}
</style>
