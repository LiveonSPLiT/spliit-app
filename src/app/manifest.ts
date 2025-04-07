import { MetadataRoute } from 'next'

interface ExtendedManifest extends MetadataRoute.Manifest {
  scope_extensions?: any
  handle_links?: any
  launch_handler?: any
  iarc_rating_id?: string
  edge_side_panel?: any
  screenshots?: any
}

export default function manifest(): ExtendedManifest {
  return {
    name: 'SPLiT · Share Expenses with Friends & Family',
    short_name: 'SPLiT',
    description:
      'A minimalist web application to share expenses with friends and family. No ads, no problem.',
    start_url: '/',
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
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    lang: 'en-US',
    id: 'id',
    display_override: [
      'fullscreen',
      'minimal-ui',
      'standalone',
    ],
    scope: '/',
    dir: 'auto',
    prefer_related_applications: false,
    related_applications: [],
    share_target: {},
    screenshots: [
      {
        src: '/split-desktop.png',
        sizes: '1892x787',
        type: 'image/png',
        form_factor: 'wide',
        label: 'splitDesktop',
      },
      {
        src: '/split-moblie.png',
        sizes: '360x795',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'splitMobile',
      },
    ],
    protocol_handlers: [],
    file_handlers: [],
    shortcuts: [
      {
        name: 'Create Group',
        url: '/groups/create',
        description: 'Create Group',
        icons: [ {
          src: '/users.png',
          sizes: '96x96',
          type: 'image/png',
        }
      ]
      },
      {
        name: 'Add Friend',
        url: '/friends/create',
        description: 'Add a Friend',
        icons: [ {
          src: '/contact.png',
          sizes: '96x96',
          type: 'image/png',
        }
        ]
      },
    ],
    categories: ['finance'],
    scope_extensions: [{ origin: '*.liveonsplit.com' }],
    handle_links: 'auto',
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    edge_side_panel: {
      preferred_width: 642,
    },
  }
}
