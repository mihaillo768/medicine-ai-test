import { createRouter, createWebHistory } from 'vue-router'

import AboutView from '@/views/AboutView.vue'
import ArticleView from '@/views/ArticleView.vue'
import BlogView from '@/views/BlogView.vue'
import ContactsView from '@/views/ContactsView.vue'
import DoctorDetailView from '@/views/DoctorDetailView.vue'
import DoctorsView from '@/views/DoctorsView.vue'
import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import PricesView from '@/views/PricesView.vue'
import ServiceDetailView from '@/views/ServiceDetailView.vue'
import ServicesView from '@/views/ServicesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Главная',
        description:
          'Медицинский центр для взрослых: консультации, диагностика, запись к врачам и спокойная атмосфера.',
      },
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesView,
      meta: {
        title: 'Услуги',
        description:
          'Каталог медицинских услуг: терапия, кардиология, диагностика и другие направления для взрослых пациентов.',
      },
    },
    {
      path: '/services/:slug',
      name: 'service-detail',
      component: ServiceDetailView,
      meta: {
        title: 'Услуга',
        description:
          'Описание медицинской услуги: показания, как проходит приём и запись на консультацию.',
      },
    },
    {
      path: '/doctors',
      name: 'doctors',
      component: DoctorsView,
      meta: {
        title: 'Врачи',
        description:
          'Врачи медицинского центра: терапевты и узкие специалисты. Фильтр по профилю и запись на приём.',
      },
    },
    {
      path: '/doctors/:slug',
      name: 'doctor-detail',
      component: DoctorDetailView,
      meta: {
        title: 'Врач',
        description: 'Профиль врача: специализация, опыт и запись на консультацию.',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: {
        title: 'О центре',
        description:
          'Миссия и ценности медицинского центра: доказательный подход, командная работа и комфорт пациентов.',
      },
    },
    {
      path: '/prices',
      name: 'prices',
      component: PricesView,
      meta: {
        title: 'Цены',
        description:
          'Прайс на консультации и исследования. Актуальные цены и условия — уточняйте у администратора.',
      },
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactsView,
      meta: {
        title: 'Контакты',
        description:
          'Адрес, телефон, e-mail и часы работы медицинского центра. Карта проезда и заявка на запись.',
      },
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
      meta: {
        title: 'Блог',
        description:
          'Статьи о здоровье и профилактике для взрослых пациентов: понятные материалы от специалистов центра.',
      },
    },
    {
      path: '/blog/:slug',
      name: 'article',
      component: ArticleView,
      meta: {
        title: 'Статья',
        description: 'Материалы блога медицинского центра: рекомендации и ответы на частые вопросы.',
      },
    },
    {
      path: '/404',
      name: 'not-found-explicit',
      component: NotFoundView,
      meta: {
        title: 'Страница не найдена',
        description: 'Запрашиваемая страница не существует. Перейдите на главную или в каталог услуг.',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: 'Страница не найдена',
        description: 'Запрашиваемая страница не существует. Перейдите на главную или в каталог услуг.',
      },
    },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
