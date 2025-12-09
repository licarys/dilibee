import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Buscar from './pages/Buscar'
import CrearDiligencia from './pages/CrearDiligencia'
import Historial from './pages/Historial'
import HistorialGestor from './pages/HistorialGestor'
import Perfil from './pages/Perfil'
import Seguimiento from './pages/Seguimiento'
import Login from './pages/Login'
import GestorDashboard from './pages/GestorDashboard'
import { getTipoUsuario } from './utils/auth'
import './App.css'

// Componente que decide qué mostrar en la ruta "/"
function HomeRoute() {
  const tipoUsuario = getTipoUsuario()
  
  if (tipoUsuario === 'gestor') {
    return <GestorDashboard />
  }
  
  return <Home />
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/crear-diligencia" element={<CrearDiligencia />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/historial-gestor" element={<HistorialGestor />} />
            <Route path="/seguimiento/:id" element={<Seguimiento />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/gestor" element={<GestorDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

