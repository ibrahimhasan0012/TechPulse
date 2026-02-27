import { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { getTranslation } from '../data/translations'
import './Navbar.css'

const navLinks = ['Home', 'Technology', 'AI', 'Development', 'Design']

export default function Navbar() {
    const { theme, toggleTheme, lang, toggleLang } = useAppContext()
    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState('Home')
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-inner">
                {/* Logo */}
                <a href="#" className="navbar-logo">
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
                            href="#"
                            className={`nav-link ${active === link ? 'active' : ''}`}
                            onClick={() => setActive(link)}
                        >
                            {getTranslation(link, lang)}
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
                        href="#"
                        className={`mobile-nav-link ${active === link ? 'active' : ''}`}
                        onClick={() => { setActive(link); setMenuOpen(false) }}
                    >
                        {getTranslation(link, lang)}
                    </a>
                ))}
            </div>
        </header>
    )
}
