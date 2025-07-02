export interface CustomersInsightsResponseDto {
    data: {
        label: string
        value: string | number
        percentage: number
    }[]
}