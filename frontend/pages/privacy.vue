<template>
    <NuxtLayout name="landing">
        <main class="w-full flex-grow">
            <section class="pt-19 max-w-7xl mx-auto w-full">
                <div class="my-24 max-w-3xl w-full mx-auto">
                    <p class="text-brand-secondary font-semibold text-center">Current as of 15 May 2025</p>
                    <h1 class="text-primary text-5xl font-semibold text-center mt-3">Privacy Policy</h1>
                    <p class="text-tertiary text-xl text-center mt-6">
                        Your privacy is important to us at Salair. We respect your privacy regarding any information we
                        may collect from you across our website.
                    </p>
                </div>
                <div class="max-w-prose w-full mx-auto content pb-24">
                    <h3>1. Introduction</h3>
                    <p>
                        Salair attache une grande importance à la protection de vos données personnelles et s’engage à
                        respecter le Règlement Général sur la Protection des Données (RGPD).
                    </p>

                    <h3>2. Données collectées</h3>
                    <p>Nous collectons les données suivantes :</p>
                    <ul>
                        <li>Données d’identification : nom, prénom, email, mot de passe chiffré</li>
                        <li>Informations professionnelles : statut, entreprise, numéro SIRET</li>
                        <li>Données de paiement (via Stripe)</li>
                        <li>Données d’usage du service</li>
                    </ul>

                    <h3>3. Finalité du traitement</h3>
                    <p>Les données sont collectées pour :</p>
                    <ul>
                        <li>Créer et gérer votre compte utilisateur</li>
                        <li>Fournir les services de facturation, suivi et déclaration</li>
                        <li>Gérer la facturation et les paiements</li>
                        <li>Améliorer l’expérience utilisateur</li>
                        <li>Se conformer aux obligations légales (comptabilité, fiscalité)</li>
                    </ul>

                    <h3>4. Base légale</h3>
                    <p>Le traitement repose sur :</p>
                    <ul>
                        <li>Votre consentement (formulaires, cookies)</li>
                        <li>L’exécution du contrat (abonnement)</li>
                        <li>Le respect d’obligations légales</li>
                    </ul>

                    <h3>5. Destinataires</h3>
                    <p>Les données sont exclusivement utilisées par Salair et ses sous-traitants :</p>
                    <ul>
                        <li><strong>Stripe</strong> (paiement sécurisé)</li>
                        <li><strong>MinIO</strong> (stockage de fichiers)</li>
                        <li>Prestataires d’hébergement et emailing</li>
                    </ul>
                    <p>
                        Aucun transfert hors UE n’est effectué sans garanties adéquates (clauses contractuelles types ou
                        équivalents).
                    </p>

                    <h3>6. Durée de conservation</h3>
                    <p>
                        Les données sont conservées tant que votre compte est actif, puis archivées pendant 5 ans à des
                        fins légales, comptables ou fiscales.
                    </p>

                    <h3>7. Sécurité</h3>
                    <p>
                        Salair met en place des mesures techniques et organisationnelles pour garantir la sécurité de
                        vos données (chiffrement, journalisation, contrôle d’accès).
                    </p>

                    <h3>8. Vos droits</h3>
                    <p>Vous disposez des droits suivants sur vos données :</p>
                    <ul>
                        <li>Droit d’accès, de rectification, d’effacement</li>
                        <li>Droit à la limitation ou à l’opposition</li>
                        <li>Droit à la portabilité</li>
                        <li>Droit de retirer votre consentement à tout moment</li>
                    </ul>
                    <p>Vous pouvez exercer ces droits en nous écrivant à : <strong>privacy@salair.fr</strong></p>

                    <h3>9. Cookies</h3>
                    <p>
                        Des cookies peuvent être utilisés à des fins de fonctionnement et d’analyse. Vous pouvez les
                        accepter ou les refuser via le bandeau prévu à cet effet lors de votre navigation.
                    </p>

                    <h3>10. Contact et recours</h3>
                    <p>
                        Pour toute question ou demande concernant vos données personnelles, contactez-nous à :
                        <strong>privacy@salair.fr</strong>
                    </p>
                    <p>
                        Vous pouvez également introduire une réclamation auprès de la CNIL :
                        <a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>
                    </p>
                </div>
            </section>
        </main>
    </NuxtLayout>
</template>

<style scoped>
    .content {
        @apply prose;

        p {
            @apply text-tertiary;
            @apply text-lg;
        }

        h2 {
            @apply text-primary;
            @apply font-semibold;
            @apply text-3xl;
        }

        h3 {
            @apply text-primary;
            @apply font-semibold;
            @apply text-2xl;
            @apply pt-8;
            @apply pb-4;
        }

        ol {
            li {
                @apply list-decimal;
                @apply list-outside;
                @apply text-tertiary;
                @apply text-lg;
            }
        }

        ul {
            li {
                @apply list-decimal;
                @apply list-disc;
                @apply text-tertiary;
                @apply text-lg;
            }
        }
    }
</style>

