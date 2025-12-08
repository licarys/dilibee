import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Buscar from './pages/Buscar'
import CrearDiligencia from './pages/CrearDiligencia'
import Historial from './pages/Historial'
import Perfil from './pages/Perfil'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/crear-diligencia" element={<CrearDiligencia />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

