import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'

export default defineSitemapEventHandler(async () => {
    const res = await fetch('https://api.salair.fr/api/blog/slugs')
    const slugs = await res.json()
    console.log(slugs)
    const urls = slugs.map((s: {slug: string}) => {
        return {
            loc: `/blog/${s.slug}`
        }
    }) satisfies SitemapUrlInput[]

    return urls
})
