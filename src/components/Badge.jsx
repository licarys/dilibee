import '../styles/Badge.css'

function Badge({ children, variant = 'default', size = 'medium' }) {
  const variants = {
    'default': 'badge--default',
    'success': 'badge--success',
    'warning': 'badge--warning',
    'error': 'badge--error',
    'info': 'badge--info'
  }

  const sizes = {
    'small': 'badge--small',
    'medium': 'badge--medium',
    'large': 'badge--large'
  }

  return (
    <span className={`badge ${variants[variant] || variants.default} ${sizes[size] || sizes.medium}`}>
      {children}
    </span>
  )
}

export default Badge

