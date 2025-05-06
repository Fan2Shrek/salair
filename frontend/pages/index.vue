<script setup lang="ts">
    import PlayCircleIcon from '~/components/atoms/icons/PlayCircleIcon.vue';

    // Définition des métadonnées SEO pour la page
    useSeoMeta({
        title: 'Salair - Gérez votre activité de freelance, sans prise de tête',
        titleTemplate: '%s',
        description:
            "Salair automatise vos factures, vos paiements et vos déclarations URSSAF. Pour les freelances qui veulent se concentrer sur leur métier, pas sur l'administratif.",
        keywords: 'freelance, factures, paiements, URSSAF, gestion, indépendants, automatisation, administratif',
        ogTitle: 'Salair - Gérez votre activité de freelance, sans prise de tête',
        ogDescription:
            'Automatisez vos factures, paiements et déclarations URSSAF. Un outil tout-en-un pensé pour les indépendants.',
        ogImage: '/landing-mockup.png',
        twitterTitle: 'Salair - Gérez votre activité de freelance, sans prise de tête',
        twitterDescription:
            'Automatisez vos factures, paiements et déclarations URSSAF. Un outil tout-en-un pensé pour les indépendants.',
        twitterCard: 'summary_large_image',
    });

    // Définir les données structurées pour les moteurs de recherche
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Salair',
        applicationCategory: 'BusinessApplication',
        description: 'Solution pour les freelances qui automatise les factures, paiements et déclarations fiscales',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR',
        },
        operatingSystem: 'Web',
        featureList:
            'Gestion des clients, Création de factures, Suivi des paiements, Préparation des déclarations fiscales, Centralisation des documents',
    };

    // Ajout des données structurées à la page
    useHead({
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(jsonLd),
            },
        ],
    });
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full h-full relative" role="main" aria-labelledby="main-heading">
            <div class="absolute top-0 flex justify-center w-full">
                <UChessBackgroundPattern class="mx-auto" aria-hidden="true" />
            </div>
            <section class="pt-10 md:pt-19 px-4 sm:px-6 max-w-7xl w-full mx-auto pb-24">
                <div class="mt-12 md:mt-24 relative">
                    <UBadge icon="dot" variant="modern" class="w-fit mx-auto">Still in development</UBadge>
                    <h1
                        id="main-heading"
                        class="text-primary font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mt-4 md:mt-6"
                    >
                        {{ $t('landing.title') }}
                    </h1>
                    <p
                        class="mt-4 md:mt-6 mx-auto max-w-3xl w-full text-center text-tertiary text-base sm:text-lg md:text-xl"
                    >
                        {{ $t('landing.subtitle') }}
                    </p>
                </div>
                <div class="mt-8 md:mt-12 w-fit mx-auto flex flex-col sm:flex-row items-center gap-3 relative">
                    <UButton
                        variant="secondary"
                        size="xl"
                        :icon="PlayCircleIcon"
                        icon-position="leading"
                        class="w-full sm:w-auto"
                        aria-label="Voir la démonstration"
                        >Demo</UButton
                    >
                    <UButton size="xl" class="w-full sm:w-auto mt-3 sm:mt-0" aria-label="S'inscrire à Salair">{{
                        $t('general.sign_up')
                    }}</UButton>
                </div>
                <div
                    class="mt-10 sm:mt-14 md:mt-18 relative max-h-[300px] sm:max-h-[400px] md:max-h-[500px] overflow-hidden"
                >
                    <div
                        class="max-w-7xl w-full bg-primary border border-secondary h-[808px] rounded-[32px] shadow-lg p-1"
                    >
                        <div class="w-full h-full rounded-[28px] bg-primary shadow-inner p-1">
                            <div
                                class="w-full h-full border border-utility-gray-200 bg-utility-gray-50 rounded-3xl"
                                aria-label="Interface de démonstration de l'application Salair"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section
                class="max-w-7xl mx-auto w-full bg-primary py-24 border-t border-secondary"
                aria-labelledby="features-heading"
            >
                <div class="max-w-3xl w-full mx-auto">
                    <p class="text-brand-secondary font-semibold text-center">{{ $t('features.title') }}</p>
                    <h2 id="features-heading" class="text-3xl font-semibold text-primary text-center mt-3">
                        {{ $t('features.heading') }}
                    </h2>
                    <p class="mt-5 text-tertiary text-center text-xl">
                        {{ $t('features.description') }}
                    </p>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-16 mt-16">
                    <div class="flex flex-col gap-4" itemscope itemtype="https://schema.org/Service">
                        <div
                            class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs text-fg-secondary"
                        >
                            <RepeatIcon class="size-6" aria-hidden="true" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center" itemprop="name">
                                {{ $t('features.items.access.title') }}
                            </h3>
                            <p class="text-tertiary text-center" itemprop="description">
                                {{ $t('features.items.access.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4" itemscope itemtype="https://schema.org/Service">
                        <div
                            class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs text-fg-secondary"
                        >
                            <LightningIcon class="size-6" aria-hidden="true" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center" itemprop="name">
                                {{ $t('features.items.payslips.title') }}
                            </h3>
                            <p class="text-tertiary text-center" itemprop="description">
                                {{ $t('features.items.payslips.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4" itemscope itemtype="https://schema.org/Service">
                        <div
                            class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs text-fg-secondary"
                        >
                            <ChartIcon class="size-6" aria-hidden="true" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center" itemprop="name">
                                {{ $t('features.items.reports.title') }}
                            </h3>
                            <p class="text-tertiary text-center" itemprop="description">
                                {{ $t('features.items.reports.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4" itemscope itemtype="https://schema.org/Service">
                        <div
                            class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs text-fg-secondary"
                        >
                            <MessageIcon class="size-6" aria-hidden="true" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center" itemprop="name">
                                {{ $t('features.items.employees.title') }}
                            </h3>
                            <p class="text-tertiary text-center" itemprop="description">
                                {{ $t('features.items.employees.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4" itemscope itemtype="https://schema.org/Service">
                        <div
                            class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs text-fg-secondary"
                        >
                            <FolderIcon class="size-6" aria-hidden="true" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center" itemprop="name">
                                {{ $t('features.items.documents.title') }}
                            </h3>
                            <p class="text-tertiary text-center" itemprop="description">
                                {{ $t('features.items.documents.description') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4" itemscope itemtype="https://schema.org/Service">
                        <div
                            class="bg-primary border border-primary p-3 rounded-[10px] w-fit mx-auto shadow-xs text-fg-secondary"
                        >
                            <PhoneIcon class="size-6" aria-hidden="true" />
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-primary text-lg font-semibold text-center" itemprop="name">
                                {{ $t('features.items.support.title') }}
                            </h3>
                            <p class="text-tertiary text-center" itemprop="description">
                                {{ $t('features.items.support.description') }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="w-full bg-secondary py-8 border-t border-secondary">
                <div class="max-w-7xl mx-auto px-4 sm:px-6">
                    <p class="text-center text-tertiary">
                        © {{ new Date().getFullYear() }} Salair. {{ $t('copyright') }}
                    </p>
                </div>
            </footer>
        </main>
    </NuxtLayout>
</template>

