import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || 'https://barcelonatransfers.com'
  const now = new Date()
  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/booking?type=airport`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/booking?type=intercity`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/booking?type=city`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/booking?type=hourly`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    // Famous routes as SEO pages
    ...['girona','valencia','andorra','sitges','tarragona','costa-brava'].map(dest => ({
      url: `${base}/booking?to=${dest}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    })),
  ]
}
