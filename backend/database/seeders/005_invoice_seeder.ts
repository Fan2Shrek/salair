import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Customer from '#models/customer'
import Company from '#models/company'
import InvoiceService from '#services/invoice.service'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Récupérer l'utilisateur test
    const user = await User.findBy('email', 'nassim@mail.com')
    if (!user) {
      console.log('Utilisateur nassim@mail.com non trouvé')
      return
    }

    // Récupérer l'entreprise de l'utilisateur
    const company = await Company.findBy('ownerId', user.id)
    if (!company) {
      console.log("Entreprise non trouvée pour l'utilisateur")
      return
    }

    // Récupérer les clients
    const customers = await Customer.query().where('userId', user.id).limit(5)
    if (customers.length === 0) {
      console.log('Aucun client trouvé')
      return
    }

    // Exemples de services/produits variés
    const sampleServices = [
      {
        description: 'Développement application web React/Node.js',
        unitPrice: 650,
        vatRate: 20,
      },
      {
        description: 'Consultation stratégie digitale',
        unitPrice: 120,
        vatRate: 20,
      },
      {
        description: 'Maintenance et support technique',
        unitPrice: 80,
        vatRate: 20,
      },
      {
        description: 'Formation développement web',
        unitPrice: 500,
        vatRate: 20,
      },
      {
        description: 'Audit sécurité application',
        unitPrice: 450,
        vatRate: 20,
      },
      {
        description: 'Intégration API tierces',
        unitPrice: 300,
        vatRate: 20,
      },
      {
        description: 'Optimisation performance',
        unitPrice: 200,
        vatRate: 20,
      },
      {
        description: 'Hébergement cloud mensuel',
        unitPrice: 45,
        vatRate: 20,
      },
      {
        description: 'Licence logiciel professionnel',
        unitPrice: 99,
        vatRate: 20,
      },
      {
        description: 'Service de sauvegarde automatique',
        unitPrice: 25,
        vatRate: 20,
      },
    ]

    // Créer 15 factures variées
    const invoices = []
    const now = DateTime.now()

    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length]

      // Générer 1 à 4 items par facture
      const numItems = Math.floor(Math.random() * 4) + 1
      const items = []

      for (let j = 0; j < numItems; j++) {
        const service = sampleServices[Math.floor(Math.random() * sampleServices.length)]
        const quantity = Math.floor(Math.random() * 5) + 1

        items.push({
          description: service.description,
          quantity,
          unitPrice: service.unitPrice,
          vatRate: service.vatRate,
        })
      }

      // Dates variées (factures des 6 derniers mois)
      const issueDate = now.minus({ days: Math.floor(Math.random() * 180) })
      const dueDate = issueDate.plus({ days: 30 })

      // Statuts variés selon l'ancienneté
      const daysSinceIssue = Math.floor(issueDate.diffNow('days').days)
      let status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' = 'draft'

      if (daysSinceIssue < -60) {
        status = Math.random() > 0.2 ? 'paid' : 'overdue'
      } else if (daysSinceIssue < -30) {
        status = Math.random() > 0.4 ? 'paid' : Math.random() > 0.5 ? 'sent' : 'overdue'
      } else if (daysSinceIssue < -7) {
        status = Math.random() > 0.6 ? 'sent' : 'draft'
      }

      const invoiceData = {
        customerId: customer.id,
        items,
        issueDate,
        dueDate,
        notes: `Facture générée automatiquement - Client: ${customer.companyName}`,
      }

      try {
        const invoice = await InvoiceService.createInvoiceWithCalculation(
          user.id,
          invoiceData,
          company
        )

        // Mettre à jour le statut si nécessaire
        if (status !== 'draft') {
          invoice.status = status
          await invoice.save()
        }

        invoices.push(invoice)
        console.log(`Facture ${invoice.invoiceNumber} créée: ${invoice.totalTTC}€ (${status})`)
      } catch (error) {
        console.error(`Erreur lors de la création de la facture ${i + 1}:`, error)
      }
    }

    console.log(`\n✅ ${invoices.length} factures créées avec succès !`)

    // Statistiques
    const totalHT = invoices.reduce((sum, inv) => sum + inv.totalHT, 0)
    const totalTTC = invoices.reduce((sum, inv) => sum + inv.totalTTC, 0)
    const statusCounts = invoices.reduce(
      (acc, inv) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    console.log(`\n📊 Statistiques:`)
    console.log(`- Total HT: ${totalHT.toFixed(2)}€`)
    console.log(`- Total TTC: ${totalTTC.toFixed(2)}€`)
    console.log(`- Répartition des statuts:`)
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  • ${status}: ${count}`)
    })
  }
}
