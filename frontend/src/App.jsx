import { useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import SidebarLayout from './layout/SidebarLayout'
import Landing from './pages/Landing'
import ReportsPage from './pages/ReportsPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import { createAppTheme } from './theme/theme'

function AppRoutes({ mode, onToggleMode }) {
  const { login } = useAuth()
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={login} />} />
      <Route path="/*" element={
        <SidebarLayout mode={mode} onToggleMode={onToggleMode}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </SidebarLayout>
      } />
    </Routes>
  )
}

function App() {
  const [mode, setMode] = useState('light')
  const theme = createAppTheme(mode)

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes mode={mode} onToggleMode={() => setMode((m) => m === 'light' ? 'dark' : 'light')} />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
