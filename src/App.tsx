import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { ThemeProvider } from './Context/ThemeContext'

function App() {

  return (
    <>
    <ThemeProvider>
    <RouterProvider router={router} />
    </ThemeProvider>
    </>
  )
}

export default App
