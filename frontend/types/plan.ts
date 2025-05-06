export default interface Plan {
    id: number
    name: string
    slug: string
    description: string
    priceCents: number
    currency: string
    billingCycle: 'yearly' | 'monthly'
    isPopular: boolean
    features: string[]
}