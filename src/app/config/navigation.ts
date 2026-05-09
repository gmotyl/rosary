import {ERoutes} from './routes'

export interface NavLinkItem {
  key: string
  path: ERoutes
  icon: string
}

export const navigation: NavLinkItem[] = [
  {
    key: 'nav.home',
    path: ERoutes.HOME,
    icon: 'HomeIcon',
  },
  {
    key: 'nav.add-intention',
    path: ERoutes.ADD_INTENTION,
    icon: 'RosaryIcon',
  },
  {
    key: 'nav.about',
    path: ERoutes.ABOUT,
    icon: 'InfoIcon',
  },
  {
    key: 'nav.policy',
    path: ERoutes.POLICY,
    icon: 'PolicyIcon',
  },
]

export const navLabels = {
  pl: {
    'nav.home': 'ORARE PRO ME',
    'nav.add-intention': 'Dodaj intencję',
    'nav.about': 'O projekcie',
    'nav.policy': 'Polityka prywatności',
  },
}
