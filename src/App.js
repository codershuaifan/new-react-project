import React from 'react'
import routes from './routes'
import { useRoutes } from 'react-router-dom'
import './utils/axios'

import './App.css'

export default function App() {
  const element = useRoutes(routes)
  return (
    <>
      {element}
    </>
  )
}
