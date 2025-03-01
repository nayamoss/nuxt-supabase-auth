export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/signup', '/reset-password', '/*']
    }
  },

  runtimeConfig: {
    public: {
      // Supabase credentials (Auto-used by @nuxtjs/supabase)
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },

  compatibilityDate: '2025-03-01'
})