// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    //'@nuxtjs/axios',
    '@nuxtjs/tailwindcss'
  ],
  vite: {
    build: {
      target: 'esnext',
    },
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  }
})
