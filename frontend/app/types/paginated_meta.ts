export interface PaginatedMeta {
    total: number;
    currentPage: number;
    firstPage: number;
    lastPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
    perPage: number;
}
