import type { ProjectConfigInterface } from '@xrengine/projects/ProjectConfigInterface'

const config: ProjectConfigInterface = {
  onEvent: undefined,
  thumbnail: '/static/xrengine_thumbnail.jpg',
  routes: {
    '/inventory': { component: () => import('./components/Inventory') },
    '/trading': { component: () => import('./components/Trading') },
    '/wallet': { component: () => import('./components/Wallet') }
  },
  webappInjection: () => import('./components/webappInjection'),
  services: './services/services.ts',
  databaseSeed: undefined
}

export default config
