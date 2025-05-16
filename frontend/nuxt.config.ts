// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: [
      '@nuxt/eslint',
      '@nuxt/image',
      '@nuxtjs/tailwindcss',
      '@pinia/nuxt',
      'pinia-plugin-persistedstate/nuxt',
      '@nuxtjs/color-mode',
      '@nuxtjs/google-fonts',
      '@nuxtjs/i18n',
      '@nuxtjs/sitemap',
      '@nuxtjs/robots',
      '@nuxt/content',
    ],
    i18n: {
        baseUrl: 'https://salair.fr',
        locales: [
            { code: 'fr', language: 'fr-FR', file: 'fr.json' },
            { code: 'en', language: 'en-US', file: 'en.json' },
            { code: 'es', language: 'es-ES', file: 'es.json' },
        ],
        defaultLocale: 'fr',
        bundle: {
            optimizeTranslationDirective: false,
        },
        strategy: "no_prefix"
    },
    tailwindcss: {
        exposeConfig: true,
        viewer: true,
    },
    runtimeConfig: {
        public: {
            apiUrl: '',
        },
    },
    colorMode: {
        preference: 'system',
        fallback: 'light',
        classSuffix: '',
    },
    vite: {
        server: {
            allowedHosts: ['salair.fr'],
        },
    },
    components: {
        dirs: [
            {
                path: '~/components',
                pathPrefix: false,
            },
        ],
    },
    googleFonts: {
        download: true,
        preload: true,
        families: {
            "DM Sans": {
                "ital,opsz,wght": "0,9..40,100..1000;1,9..40,100..1000"
            },
        },
    },
    site: { 
        url: 'https://salair.fr', 
        name: 'Salair - Gérez votre activité de freelance, sans prise de tête' 
    },
    routeRules: {
        '/doc/**': { robots: false }
    },
    content: {
        preview: {
            api: 'https://api.nuxt.studio'
        }
    }
});