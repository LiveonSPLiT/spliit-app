import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SPLiT · Share Expenses with Friends & Family',
    short_name: 'SPLiT',
    description:
      'A minimalist web application to share expenses with friends and family. No ads, no problem.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#047857',
    orientation: 'portrait',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/ic_launcher.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/logo-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    lang: "en",
    id: "id",
    display_override: [
      "browser",
      "fullscreen",
      "minimal-ui",
      "standalone",
      "window-controls-overlay"
    ],
    scope: "/",
    dir: "auto",
    shortcuts: [
      {
        name: "Create Group",
        url: "/groups/create",
        description: "Create Group"
      },
      {
        name: "Add Friend",
        url: "/friends/create",
        description: "Add a Friend"
      }
    ],
    categories: [
      "finance"
    ]
  }
}
