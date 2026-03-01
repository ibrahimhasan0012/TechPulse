import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Home from './components/Home'
import ArticlePage from './components/ArticlePage'
import CategoryPage from './components/CategoryPage'
import './App.css'

function HomePage() {
  return (
    <>
      <Hero />
      <Home />
    </>
  )
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
