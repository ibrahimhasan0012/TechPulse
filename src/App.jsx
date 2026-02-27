import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import LatestArticles from './components/LatestArticles'
import Trending from './components/Trending'
import Newsletter from './components/Newsletter'
import ArticlePage from './components/ArticlePage'
import './App.css'

function HomePage() {
  return (
    <>
      <Hero />
      <section className="content-section">
        <div className="container content-grid">
          <div className="main-col">
            <LatestArticles />
          </div>
          <aside className="side-col">
            <Trending />
            <Newsletter />
          </aside>
        </div>
      </section>
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
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
