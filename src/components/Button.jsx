import { Link } from 'react-router-dom'
import '../styles/Button.css'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  to,
  href,
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false
}) {
  const variants = {
    'primary': 'button--primary',
    'secondary': 'button--secondary',
    'outline': 'button--outline',
    'ghost': 'button--ghost'
  }

  const sizes = {
    'small': 'button--small',
    'medium': 'button--medium',
    'large': 'button--large'
  }

  const className = `button ${variants[variant] || variants.primary} ${sizes[size] || sizes.medium} ${fullWidth ? 'button--full-width' : ''}`

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button 
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button

