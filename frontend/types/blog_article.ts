import type User from "./user"

export type BlogArticle = {
    id: number
    title: string
    description: string
    slug: string
    status: 'draft' | 'published' | 'archived'
    visible: boolean
    mainPicture: string
    author: User
    createdAt: string
    updatedAt: string
}