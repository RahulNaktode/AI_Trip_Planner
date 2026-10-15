import Home from './pages/Home'
import React from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard.jsx'
import BudgetEstimator from './pages/BudgetEstimator'
import SavedTrips from './pages/SavedTrips'
import TripDetail from './pages/TripDetail'
import TripPlanner from './pages/TripPlanner'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { useAuth } from './context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import { Toaster } from 'react-hot-toast'

function App() {
  const { user, loading } = useAuth();

  const PageWrapper = ({ children }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className='relative z-10'
      >
        {children}
      </motion.div>
    )
  };

  const Privateroute = ({ children }) => {
    const { user, loading } = useAuth();

    // if (loading) return <LoadingScreen />

    return user ? (
      <PageWrapper>{children}</PageWrapper>
    ) : (
      <Navigate to={'/login'} replace />
    )
  }

  const Publicroute = ({ children }) => {
    const { user, loading } = useAuth();

    // if (loading) return <LoadingScreen />

    return user ? (
      <Navigate to={'/dashboard'} replace />
    ) : (
      <PageWrapper>{children}</PageWrapper>
    )
  }

  return (
    <BrowserRouter>
      <Toaster
        position='bottom-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(15, 23, 42, 0.8)",
            color: "#fff",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            boxShadow: "0 10px 15px -3px rbga(0, 0, 0, 0.5)"
          }
        }}
      />
      <div className='min-h-screen bg-[#020203] text-gray-400 font-sans selection:bg-blue-600 selection:text-white 
      overflow-hidden'>
        <AnimatePresence mode='wait'>
          <Routes>
            <Route
              path='/'
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path='/login'
              element={
                <Publicroute>
                  <Login />
                </Publicroute>
              }
            />
            <Route
              path='/register'
              element={
                <Publicroute>
                  <Register />
                </Publicroute>
              }
            />
            <Route
              path='/dashboard'
              element={
                <Privateroute>
                  <Dashboard />
                </Privateroute>
              }
            />
            <Route
              path='/plan'
              element={
                <Privateroute>
                  <TripPlanner />
                </Privateroute>
              }
            />
            <Route
              path='/budget'
              element={
                <Privateroute>
                  <BudgetEstimator />
                </Privateroute>
              }
            />
            <Route
              path='/trips'
              element={
                <Privateroute>
                  <SavedTrips />
                </Privateroute>
              }
            />
            <Route
              path='/trip/:id'
              element={
                <Privateroute>
                  <TripDetail />
                </Privateroute>
              }
            />
            <Route path='*' element={<Navigate />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}

export default App
