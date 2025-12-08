import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import ServiceCard from '../components/ServiceCard'
import TestimonialCard from '../components/TestimonialCard'
import serviciosData from '../data/servicios.json'
import testimoniosData from '../data/testimonios.json'
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
      {/* Elementos decorativos animados */}
      <div className="home__decoration home__decoration--1">🐝</div>
      <div className="home__decoration home__decoration--2">🚀</div>
      <div className="home__decoration home__decoration--3">📦</div>
      <div className="home__decoration home__decoration--4">✓</div>
      
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
        <StatCard
          icon="📋"
          number={`${stats.diligencias.toLocaleString()}+`}
          label="Diligencias completadas"
          color="gold"
        />
        <StatCard
          icon="👥"
          number={`${stats.gestores}+`}
          label="Gestores activos"
          color="gold"
        />
        <StatCard
          icon="⭐"
          number={stats.satisfaccion}
          label="Calificación promedio"
          color="gold"
        />
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

      <section className="home__services">
        <h2 className="home__section-title">Servicios Populares</h2>
        <div className="home__services-grid">
          {serviciosData.map(servicio => (
            <ServiceCard
              key={servicio.id}
              icon={servicio.icon}
              title={servicio.title}
              description={servicio.description}
              popular={servicio.popular}
            />
          ))}
        </div>
      </section>

      <section className="home__testimonials">
        <h2 className="home__section-title">Lo que Dicen Nuestros Usuarios</h2>
        <div className="home__testimonials-grid">
          {testimoniosData.map(testimonio => (
            <TestimonialCard
              key={testimonio.id}
              name={testimonio.name}
              role={testimonio.role}
              avatar={testimonio.avatar}
              rating={testimonio.rating}
              comment={testimonio.comment}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home

