import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ActionButton from './ActionButton'
import { BTN_BACK_CLASS } from './actionButtonStyles'

export default function BackButton({
  onClick,
  to,
  children = 'Back',
  className = '',
  iconSize = 14,
  type = 'button',
  disabled = false,
  ...rest
}) {
  const classNames = `${BTN_BACK_CLASS} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={classNames} {...rest}>
        <ArrowLeft size={iconSize} aria-hidden />
        {children}
      </Link>
    )
  }

  return (
    <ActionButton
      variant="back"
      type={type}
      onClick={onClick}
      disabled={disabled}
      iconSize={iconSize}
      className={className}
      {...rest}
    >
      {children}
    </ActionButton>
  )
}
