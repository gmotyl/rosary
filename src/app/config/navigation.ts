import {ERoutes} from './routes'

export interface NavLinkItem {
  key: string
  labelKey: string
  path: ERoutes
  icon: string
}

export const navigation: NavLinkItem[] = [
  {
    key: 'home',
    labelKey: 'menu.pray',
    path: ERoutes.HOME,
    icon: 'HomeIcon',
  },
  {
    key: 'about',
    labelKey: 'menu.howItWorks',
    path: ERoutes.ABOUT,
    icon: 'InfoIcon',
  },
  {
    key: 'policy',
    labelKey: 'menu.privacyPolicy',
    path: ERoutes.POLICY,
    icon: 'PolicyIcon',
  },
]
