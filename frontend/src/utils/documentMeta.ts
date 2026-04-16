/** Обновление meta description (тег в index.html). */
export function setMetaDescription(content: string) {
  const el = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (el) {
    el.setAttribute('content', content)
  }
}

export function setDocumentTitle(title: string) {
  document.title = title
}

/** Укорочение текста для meta description без обрыва посередине слова по возможности. */
export function truncateMeta(text: string, maxChars = 155): string {
  const t = text.trim().replace(/\s+/g, ' ')
  if (t.length <= maxChars) return t
  const cut = t.slice(0, maxChars - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
}
