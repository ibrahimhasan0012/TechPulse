import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LatestArticles from './components/LatestArticles'
import Trending from './components/Trending'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
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
      </main>
      <Footer />
    </div>
  )
}

export default App
