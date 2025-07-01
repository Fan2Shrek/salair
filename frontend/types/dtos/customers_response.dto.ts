import type { Customer } from "../customer";
import type { PaginatedMeta } from "../paginated_meta";

export interface CustomersResponseDto {
    data: Customer[]
    meta: PaginatedMeta
}