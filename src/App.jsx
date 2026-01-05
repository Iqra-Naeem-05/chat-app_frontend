import React from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { SocketProvider } from './context/SocketContext'
import { AuthProvider } from './context/AuthContext'
import { LoaderProvider } from './context/LoaderContext'

function App() {

  return (
    <>
      <LoaderProvider>
        <AuthProvider>
          <SocketProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SocketProvider>
        </AuthProvider>
      </LoaderProvider>
    </>
  )
}

export default App
