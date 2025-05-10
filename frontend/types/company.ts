export default interface Company {
    id: number
    ownerId: number
    status: string
    siret: string | null
    activity: string | null
    tradeName: string | null
    urssafFrequency: string | null
    businessStartDate: string | null // date in backend, string in frontend
    isVatPayer: boolean // defaults to false in backend
    billingType: string | null
    currency: string // defaults to 'EUR' in backend
    defaultDueDays: number // defaults to 0 in backend
    logoUrl: string | null
    defaultInvoiceNote: string | null
    createdAt: string // timestamp in backend, string in frontend
    updatedAt: string | null // nullable timestamp in backend
}