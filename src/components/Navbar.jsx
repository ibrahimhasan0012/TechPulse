import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { getTranslation } from '../data/translations'
import './Navbar.css'

export default function Navbar() {
    const { theme, toggleTheme, lang, toggleLang, articles } = useAppContext()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    // Dynamic Categories
    const categories = Array.from(new Set(articles.map(a => a.category))).filter(Boolean).slice(0, 4)
    const navLinks = ['Home', ...categories]

    // Determine active route
    const activeRoute = location.pathname === '/' ? 'Home' : decodeURIComponent(location.pathname.split('/').pop())

    const handleNavClick = (e, link) => {
        e.preventDefault()
        setMenuOpen(false)
        if (link === 'Home') navigate('/')
        else navigate(`/category/${encodeURIComponent(link)}`)
    }

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-inner">
                {/* Logo */}
                <a href="/" onClick={(e) => handleNavClick(e, 'Home')} className="navbar-logo">
                    <div className="logo-icon">
                        <span className="material-icons-round">bolt</span>
                    </div>
                    <span className="logo-text">TechPulse</span>
                </a>

                {/* Desktop Nav */}
                <nav className="navbar-links">
                    {navLinks.map(link => (
                        <a
                            key={link}
                            href={link === 'Home' ? '/' : `/category/${encodeURIComponent(link)}`}
                            className={`nav-link ${activeRoute === link ? 'active' : ''}`}
                            onClick={(e) => handleNavClick(e, link)}
                        >
                            {link === 'Home' ? getTranslation('Home', lang) : link}
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="navbar-actions">
                    <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
                        <span className="material-icons-round">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <button className="lang-toggle" onClick={toggleLang} aria-label="Toggle Language">
                        {lang.toUpperCase()}
                    </button>
                    <button className="icon-btn" aria-label="Search">
                        <span className="material-icons-round">search</span>
                    </button>
                    <button className="icon-btn" aria-label="Bookmarks">
                        <span className="material-icons-round">bookmark_border</span>
                    </button>
                    <button className="btn-subscribe">{getTranslation('Subscribe', lang)}</button>
                    <button
                        className="hamburger"
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label="Menu"
                    >
                        <span className="material-icons-round">{menuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                {navLinks.map(link => (
                    <a
                        key={link}
                        href={link === 'Home' ? '/' : `/category/${encodeURIComponent(link)}`}
                        className={`mobile-nav-link ${activeRoute === link ? 'active' : ''}`}
                        onClick={(e) => handleNavClick(e, link)}
                    >
                        {link === 'Home' ? getTranslation('Home', lang) : link}
                    </a>
                ))}
            </div>
        </header>
    )
}
