import { createApp } from 'vue'

import App from './App.vue'
import { getDoctorBySlug, getPostBySlug, getServiceBySlug } from './data'
import { siteBrandName, siteDefaultDescription } from './data/site'
import router from './router'
import './styles/main.css'
import { setDocumentTitle, setMetaDescription, truncateMeta } from './utils/documentMeta'

const app = createApp(App)
app.use(router)

router.afterEach((to) => {
  const slug = typeof to.params.slug === 'string' ? to.params.slug : undefined

  if (to.name === 'service-detail' && slug) {
    const s = getServiceBySlug(slug)
    if (s) {
      setDocumentTitle(`${s.title} — ${siteBrandName}`)
      setMetaDescription(truncateMeta(s.intro))
      return
    }
    setDocumentTitle(`Страница не найдена — ${siteBrandName}`)
    setMetaDescription(siteDefaultDescription)
    return
  }

  if (to.name === 'doctor-detail' && slug) {
    const d = getDoctorBySlug(slug)
    if (d) {
      setDocumentTitle(`${d.name} — ${siteBrandName}`)
      setMetaDescription(truncateMeta(`${d.role}. ${d.shortDescription}`))
      return
    }
    setDocumentTitle(`Страница не найдена — ${siteBrandName}`)
    setMetaDescription(siteDefaultDescription)
    return
  }

  if (to.name === 'article' && slug) {
    const p = getPostBySlug(slug)
    if (p) {
      setDocumentTitle(`${p.title} — ${siteBrandName}`)
      setMetaDescription(truncateMeta(p.excerpt))
      return
    }
    setDocumentTitle(`Страница не найдена — ${siteBrandName}`)
    setMetaDescription(siteDefaultDescription)
    return
  }

  const segment = to.meta.title
  const desc = to.meta.description ?? siteDefaultDescription
  setDocumentTitle(segment ? `${segment} — ${siteBrandName}` : siteBrandName)
  setMetaDescription(desc)
})

app.mount('#app')
