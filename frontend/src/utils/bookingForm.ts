/**
 * Валидация формы записи (прототип без backend).
 * Телефон: демо-правило для мобильного РФ — 10 цифр (9…)
 * или 11 цифр с ведущей 7/8; иное — сообщение об ошибке.
 * При появлении точных правил в ТЗ — скорректировать здесь.
 */

import { extractPhoneDigits, RU_MOBILE_MAX_DIGITS } from '@/utils/phoneMask'

export const BOOKING_NAME_MAX = 120
export const BOOKING_COMMENT_MAX = 2000

export function validateBookingName(raw: string): string | undefined {
  const t = raw.trim()
  if (!t) return 'Укажите имя'
  if (t.length < 2) return 'Минимум 2 символа'
  if (t.length > BOOKING_NAME_MAX) return `Не более ${BOOKING_NAME_MAX} символов`
  return undefined
}

/**
 * Мобильный номер РФ: после нормализации — 11 цифр, начинается с 7 и вторая 9.
 */
export function validateRussianMobileDigits(digits: string): string | undefined {
  if (!digits) return 'Укажите телефон'
  let d = digits
  if (d.length === 11 && d[0] === '8') {
    d = '7' + d.slice(1)
  }
  if (d.length === 10 && d[0] === '9') {
    d = '7' + d
  }
  if (d.length === RU_MOBILE_MAX_DIGITS && d[0] === '7' && d[1] === '9') {
    return undefined
  }
  return 'Введите номер мобильного телефона (например +7 (900) 123-45-67)'
}

export function validateBookingComment(raw: string): string | undefined {
  if (raw.length > BOOKING_COMMENT_MAX) {
    return `Не более ${BOOKING_COMMENT_MAX} символов`
  }
  return undefined
}

export type BookingFieldErrors = {
  name?: string
  phone?: string
  comment?: string
}

export function validateBookingFields(input: {
  name: string
  phone: string
  comment: string
}): BookingFieldErrors | undefined {
  const name = validateBookingName(input.name)
  const phone = validateRussianMobileDigits(extractPhoneDigits(input.phone))
  const comment = validateBookingComment(input.comment)
  if (!name && !phone && !comment) return undefined
  return { name, phone, comment }
}
