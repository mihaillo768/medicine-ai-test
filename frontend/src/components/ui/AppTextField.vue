<template>
  <div class="app-field">
    <label class="app-field__label text-caption" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      class="app-field__input text-body"
      :class="{ 'app-field__input--error': isInvalid }"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :inputmode="mask === 'ru-mobile' ? 'tel' : undefined"
      :maxlength="mask === 'ru-mobile' ? RU_MOBILE_MASK_MAX_LENGTH : undefined"
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
import { formatRuMobileMask, RU_MOBILE_MASK_MAX_LENGTH } from '@/utils/phoneMask'

const props = withDefaults(
  defineProps<{
    label: string
    modelValue?: string
    name?: string
    type?: string
    placeholder?: string
    disabled?: boolean
    error?: boolean
    errorMessage?: string
    /** Маска для телефона РФ: +7 (XXX) XXX-XX-XX */
    mask?: 'none' | 'ru-mobile'
  }>(),
  {
    modelValue: '',
    type: 'text',
    disabled: false,
    error: false,
    errorMessage: '',
    mask: 'none',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const baseId = useId()
const inputId = computed(() => `field-${baseId}`)
const errorId = computed(() => `field-err-${baseId}`)

const isInvalid = computed(() => props.error)

const describedBy = computed(() =>
  isInvalid.value && props.errorMessage ? errorId.value : undefined,
)

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  const v = props.mask === 'ru-mobile' ? formatRuMobileMask(el.value) : el.value
  emit('update:modelValue', v)
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

.app-field__input {
  width: 100%;
  min-height: 48px;
  margin: 0;
  padding: 12px var(--space-16);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-12);
  background-color: var(--color-bg-surface);
  color: var(--color-text-primary);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.app-field__input::placeholder {
  color: var(--color-text-secondary);
  opacity: 1;
}

.app-field__input:hover:not(:disabled) {
  border-color: var(--color-accent-default);
}

.app-field__input:focus {
  outline: none;
  border-color: var(--color-accent-default);
  box-shadow: 0 0 0 1px var(--color-accent-default);
}

.app-field__input:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
  box-shadow: none;
}

.app-field__input--error {
  border-color: var(--color-semantic-error);
}

.app-field__input--error:focus,
.app-field__input--error:focus-visible {
  border-color: var(--color-semantic-error);
  box-shadow: 0 0 0 1px var(--color-semantic-error);
  outline-color: var(--color-semantic-error);
}

.app-field__input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  background-color: var(--color-bg-muted);
}

.app-field__error {
  margin: 0;
  color: var(--color-semantic-error);
}
</style>
