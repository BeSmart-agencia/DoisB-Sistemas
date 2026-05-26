import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/login', '/sucesso'],
      },
    ],
    sitemap: 'https://doisbsistemas.com.br/sitemap.xml',
  }
}
