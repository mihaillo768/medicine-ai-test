/** Максимум значимых цифр в российском мобильном: код 7 + 10 цифр. */
export const RU_MOBILE_MAX_DIGITS = 11

/**
 * Длина строки при полностью заполненной маске `+7 (XXX) XXX-XX-XX`
 * (ограничивает ввод в поле вместе с maxlength).
 */
export const RU_MOBILE_MASK_MAX_LENGTH = 18

/** Только цифры из строки (для маски и валидации). */
export function extractPhoneDigits(raw: string): string {
  return raw.replace(/\D/g, '')
}

/**
 * Маска мобильного РФ: +7 (XXX) XXX-XX-XX, до 11 цифр (7 + 10).
 * Ведущая 8 заменяется на 7; если первая цифра 9 — подставляется 7.
 */
export function formatRuMobileMask(raw: string): string {
  // Не даём «раздувать» строку при вставке длинного мусора
  let d = extractPhoneDigits(raw).slice(0, RU_MOBILE_MAX_DIGITS + 4)
  if (d.length === 0) return ''

  if (d[0] === '8') d = '7' + d.slice(1)
  else if (d[0] === '9') d = '7' + d
  else if (d[0] !== '7') d = '7' + d.slice(0, 10)

  d = d.slice(0, RU_MOBILE_MAX_DIGITS)
  const n = d.slice(1)

  if (n.length === 0) return '+7 '

  let s = '+7 (' + n.slice(0, Math.min(3, n.length))
  if (n.length < 3) return s
  if (n.length === 3) return s + ') '

  s += ') ' + n.slice(3, Math.min(6, n.length))
  if (n.length <= 6) return s

  s += '-' + n.slice(6, Math.min(8, n.length))
  if (n.length <= 8) return s

  s += '-' + n.slice(8, 10)
  return s
}
