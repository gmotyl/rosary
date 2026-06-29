import {ERoutes} from './routes'

export interface NavLinkItem {
  key: string
  labelKey: string
  path: ERoutes
  icon: string
}

export const navigation: NavLinkItem[] = [
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
