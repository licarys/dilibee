import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.css'

function Home() {
  const [stats, setStats] = useState({
    diligencias: 0,
    gestores: 0,
    satisfaccion: 0
  })

  useEffect(() => {
    // Simulación de datos - en producción vendría de una API
    setStats({
      diligencias: 1250,
      gestores: 85,
      satisfaccion: 4.8
    })
  }, [])

  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__title">DiliBee</h1>
        <p className="home__subtitle">Diligencias rápidas a tu alcance</p>
        <p className="home__description">
          Conectamos personas que necesitan resolver trámites urgentes con gestores verificados
          que pueden realizarlos de manera segura y eficiente.
        </p>
        <div className="home__actions">
          <Link to="/crear-diligencia" className="home__button home__button--primary">
            Crear Diligencia
          </Link>
          <Link to="/buscar" className="home__button home__button--secondary">
            Buscar Gestores
          </Link>
        </div>
      </section>

      <section className="home__stats">
        <div className="home__stat">
          <h3 className="home__stat-number">{stats.diligencias.toLocaleString()}+</h3>
          <p className="home__stat-label">Diligencias completadas</p>
        </div>
        <div className="home__stat">
          <h3 className="home__stat-number">{stats.gestores}+</h3>
          <p className="home__stat-label">Gestores activos</p>
        </div>
        <div className="home__stat">
          <h3 className="home__stat-number">⭐ {stats.satisfaccion}</h3>
          <p className="home__stat-label">Calificación promedio</p>
        </div>
      </section>

      <section className="home__features">
        <h2 className="home__features-title">¿Cómo funciona?</h2>
        <div className="home__features-grid">
          <div className="home__feature">
            <div className="home__feature-icon">1️⃣</div>
            <h3 className="home__feature-title">Solicita</h3>
            <p className="home__feature-text">
              Describe tu diligencia y ubica puntos de inicio y destino
            </p>
          </div>
          <div className="home__feature">
            <div className="home__feature-icon">2️⃣</div>
            <h3 className="home__feature-title">Asigna</h3>
            <p className="home__feature-text">
              Se notifica a gestores cercanos y seleccionamos el mejor
            </p>
          </div>
          <div className="home__feature">
            <div className="home__feature-icon">3️⃣</div>
            <h3 className="home__feature-title">Realiza</h3>
            <p className="home__feature-text">
              Sigue el progreso en tiempo real y recibe tu diligencia
            </p>
          </div>
          <div className="home__feature">
            <div className="home__feature-icon">4️⃣</div>
            <h3 className="home__feature-title">Evalúa</h3>
            <p className="home__feature-text">
              Realiza el pago seguro y califica el servicio recibido
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

