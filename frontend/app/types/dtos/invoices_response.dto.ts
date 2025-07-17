import type { Invoice } from "../invoice";
import type { PaginatedMeta } from "../paginated_meta";

export interface InvoicesResponseDto {
    data: Invoice[]
    meta: PaginatedMeta
}