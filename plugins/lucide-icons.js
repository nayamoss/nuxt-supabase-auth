import { defineNuxtPlugin } from 'nuxt/app'
import * as lucideIcons from 'lucide-vue-next'

export default defineNuxtPlugin((nuxtApp) => {
  // Register all Lucide icons as global components
  Object.entries(lucideIcons).forEach(([name, component]) => {
    if (name !== 'createLucideIcon' && typeof component === 'object') {
      nuxtApp.vueApp.component(name, component)
    }
  })
}) 