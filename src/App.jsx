import { Routes, Route, NavLink } from 'react-router-dom'
import Overview from './pages/Overview'
import FinancialHub from './pages/FinancialHub'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <nav className="top-nav">
        <span className="brand">Life Dashboard</span>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Overview
          </NavLink>
          <NavLink to="/financial" className={({ isActive }) => (isActive ? 'active' : '')}>
            Financial
          </NavLink>
        </div>
      </nav>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/financial" element={<FinancialHub />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
