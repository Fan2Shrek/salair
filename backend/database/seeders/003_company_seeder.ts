import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Company from '#models/company'
import { DateTime } from 'luxon'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const users = await User.query().select('id')

    await Company.createMany([
      {
        ownerId: users[0].id, // Sophie Dubois
        status: 'active',
        siret: '12345678901234',
        activity: 'Développement informatique',
        tradeName: 'CodeNova',
        urssafFrequency: 'mensuelle',
        businessStartDate: DateTime.fromISO('2020-03-15'),
        isVatPayer: true,
        billingType: 'hourly',
        currency: 'EUR',
        defaultDueDays: 30,
        logoUrl: 'logo-codenova.png',
        defaultInvoiceNote: 'Merci pour votre confiance.',
      },
      {
        ownerId: users[1].id, // Thomas Martin
        status: 'active',
        siret: '23456789012345',
        activity: 'Design graphique',
        tradeName: 'DesignWave',
        urssafFrequency: 'trimestrielle',
        businessStartDate: DateTime.fromISO('2021-01-10'),
        isVatPayer: false,
        billingType: 'project',
        currency: 'EUR',
        defaultDueDays: 15,
        logoUrl: 'logo-designwave.png',
        defaultInvoiceNote: 'Paiement à réception de facture.',
      },
      {
        ownerId: users[2].id, // Emma Bernard
        status: 'pending',
        siret: '34567890123456',
        activity: 'Consultant marketing',
        tradeName: 'MarketPulse',
        urssafFrequency: 'mensuelle',
        businessStartDate: DateTime.fromISO('2019-11-05'),
        isVatPayer: true,
        billingType: 'hourly',
        currency: 'EUR',
        defaultDueDays: 45,
        logoUrl: 'logo-marketpulse.png',
        defaultInvoiceNote: 'TVA non applicable, art. 293 B du CGI.',
      },
      {
        ownerId: users[3].id, // Lucas Petit
        status: 'inactive',
        siret: '45678901234567',
        activity: 'Photographe',
        tradeName: 'Vision Capture',
        urssafFrequency: 'trimestrielle',
        businessStartDate: DateTime.fromISO('2022-05-20'),
        isVatPayer: false,
        billingType: 'project',
        currency: 'EUR',
        defaultDueDays: 14,
        logoUrl: 'logo-visioncapture.png',
        defaultInvoiceNote: "Entreprise dispensée d'immatriculation au RCS et au RM.",
      },
      {
        ownerId: users[4].id, // Chloé Moreau
        status: 'active',
        siret: '56789012345678',
        activity: 'Rédaction web',
        tradeName: 'TextCraft',
        urssafFrequency: 'mensuelle',
        businessStartDate: DateTime.fromISO('2021-09-12'),
        isVatPayer: true,
        billingType: 'hourly',
        currency: 'EUR',
        defaultDueDays: 21,
        logoUrl: 'logo-textcraft.png',
        defaultInvoiceNote: 'Conditions de règlement : paiement à 30 jours.',
      },
    ])
  }
}
