export type DoctorSpecialty = 'therapy' | 'cardio' | 'neuro' | 'diag' | 'surgery'

export interface ServiceItem {
  slug: string
  title: string
  shortDescription: string
  image: string
  imageAlt: string
  intro: string
  sections: { heading: string; body: string }[]
  relatedSlugs: string[]
}

export interface DoctorItem {
  slug: string
  name: string
  role: string
  specialty: DoctorSpecialty
  shortDescription: string
  bio: string[]
  image: string
  imageAlt: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  coverImage: string
  coverAlt: string
  author: string
  readTime: string
  sections: { type: 'p' | 'h2' | 'h3' | 'ul'; content: string | string[] }[]
}

export interface PriceCategory {
  title: string
  items: { name: string; price: string; note?: string }[]
}
