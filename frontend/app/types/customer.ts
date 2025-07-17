export interface Customer {
    id: string
    userId: string
    companyName: string
    contactName: string
    email: string
    phoneNumber: string
    address: string
    createdAt: string | Date
    updatedAt: string | Date
    deletedAt: string | Date | null
}