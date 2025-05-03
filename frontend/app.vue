<script setup>
    // Définition des métadonnées SEO globales par défaut
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
        themeColor: '#6366f1', // couleur principale basée sur les variables de couleur du projet
        robots: 'index, follow',
        canonical: 'https://salair.fr',
        author: 'Salair',
    });

    // Configuration globale de l'en-tête
    useHead({
        htmlAttrs: {
            lang: 'fr',
            dir: 'ltr',
        },
        link: [{ rel: 'icon', href: '/favicon.ico' }],
    });
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

