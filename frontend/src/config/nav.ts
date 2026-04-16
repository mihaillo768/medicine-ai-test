/** Верхний уровень меню — этап 4 плана фронтенда; пути согласованы с маршрутизатором. */
export const primaryNav = [
  { to: '/', label: 'Главная' },
  { to: '/services', label: 'Услуги' },
  { to: '/doctors', label: 'Врачи' },
  { to: '/about', label: 'О центре' },
  { to: '/prices', label: 'Цены' },
  { to: '/contacts', label: 'Контакты' },
  { to: '/blog', label: 'Блог' },
] as const

export const bookingPath = '/contacts#booking'
