import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AtmoCraft | IMD Learning Portal',
    short_name: 'AtmoCraft',
    description: 'Official Digital Capacity Building & LMS Portal for the India Meteorological Department.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9ff',
    theme_color: '#1e3a5f',
    icons: [
      {
        src: '/icon?size=192x192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon?size=512x512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon?size=512x512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
