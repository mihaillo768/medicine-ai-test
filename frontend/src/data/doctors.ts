import type { DoctorItem, DoctorSpecialty } from '@/data/types'
import { img } from '@/data/imageUrls'

export const doctors: DoctorItem[] = [
  {
    slug: 'ivanova-m-s',
    name: 'Иванова Мария Сергеевна',
    role: 'Терапевт',
    specialty: 'therapy',
    shortDescription: 'Стаж 14 лет. Первичный приём, сопровождение терапии и профилактика.',
    bio: [
      'Окончила медицинский университет с отличием, регулярно проходит курсы по внутренним болезням.',
      'На приёме уделяет время объяснению назначений и согласованию плана лечения с пациентом.',
    ],
    image: img.doctor1,
    imageAlt: 'Портрет врача-терапевта в белом халате',
  },
  {
    slug: 'petrov-a-v',
    name: 'Пётров Алексей Викторович',
    role: 'Кардиолог',
    specialty: 'cardio',
    shortDescription: 'Аритмии, гипертония, дислипидемии; интерпретация ЭКГ и холтера.',
    bio: [
      'Специализируется на ведении пациентов с сердечно-сосудистыми факторами риска.',
      'Подчёркивает важность образа жизни и контроля показателей на фоне терапии.',
    ],
    image: img.doctor2,
    imageAlt: 'Портрет кардиолога',
  },
  {
    slug: 'sidorova-e-p',
    name: 'Сидорова Елена Павловна',
    role: 'Невролог',
    specialty: 'neuro',
    shortDescription: 'Головные боли, головокружения, нарушения сна, консультации по ВСД.',
    bio: [
      'Опыт работы в амбулатории и дневном стационаре; участвует в конференциях по функциональной неврологии.',
      'На приёме сочетает клинический осмотр с разъяснением прогноза и планов реабилитации.',
    ],
    image: img.doctor3,
    imageAlt: 'Портрет невролога',
  },
  {
    slug: 'kozlov-d-i',
    name: 'Козлов Дмитрий Игоревич',
    role: 'Врач УЗИ',
    specialty: 'diag',
    shortDescription: 'УЗИ брюшной полости, щитовидной железы, мягких тканей.',
    bio: [
      'Сертифицированный специалист по ультразвуковой диагностике.',
      'Внимателен к деталям протокола и корректной подготовке пациента.',
    ],
    image: img.doctor4,
    imageAlt: 'Портрет врача УЗИ-диагностики',
  },
  {
    slug: 'morozova-t-n',
    name: 'Морозова Татьяна Николаевна',
    role: 'Эндокринолог',
    specialty: 'therapy',
    shortDescription: 'Сахарный диабет, заболевания щитовидной железы, ожирение.',
    bio: [
      'Помогает выстроить наблюдение и терапию с учётом сопутствующих состояний.',
      'Объясняет цели лечения и критерии контроля на языке, понятном пациенту.',
    ],
    image: img.doctor5,
    imageAlt: 'Портрет эндокринолога',
  },
  {
    slug: 'fedorov-g-s',
    name: 'Фёдоров Георгий Сергеевич',
    role: 'Хирург',
    specialty: 'surgery',
    shortDescription: 'Консультации по плановой хирургии, сопровождение после операций амбулаторно.',
    bio: [
      'Проводит осмотр, оценивает объём вмешательства и сроки восстановления.',
      'При необходимости координирует связь со стационаром партнёров.',
    ],
    image: img.doctor6,
    imageAlt: 'Портрет хирурга',
  },
]

export const specialtyLabels: Record<DoctorSpecialty | 'all', string> = {
  all: 'Все специализации',
  therapy: 'Терапия и эндокринология',
  cardio: 'Кардиология',
  neuro: 'Неврология',
  diag: 'Диагностика',
  surgery: 'Хирургия',
}

export function getDoctorBySlug(slug: string): DoctorItem | undefined {
  return doctors.find((d) => d.slug === slug)
}

export function doctorsBySpecialty(specialty: DoctorSpecialty | 'all'): DoctorItem[] {
  if (specialty === 'all') return doctors
  return doctors.filter((d) => d.specialty === specialty)
}
