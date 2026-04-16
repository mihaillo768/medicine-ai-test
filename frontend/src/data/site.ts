/** Имя для document.title и meta (согласовано с index.html). */
export const siteBrandName = 'Медицинский центр'

/** Базовое описание сайта — для meta description по умолчанию и index.html. */
export const siteDefaultDescription =
  'Консультации взрослых пациентов, диагностика и запись к специалистам. Спокойная атмосфера и понятные рекомендации.'

/** Контакты и блоки «О центре» — согласованы с футером по телефону/почте. */
export const siteContacts = {
  phone: '+7 (800) 123-45-67',
  phoneHref: 'tel:+78001234567',
  email: 'info@example-clinic.local',
  emailHref: 'mailto:info@example-clinic.local',
  address: 'г. Москва, ул. Примерная, д. 10',
  hours: 'Ежедневно 8:00–21:00',
  /** Статичный блок карты: OpenStreetMap embed (без API-ключа). */
  mapEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=37.61%2C55.74%2C37.64%2C55.76&layer=mapnik',
  mapLinkUrl: 'https://www.openstreetmap.org/?mlat=55.75&mlon=37.62#map=15/55.75/37.62',
} as const

export const aboutContent = {
  mission:
    'Мы создаём спокойную среду для взрослых пациентов: от первичной консультации до диагностики и сопровождения терапии — с уважением к времени и прозрачностью рекомендаций.',
  values: [
    {
      title: 'Доказательный подход',
      text: 'Назначения и обследования — по показаниям, с объяснением целей и альтернатив.',
    },
    {
      title: 'Командная работа',
      text: 'Терапевты и узкие специалисты согласуют план, чтобы не дублировать назначения.',
    },
    {
      title: 'Комфорт',
      text: 'Понятная запись, ориентиры по подготовке к исследованиям и поддержка администраторов.',
    },
  ],
} as const
