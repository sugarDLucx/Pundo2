import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pundo',
    short_name: 'Pundo',
    description: 'Your exclusive financial dashboard for tracking shared milestones.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#FBFBFB',
    theme_color: '#420093',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
