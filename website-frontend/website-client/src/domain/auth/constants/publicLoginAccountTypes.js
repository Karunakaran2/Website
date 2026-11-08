import groupUserBlueIcon from '@/domain/auth/assets/login/group_user_blue.png'
import rpslShippingBlueIcon from '@/domain/auth/assets/login/rpsl_shipping_blue.png'
import nomineeProfileBlueIcon from '@/domain/auth/assets/login/nominee_profile_blue.png'

/** Public-login account picker (KRAN Design System portal — presentation labels only). */
export const PUBLIC_LOGIN_ACCOUNT_TYPES = [
  {
    id: 'portal',
    title: 'Portal user',
    description: 'Access modules, component workbench, and design guidelines',
    icon: groupUserBlueIcon,
    identifierLabel: 'Email or username',
    identifierPlaceholder: 'Enter email or username',
  },
  {
    id: 'developer',
    title: 'Module developer',
    description: 'Build and validate domain screens against shared components',
    icon: rpslShippingBlueIcon,
    identifierLabel: 'Username',
    identifierPlaceholder: 'Enter your username',
  },
  {
    id: 'reviewer',
    title: 'Design reviewer',
    description: 'Review patterns, accessibility, and component coverage',
    icon: nomineeProfileBlueIcon,
    identifierLabel: 'Username',
    identifierPlaceholder: 'Enter your username',
  },
]
