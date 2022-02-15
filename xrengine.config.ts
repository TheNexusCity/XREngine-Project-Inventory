


import type { ProjectConfigInterface } from '@xrengine/projects/ProjectConfigInterface'

const config: ProjectConfigInterface = {
  onEvent: undefined,
  thumbnail: '/static/xrengine_thumbnail.jpg',
  routes: {
    '/inventory': { component: () => import('./components/Inventory') },
    '/trading': { component: () => import('./components/Trading') },
    '/wallet': { component: () => import('./components/Wallet') },
    '/dashboard': { component: () => import('./components/Dashboard/DashboardHome') },
    '/dashboard/security': { component: () => import('./components/Dashboard/DashboardSecurity') },
    '/dashboard/configuration': { component: () => import('./components/Dashboard/DashboardConfigurations') },
    '/dashboard/deployment': { component: () => import('./components/Dashboard/DashboardDeployment') },
    '/dashboard/timer': { component: () => import('./components/Dashboard/Timer') },
    '/setup': { component: () => import('./components/Dashboard/SetupSigningAuthority') },
    // '/setup/custodial': { component: () => import('./components/Dashboard/SetupCustodial') },
    '/setup/signing-authority': { component: () => import('./components/Dashboard/SetupSigningAuthority') },
    '/setup/treasury': { component: () => import('./components/Dashboard/SetupTreasury') },
    '/setup/mainnet': { component: () => import('./components/Dashboard/SetupMainnet') },
    '/setup/infura': { component: () => import('./components/Dashboard/SetupInfura') },
    '/setup/polygon': { component: () => import('./components/Dashboard/SetupPolygon') },
    '/setup/polygon-vigil': { component: () => import('./components/Dashboard/SetupPolygonVigil') },
    '/setup/pinata-api': { component: () => import('./components/Dashboard/SetupPinata') },
    '/setup/completed': { component: () => import('./components/Dashboard/SetupCompleted') }
  },
  webappInjection: () => import('./components/webappInjection'),
  services: './services/services.ts',
  databaseSeed: undefined
}

export default config
