import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Plan from '#models/plan'

export default class extends BaseSeeder {
  async run() {
    await Plan.createMany([
      {
        name: 'Starter',
        slug: 'starter',
        description: 'Plan gratuit avec les fonctionnalités essentielles',
        priceCents: 0,
        currency: 'EUR',
        billingCycle: 'monthly',
        isPopular: false,
        features: [
          'Facturation illimitée',
          'Suivi des clients et paiements',
          'Calcul automatique du revenu URSSAF',
          'Tableau de bord simplifié',
        ],
      },
      {
        name: 'Essentiel',
        slug: 'essential',
        description: 'Pour les freelances qui veulent optimiser leur gestion',
        priceCents: 1000,
        currency: 'EUR',
        billingCycle: 'monthly',
        isPopular: true,
        features: [
          'Toutes les fonctionnalités du plan Starter',
          'Génération PDF des factures',
          'Paiement en ligne via Stripe',
          'Déclarations URSSAF guidées',
          'Estimation automatique des cotisations',
        ],
        stripePriceId: 'price_essentiel_monthly',
      },
      {
        name: 'Pro',
        slug: 'pro',
        description: 'Solution complète pour les professionnels',
        priceCents: 2000,
        currency: 'EUR',
        billingCycle: 'monthly',
        isPopular: false,
        features: [
          'Toutes les fonctionnalités du plan Essentiel',
          'Stockage sécurisé de documents RH',
          'Accès salarié aux bulletins et absences',
          'Classement automatique des contrats, RIBs et pièces jointes',
          'Support prioritaire 7j/7',
        ],
        stripePriceId: 'price_pro_monthly',
      },
      {
        name: 'Essentiel',
        slug: 'essential_yearly',
        description: 'Abonnement annuel pour indépendants organisés',
        priceCents: 10000,
        currency: 'EUR',
        billingCycle: 'yearly',
        isPopular: false,
        features: [
          'Toutes les fonctionnalités du plan Starter',
          'Génération PDF des factures',
          'Paiement en ligne via Stripe',
          'Déclarations URSSAF guidées',
          'Estimation automatique des cotisations',
        ],
        stripePriceId: 'price_essentiel_yearly',
      },
      {
        name: 'Pro',
        slug: 'pro_yearly',
        description: 'Abonnement annuel pour les pros et les TPE',
        priceCents: 19000,
        currency: 'EUR',
        billingCycle: 'yearly',
        isPopular: false,
        features: [
          'Toutes les fonctionnalités du plan Essentiel',
          'Stockage sécurisé de documents RH',
          'Accès salarié aux bulletins et absences',
          'Classement automatique des contrats, RIBs et pièces jointes',
          'Support prioritaire 7j/7',
        ],
        stripePriceId: 'price_pro_yearly',
      },
    ])
  }
}
