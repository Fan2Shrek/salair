<script setup lang="ts">
    import ChartIcon from '~/components/atoms/icons/ChartIcon.vue';
    import ClipboardCheckIcon from '~/components/atoms/icons/ClipboardCheckIcon.vue';
    import ReceiptCheckIcon from '~/components/atoms/icons/ReceiptCheckIcon.vue';
</script>

<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <section class="py-16 md:py-19 w-full bg-secondary">
                <div class="mt-16 md:my-24 max-w-7xl mx-auto w-full max-md:px-4">
                    <p class="text-brand-secondary font-semibold text-center">About us</p>
                    <h1 class="text-primary text-4xl md:text-5xl font-semibold text-center mt-3">
                        Rendre l’administratif simple pour les indépendants
                    </h1>
                    <p class="text-tertiary text-lg md:text-xl text-center mt-6">
                        Nous sommes une équipe dédiée à aider les freelances à se concentrer sur leur métier, pas sur la
                        paperasse.
                    </p>
                    <div class="mt-8 md:mt-12 md:w-fit mx-auto md:flex items-center gap-3 max-md:space-y-3">
                        <UButton variant="secondary" class="max-md:w-full">Découvrir la plateforme</UButton>
                        <UButton class="max-md:w-full">Commencer</UButton>
                    </div>
                </div>
            </section>
            <section class="py-16 md:py-24 space-y-12 md:space-y-24">
                <div class="max-w-3xl w-full mx-auto space-y-5 max-md:px-4">
                    <h2 class="text-center text-primary font-semibold text-3xl md:text-4xl">
                        Notre mission : simplifier la vie des freelances
                    </h2>
                    <p class="text-tertiary text-lg md:text-xl text-center">
                        Salair centralise tout ce dont un freelance a besoin : facturation, URSSAF, paiements, et
                        bientôt... paie et embauche simplifiées.
                    </p>
                </div>
                <div class="md:flex w-full md:max-h-140 h-full max-md:space-y-10">
                    <div class="md:w-1/2 flex justify-end items-center md:py-24 md:pr-16 px-4">
                        <div class="md:px-8 flex flex-col gap-8">
                            <div class="space-y-5">
                                <UFeaturedIcon :icon="ReceiptCheckIcon" color="brand" size="lg" />
                                <div class="space-y-4">
                                    <h3 class="text-primary font-semibold text-2xl md:text-3xl">
                                        Facturation rapide et intuitive
                                    </h3>
                                    <p class="md:text-lg text-tertiary self-stretch">
                                        Créez et envoyez vos factures en quelques clics, sans prise de tête.
                                    </p>
                                </div>
                            </div>
                            <div class="pl-4 space-y-5">
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">
                                        Modèles personnalisés & numérotation automatique
                                    </p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">Envoi par email + relance automatique</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">Paiement en ligne via Stripe ou virement</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img
                        class="md:w-1/2 max-md:px-4 max-h-140 h-full object-cover"
                        src="https://storage.salair.fr/salair/public/about_1.jpg"
                    />
                </div>
                <div class="md:flex flex-row-reverse w-full md:max-h-140 h-full max-md:space-y-10">
                    <div class="md:w-1/2 flex justify-end items-center md:py-24 md:pr-16 px-4">
                        <div class="md:px-8 flex flex-col gap-8">
                            <div class="space-y-5">
                                <UFeaturedIcon :icon="ClipboardCheckIcon" color="brand" size="lg" />
                                <div class="space-y-4">
                                    <h3 class="text-primary font-semibold text-2xl md:text-3xl">URSSAF sans stress</h3>
                                    <p class="md:text-lg text-tertiary self-stretch">
                                        Gérez vos déclarations mensuelles ou trimestrielles en toute sérénité.
                                    </p>
                                </div>
                            </div>
                            <div class="pl-4 space-y-5">
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">Estimation automatique de vos cotisations</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">Rappels intelligents à l’échéance</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">Historique de vos déclarations et paiements</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img
                        class="md:w-1/2 max-md:px-4 max-h-140 h-full object-cover"
                        src="https://storage.salair.fr/salair/public/about_2.jpg"
                    />
                </div>
                <div class="md:flex w-full md:max-h-140 h-full max-md:space-y-10">
                    <div class="md:w-1/2 flex justify-end items-center md:py-24 md:pr-16 px-4">
                        <div class="md:px-8 flex flex-col gap-8">
                            <div class="space-y-5">
                                <UFeaturedIcon :icon="ChartIcon" color="brand" size="lg" />
                                <div class="space-y-4">
                                    <h3 class="text-primary font-semibold text-2xl md:text-3xl">
                                        Votre activité en un clin d’œil
                                    </h3>
                                    <p class="md:text-lg text-tertiary self-stretch">
                                        Suivez vos revenus, plafonds et obligations en temps réel.
                                    </p>
                                </div>
                            </div>
                            <div class="pl-4 space-y-5">
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">
                                        Vue mensuelle et annuelle de votre chiffre d'affaires
                                    </p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">Suivi des plafonds de franchise de TVA & ACRE</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <CheckFillIcon class="text-fg-brand-primary min-w-fit" />
                                    <p class="text-tertiary md:text-lg">Visualisation des paiements reçus et à venir</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <img
                        class="md:w-1/2 max-md:px-4 max-h-140 h-full object-cover"
                        src="https://storage.salair.fr/salair/public/about_3.jpg"
                    />
                </div>
            </section>
        </main>
    </NuxtLayout>
</template>

