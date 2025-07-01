import type { BlogArticle } from "./blog_article";
import type { PaginatedMeta } from "./paginated_meta";

export interface BlogArticlePaginated {
    data: BlogArticle[]
    meta: PaginatedMeta
}