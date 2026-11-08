import HostShellIntegratorGuide from '@/shared/documentation/HostShellIntegratorGuide'

/** Workbench Overview / Getting Started host-shell block. */
export default function HostShellReference(props) {
  return (
    <HostShellIntegratorGuide
      footerLinks={[
        { label: 'Navigation → Header / shell', to: '/component-workbench/lib-navigation/headers' },
        { label: 'Actions → Buttons', to: '/component-workbench/actions/buttons' },
        { label: 'Design Guidelines → Architecture', to: '/design-guidelines/guide-architecture/overview' },
      ]}
      {...props}
    />
  )
}
