<script setup>
    useSeoMeta({
        title: 'Salair - La solution moderne de gestion des salaires',
        titleTemplate: '%s | Salair',
        description:
            'Salair est une application web qui simplifie la gestion des salaires, des employés et des documents RH pour les entreprises.',
        keywords: 'salaires, gestion, RH, fiches de paie, employés, entreprise',
        ogTitle: 'Salair - La solution moderne de gestion des salaires',
        ogDescription: 'Simplifiez la gestion des salaires et RH pour votre entreprise',
        ogImage: '/landing-mockup.png',
        twitterTitle: 'Salair - La solution moderne de gestion des salaires',
        twitterDescription: 'Simplifiez la gestion des salaires et RH pour votre entreprise',
        twitterCard: 'summary_large_image',
        viewport: 'width=device-width, initial-scale=1',
        charset: 'utf-8',
        themeColor: '#6366f1',
        robots: 'index, follow',
        canonical: 'https://salair.fr',
        author: 'Salair',
    });

    const i18nHead = useLocaleHead();

    useHead({
        htmlAttrs: {
            lang: i18nHead.value.htmlAttrs.lang,
            dir: 'ltr',
        },
        link: [
            { rel: 'icon', href: '/favicon.png' },
            { rel: 'icon', type: 'image/png', sizes: '72x72', href: '/logo-72.png' },
            { rel: 'icon', type: 'image/png', sizes: '128x128', href: '/logo-128.png' },
            { rel: 'icon', type: 'image/png', sizes: '144x144', href: '/logo-144.png' },
            { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/logo-192.png' },
            { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/logo-512.png' },
            { rel: 'apple-touch-icon', sizes: '192x192', href: '/logo-192.png' },
            { rel: 'apple-touch-icon', sizes: '512x512', href: '/logo-512.png' },
            { rel: 'manifest', href: '/site.webmanifest' },
            ...(i18nHead.value.link || []),
        ],
    });
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
