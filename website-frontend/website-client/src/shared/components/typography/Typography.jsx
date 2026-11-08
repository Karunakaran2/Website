import { createElement } from 'react'
import {
  bodyTextClass,
  bodyTextMediumClass,
  captionClass,
  captionDangerClass,
  formSectionOverlineClass,
  modalSubtitleClass,
  modalTitleClass,
  moduleSectionSubtitleClass,
  moduleSectionTitleClass,
  pageTitleClass,
  sectionTitleClass,
  subsectionTitleClass,
} from './typographyStyles'

function typographyComponent(styleClass, defaultTag) {
  return function TypoComponent({ as, className = '', children, ...rest }) {
    const Tag = as || defaultTag
    if (children == null || children === '') {
      return null
    }
    return createElement(
      Tag,
      { className: `${styleClass} ${className}`.trim(), ...rest },
      children,
    )
  }
}

export const PageTitle = typographyComponent(pageTitleClass, 'h1')
export const ModalTitle = typographyComponent(modalTitleClass, 'h2')
export const ModuleSectionTitle = typographyComponent(moduleSectionTitleClass, 'h2')
export const SectionTitle = typographyComponent(sectionTitleClass, 'h3')
export const SubsectionTitle = typographyComponent(subsectionTitleClass, 'h4')
export const FormSectionOverline = typographyComponent(formSectionOverlineClass, 'p')

export function ModuleSectionSubtitle({ className = '', children, ...rest }) {
  if (!children) return null
  return (
    <p className={`${moduleSectionSubtitleClass} ${className}`.trim()} {...rest}>
      {children}
    </p>
  )
}

export function ModalSubtitle({ className = '', children, ...rest }) {
  if (!children) return null
  return (
    <p className={`${modalSubtitleClass} ${className}`.trim()} {...rest}>
      {children}
    </p>
  )
}

export function BodyText({ medium = false, as = 'p', className = '', children, ...rest }) {
  if (children == null || children === '') return null
  const base = medium ? bodyTextMediumClass : bodyTextClass
  return createElement(as, { className: `${base} ${className}`.trim(), ...rest }, children)
}

export function Caption({ tone = 'default', className = '', children, ...rest }) {
  if (!children) return null
  const base = tone === 'danger' ? captionDangerClass : captionClass
  return (
    <p className={`m-0 mt-1 ${base} ${className}`.trim()} {...rest}>
      {children}
    </p>
  )
}
