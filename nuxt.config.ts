export default defineNuxtConfig({
  extends: [
    '@hyrdrocks/hyrd-ui-library',
    '@nuxthub/core',
  ],
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@nuxt/fonts',
    '@nuxt/devtools',
  ],
  css: ['@unocss/reset/tailwind.css'],
})
