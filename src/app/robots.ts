import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/user/', '/driver/dashboard'] },
    ],
    sitemap: `${process.env.NEXTAUTH_URL || 'https://barcelonatransfers.com'}/sitemap.xml`,
  }
}
