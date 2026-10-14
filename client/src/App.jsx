import Home from './pages/Home'
import React from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BudgetEstimator from './pages/BudgetEstimator'
import SavedTrips from './pages/SavedTrips'
import TripDetail from './pages/TripDetail'
import TripPlanner from './pages/TripPlanner'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading } = useAuth();

  return (
      <BrowserRouter>
        <div className='min-h-screen bg-[#020203] text-gray-400 font-sans selection:bg-blue-600 selection:text-white overflow-hidden'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/plan' element={<TripPlanner />} />
            <Route path='/budget' element={<BudgetEstimator />} />
            <Route path='/trips' element={<SavedTrips />} />
            <Route path='/trip/:id' element={<TripDetail />} />
            <Route path='*' element={<Navigate />} />
          </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App
