import type User from "./user"

export type BlogArticle = {
    id: number
    slug: string
    status: 'draw' | 'published' | 'archived'
    visible: boolean
    mainPicture: string
    author: User
    createdAt: string
    updatedAt: string
}