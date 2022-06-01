import type { ProjectConfigInterface } from '@xrengine/projects/ProjectConfigInterface'

const config: ProjectConfigInterface = {
  onEvent: undefined,
  thumbnail: '/static/xrengine_thumbnail.jpg',
  routes: {
    '/inventory': { component: () => import('./packages/client/src/components/Inventory') },
    '/trading': { component: () => import('./packages/client/src/components/Trading') },
    '/wallet': { component: () => import('./packages/client/src/components/Wallet') }
  },
  webappInjection: () => import('./packages/client/src/components/webappInjection'),
  services: './services/services.ts',
  databaseSeed: undefined
}

export default config
