import { DateTime } from 'luxon'
import Invoice from '#models/invoice'
import InvoiceItem from '#models/invoice_item'
import Company from '#models/company'
import InvoiceRepository from '#repositories/invoice.repository'

export interface InvoiceCalculationResult {
  totalHT: number
  totalTTC: number
  totalVAT: number
  items: InvoiceItemCalculation[]
}

export interface InvoiceItemCalculation {
  description: string
  quantity: number
  unitPrice: number
  totalHT: number
  vatRate: number
  vatAmount: number
  totalTTC: number
}

export interface InvoiceCreationData {
  customerId: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    vatRate?: number
  }[]
  issueDate: DateTime
  dueDate: DateTime
  notes?: string
}

export default class InvoiceService {
  /**
   * Taux de TVA français officiels 2024-2025
   */
  static readonly VAT_RATES = {
    NORMAL: 20.0,
    INTERMEDIATE: 10.0,
    REDUCED: 5.5,
    SPECIAL: 2.1,
  } as const

  /**
   * Seuils de franchise en base TVA 2025
   */
  static readonly FRANCHISE_THRESHOLDS = {
    SERVICES: 37500,
    COMMERCE: 85000,
  } as const

  /**
   * Calcule automatiquement les totaux d'une facture
   */
  static calculateInvoice(
    items: InvoiceItemCalculation[],
    companyVatRate: number = 20.0,
    isVatExempt: boolean = false
  ): InvoiceCalculationResult {
    const calculatedItems: InvoiceItemCalculation[] = []
    let totalHT = 0
    let totalVAT = 0

    for (const item of items) {
      const itemTotalHT = item.quantity * item.unitPrice
      const vatRate = isVatExempt ? 0 : item.vatRate || companyVatRate
      const vatAmount = (itemTotalHT * vatRate) / 100
      const itemTotalTTC = itemTotalHT + vatAmount

      const calculatedItem: InvoiceItemCalculation = {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalHT: itemTotalHT,
        vatRate,
        vatAmount,
        totalTTC: itemTotalTTC,
      }

      calculatedItems.push(calculatedItem)
      totalHT += itemTotalHT
      totalVAT += vatAmount
    }

    return {
      totalHT: Math.round(totalHT * 100) / 100,
      totalTTC: Math.round((totalHT + totalVAT) * 100) / 100,
      totalVAT: Math.round(totalVAT * 100) / 100,
      items: calculatedItems,
    }
  }

  /**
   * Génère le prochain numéro de facture selon les règles françaises
   */
  static async generateInvoiceNumber(userId: string): Promise<string> {
    // Utiliser la méthode existante du repository
    return await InvoiceRepository.generateNextInvoiceNumber(userId)
  }

  /**
   * Valide si une entreprise est exemptée de TVA
   */
  static async isCompanyVatExempt(company: Company): Promise<boolean> {
    if (!company.isVatPayer) {
      return true
    }

    // Vérifier les seuils de franchise en base
    // TODO: Calculer le CA annuel depuis les factures
    // const annualRevenue = await this.calculateAnnualRevenue(company.ownerId)
    // return annualRevenue < this.FRANCHISE_THRESHOLDS.SERVICES

    return false
  }

  /**
   * Génère les mentions légales obligatoires pour une facture
   */
  static generateLegalMentions(company: Company, isVatExempt: boolean): string {
    const mentions: string[] = []

    if (isVatExempt) {
      mentions.push('TVA non applicable, art. 293 B du CGI')
    }

    // Mention pour micro-entreprise
    if (company.billingType === 'micro') {
      mentions.push(
        "Dispensé d'immatriculation au registre du commerce et des sociétés (RCS) et au répertoire des métiers (RM)"
      )
    }

    // Mention délai de paiement
    mentions.push(
      `Paiement à réception de facture, le ${DateTime.now().plus({ days: company.defaultDueDays }).toFormat('dd/MM/yyyy')}`
    )

    return mentions.join(' | ')
  }

  /**
   * Crée une facture complète avec calculs automatiques
   */
  static async createInvoiceWithCalculation(
    userId: string,
    data: InvoiceCreationData,
    company: Company
  ): Promise<Invoice> {
    // Vérifier l'exemption TVA
    const isVatExempt = await this.isCompanyVatExempt(company)

    // Transformer les items en format de calcul
    const itemsForCalculation: InvoiceItemCalculation[] = data.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalHT: item.quantity * item.unitPrice,
      vatRate: item.vatRate || company.defaultVatRate,
      vatAmount: 0, // Sera calculé
      totalTTC: 0, // Sera calculé
    }))

    // Calculer les totaux
    const calculation = this.calculateInvoice(
      itemsForCalculation,
      company.defaultVatRate,
      isVatExempt
    )

    // Générer le numéro de facture
    const invoiceNumber = await this.generateInvoiceNumber(userId)

    // Créer la facture
    const invoice = await InvoiceRepository.create({
      userId,
      customerId: data.customerId,
      invoiceNumber,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      status: 'draft',
      totalHT: calculation.totalHT,
      totalTTC: calculation.totalTTC,
      notes: data.notes || this.generateLegalMentions(company, isVatExempt),
      pdfUrl: '',
    })

    // Créer les items
    for (const item of calculation.items) {
      await InvoiceItem.create({
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalHT,
        vatRate: item.vatRate,
        vatAmount: item.vatAmount,
      })
    }

    return invoice
  }

  /**
   * Met à jour une facture avec recalcul automatique
   */
  static async updateInvoiceWithCalculation(
    invoice: Invoice,
    items: InvoiceItemCalculation[],
    company: Company
  ): Promise<Invoice> {
    const isVatExempt = await this.isCompanyVatExempt(company)

    const calculation = this.calculateInvoice(items, company.defaultVatRate, isVatExempt)

    // Mettre à jour les totaux de la facture
    invoice.totalHT = calculation.totalHT
    invoice.totalTTC = calculation.totalTTC
    await invoice.save()

    // Supprimer les anciens items
    await InvoiceItem.query().where('invoiceId', invoice.id).delete()

    // Créer les nouveaux items
    for (const item of calculation.items) {
      await InvoiceItem.create({
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalHT,
        vatRate: item.vatRate,
        vatAmount: item.vatAmount,
      })
    }

    return invoice
  }

  /**
   * Valide la transition de statut d'une facture
   */
  static validateStatusTransition(currentStatus: string, newStatus: string): boolean {
    const validTransitions: Record<string, string[]> = {
      draft: ['sent', 'cancelled'],
      sent: ['paid', 'overdue', 'cancelled'],
      paid: [], // Pas de transition possible depuis payée
      overdue: ['paid', 'cancelled'],
      cancelled: [], // Pas de transition possible depuis annulée
    }

    return validTransitions[currentStatus]?.includes(newStatus) || false
  }
}
