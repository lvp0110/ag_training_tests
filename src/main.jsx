import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Tests from './pages/Tests.jsx'
import Card from './pages/Card.jsx'
import Solution from './pages/Solution.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Navigate to="/card" replace />} />
          <Route path='tests' element={<Tests />} />
          <Route path='card' element={<Card />} />
          <Route path='solution' element={<Solution />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
