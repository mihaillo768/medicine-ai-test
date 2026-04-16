<template>
  <section :id="anchorId" class="booking-block" :aria-labelledby="titleId">
    <div class="booking-block__inner">
      <h2 :id="titleId" class="booking-block__title text-h2">{{ title }}</h2>
      <p v-if="description" class="booking-block__lead text-body">{{ description }}</p>
      <form class="booking-block__form" @submit.prevent="onSubmit" novalidate>
        <AppTextField
          v-model="name"
          label="Имя"
          name="booking-name"
          placeholder="Как к вам обращаться"
          autocomplete="name"
          :error="!!errName"
          :error-message="errName"
        />
        <AppTextField
          v-model="phone"
          label="Телефон"
          name="booking-phone"
          type="tel"
          mask="ru-mobile"
          placeholder="+7 (900) 123-45-67"
          autocomplete="tel"
          :error="!!errPhone"
          :error-message="errPhone"
        />
        <AppTextarea
          v-model="comment"
          label="Комментарий"
          name="booking-comment"
          :rows="4"
          placeholder="Удобное время или вопрос администратору"
          :error="!!errComment"
          :error-message="errComment"
        />
        <p v-if="sent" class="booking-block__notice text-caption" role="status">
          Заявка принята. Администратор свяжется с вами в ближайшее время.
        </p>
        <div class="booking-block__actions">
          <AppButton native-type="submit" variant="primary" :disabled="submitting">
            {{ submitting ? 'Отправка…' : 'Отправить' }}
          </AppButton>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, useId, watch } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppTextField from '@/components/ui/AppTextField.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import { validateBookingFields } from '@/utils/bookingForm'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    /** Для ссылки /contacts#booking */
    anchorId?: string
  }>(),
  {
    title: 'Запись на приём',
    description: 'Оставьте контакты — администратор перезвонит и предложит ближайшие окна.',
    anchorId: 'booking',
  },
)

const base = useId()
const titleId = `booking-title-${base}`

const name = ref('')
const phone = ref('')
const comment = ref('')
const errName = ref('')
const errPhone = ref('')
const errComment = ref('')
const sent = ref(false)
const submitting = ref(false)

watch(name, () => {
  errName.value = ''
})
watch(phone, () => {
  errPhone.value = ''
})
watch(comment, () => {
  errComment.value = ''
})
watch([name, phone, comment], () => {
  sent.value = false
})

async function onSubmit() {
  const errors = validateBookingFields({
    name: name.value,
    phone: phone.value,
    comment: comment.value,
  })
  errName.value = errors?.name ?? ''
  errPhone.value = errors?.phone ?? ''
  errComment.value = errors?.comment ?? ''
  if (errors) return

  submitting.value = true
  await new Promise((r) => setTimeout(r, 120))
  // eslint-disable-next-line no-console
  console.log('[booking]', {
    name: name.value.trim(),
    phone: phone.value,
    comment: comment.value.trim(),
  })
  sent.value = true
  submitting.value = false
}
</script>

<style scoped>
.booking-block {
  padding: var(--space-32);
  border-radius: var(--radius-16);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
}

.booking-block__inner {
  max-width: 32rem;
}

.booking-block__title {
  margin: 0 0 var(--space-8);
}

.booking-block__lead {
  margin: 0 0 var(--space-24);
  color: var(--color-text-secondary);
}

.booking-block__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.booking-block__notice {
  margin: 0;
  color: var(--color-accent-default);
}

.booking-block__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-12);
}
</style>
