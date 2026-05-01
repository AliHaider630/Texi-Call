import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Barcelona Premium Transfers | Airport, City & Intercity Transfers',
    template: '%s | Barcelona Premium Transfers'
  },
  description: 'Premium airport transfers, city transfers and intercity transfers in Barcelona. Professional drivers, luxury fleet. Barcelona to Girona, Valencia, Andorra, Sitges, Tarragona, Costa Brava.',
  keywords: [
    'Barcelona airport transfer', 'Barcelona taxi', 'BCN airport transfer',
    'Barcelona to Girona transfer', 'Barcelona to Valencia transfer',
    'Barcelona to Andorra transfer', 'Barcelona private transfer',
    'luxury transfer Barcelona', 'airport transfer Barcelona',
    'traslado aeropuerto Barcelona', 'taxi Barcelona aeropuerto',
    'Barcelona to Costa Brava', 'Barcelona to Sitges transfer',
    'Barcelona to Tarragona transfer', 'intercity transfer Spain',
    'private driver Barcelona', 'executive transfer Barcelona',
    'minibus Barcelona', 'van transfer Barcelona',
    'Barcelona El Prat airport taxi', 'economy transfer Barcelona'
  ],
  authors: [{ name: 'Barcelona Premium Transfers' }],
  creator: 'Barcelona Premium Transfers',
  publisher: 'Barcelona Premium Transfers',
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://barcelonatransfers.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/',
    siteName: 'Barcelona Premium Transfers',
    title: 'Barcelona Premium Transfers | Airport, City & Intercity Transfers',
    description: 'Book your premium transfer in Barcelona. Airport pickups, city transfers, trips to Girona, Valencia, Andorra & more. Luxury fleet, professional drivers.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Barcelona Premium Transfers' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barcelona Premium Transfers',
    description: 'Premium transfers from Barcelona Airport and around Catalonia.',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
  },
  verification: { google: 'your-google-verification-code' },
  category: 'transportation'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="geo.region" content="ES-CT" />
        <meta name="geo.placename" content="Barcelona" />
        <meta name="geo.position" content="41.3851;2.1734" />
        <meta name="ICBM" content="41.3851, 2.1734" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TaxiService",
          "name": "Barcelona Premium Transfers",
          "url": process.env.NEXTAUTH_URL || "https://barcelonatransfers.com",
          "telephone": "+34-XXX-XXX-XXX",
          "email": "info@barcelonatransfers.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Barcelona",
            "addressRegion": "Catalonia",
            "addressCountry": "ES"
          },
          "geo": { "@type": "GeoCoordinates", "latitude": 41.3851, "longitude": 2.1734 },
          "areaServed": ["Barcelona", "Girona", "Valencia", "Andorra", "Sitges", "Tarragona", "Costa Brava"],
          "serviceType": ["Airport Transfer", "City Transfer", "Intercity Transfer"],
          "priceRange": "€€€",
          "currenciesAccepted": "EUR",
          "paymentAccepted": "Credit Card, Cash",
          "openingHours": "Mo-Su 00:00-24:00"
        })}} />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster position="top-right" toastOptions={{
            style: { background: '#1e1e1e', color: '#e8e8e8', border: '1px solid #c9a84c' },
            success: { iconTheme: { primary: '#c9a84c', secondary: '#000' } }
          }} />
        </Providers>
      </body>
    </html>
  )
}
