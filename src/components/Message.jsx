import '../styles/Message.css'

function Message({ tipo = 'info', mensaje, onClose }) {
  const tipos = {
    'success': 'message--success',
    'error': 'message--error',
    'warning': 'message--warning',
    'info': 'message--info'
  }

  const iconos = {
    'success': '✓',
    'error': '✗',
    'warning': '⚠',
    'info': 'ℹ'
  }

  return (
    <div className={`message ${tipos[tipo] || tipos.info}`}>
      <span className="message__icon">{iconos[tipo] || iconos.info}</span>
      <span className="message__text">{mensaje}</span>
      {onClose && (
        <button 
          className="message__close"
          onClick={onClose}
          aria-label="Cerrar mensaje"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Message

