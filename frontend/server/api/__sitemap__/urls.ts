import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
    const runtimeConfig = useRuntimeConfig()
    
    const res = await fetch(`${runtimeConfig.public.apiUrl}/api/blog/slugs`)
    const slugs = await res.json()

    const urls = slugs.map((s: {slug: string}) => {
        return {
            loc: `/blog/${s.slug}`
        }
    }) satisfies SitemapUrlInput[]

    return urls
})
