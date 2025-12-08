import '../styles/Loading.css'

function Loading({ mensaje = 'Cargando...' }) {
  return (
    <div className="loading">
      <div className="loading__spinner"></div>
      <p className="loading__mensaje">{mensaje}</p>
    </div>
  )
}

export default Loading

