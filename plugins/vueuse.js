import { defineNuxtPlugin } from 'nuxt/app'
import { createHead } from '@unhead/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const head = createHead()
  nuxtApp.vueApp.use(head)
}) 