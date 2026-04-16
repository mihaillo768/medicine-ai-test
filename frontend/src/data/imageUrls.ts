/**
 * Локальные изображения из public/images/medcenter (см. scripts/download_site_images.py).
 * Источник оригиналов — Wikimedia Commons; атрибуция: public/images/medcenter/ATTRIBUTION.txt
 */
const base = '/images/medcenter'

export const img = {
  heroClinic: `${base}/hero-clinic.jpg`,
  hall: `${base}/hall.jpg`,
  consult: `${base}/consult.jpg`,
  lab: `${base}/lab.jpg`,
  mri: `${base}/mri.png`,
  cardio: `${base}/cardio.jpg`,
  blogHeart: `${base}/blog-heart.jpg`,
  blogSleep: `${base}/blog-sleep.jpg`,
  blogCheckup: `${base}/blog-checkup.jpg`,
  doctor1: `${base}/doctor-1.jpg`,
  doctor2: `${base}/doctor-2.jpg`,
  doctor3: `${base}/doctor-3.jpg`,
  doctor4: `${base}/doctor-4.jpg`,
  doctor5: `${base}/doctor-5.jpg`,
  doctor6: `${base}/doctor-6.jpg`,
  /** Та же сцена, что hero — шапка «Услуги» */
  mastheadServices: `${base}/hero-clinic.jpg`,
  mastheadDoctors: `${base}/masthead-doctors.jpg`,
  mastheadPrices: `${base}/masthead-prices.jpg`,
  mastheadBlog: `${base}/masthead-blog.jpg`,
  notFound: `${base}/not-found.jpg`,
} as const
