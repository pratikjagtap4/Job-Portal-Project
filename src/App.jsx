import { Outlet } from 'react-router-dom'
import './App.css'
import { ThemeProvider } from './components/ThemeProvider'
import { Footer, Header } from './components'


function App() {


  return (
    <>
      <ThemeProvider defaultTheme='dark'>

        <div className="grid-background"></div>
        <main className='min-h-screen container'>
          <Header />
          <Outlet />

        </main>
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default App
