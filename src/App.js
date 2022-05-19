import React from 'react'
// import routes from './routes'
import useElement from './routes/useElement'
import { useRoutes } from 'react-router-dom'
import './utils/axios'

import './App.css'

export default function App() {
  // const element = useRoutes(routes)
  const element = useRoutes(useElement())
  return (
    <>
      {element}
    </>
  )
}
