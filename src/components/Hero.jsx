import { useNavigate } from 'react-router-dom'
import { ARTICLES } from '../data/articles'
import './Hero.css'

const FEATURED = ARTICLES[0] // Nothing Phone 4a is always first = featured

export default function Hero() {
    const navigate = useNavigate()

    return (
        <section className="hero">
            <div className="container">
                {/* Category pills */}
                <div className="hero-pills animate-fade-in">
                    {['AI', 'Development', 'Design', 'Hardware', 'Startups'].map(c => (
                        <a key={c} href="#" className="pill">{c}</a>
                    ))}
                </div>

                {/* Featured card */}
                <div
                    className="hero-card animate-fade-up"
                    onClick={() => navigate(`/article/${FEATURED.id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="hero-image-wrap">
                        <img
                            src={FEATURED.img}
                            alt={FEATURED.title}
                            className="hero-image"
                        />
                        <div className="hero-image-overlay" />
                        <span className="hero-badge">
                            <span className="live-dot" />
                            Featured
                        </span>
                    </div>
                    <div className="hero-content">
                        <span className="chip dark">{FEATURED.category}</span>
                        <h1 className="hero-title">{FEATURED.title}</h1>
                        <p className="hero-excerpt">{FEATURED.excerpt}</p>
                        <div className="hero-meta">
                            <div className="hero-author">
                                <div className="author-avatar">{FEATURED.author[0]}</div>
                                <div>
                                    <p className="author-name">{FEATURED.author}</p>
                                    <p className="hero-date">{FEATURED.date} · {FEATURED.readTime}</p>
                                </div>
                            </div>
                            <button
                                className="btn-read"
                                onClick={e => { e.stopPropagation(); navigate(`/article/${FEATURED.id}`) }}
                            >
                                Read Article
                                <span className="material-icons-round">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
