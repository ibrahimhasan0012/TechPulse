import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { getTranslation } from '../data/translations'
import './Hero.css'
export default function Hero() {
    const navigate = useNavigate()
    const { lang, articles, loadingArticles } = useAppContext()

    if (loadingArticles || !articles || articles.length === 0) {
        return <section className="hero"><div className="container" style={{ padding: '4rem 0', opacity: 0.5, textAlign: 'center' }}>Loading featured narrative...</div></section>
    }

    const FEATURED = articles[0]

    return (
        <section className="hero">
            <div className="container">
                {/* Removed Category pills */}
                {/* Featured card */}
                <div
                    className="hero-card animate-fade-up"
                    onClick={() => navigate(`/article/${FEATURED.id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="hero-image-wrap">
                        <img
                            src={FEATURED.imageUrl || FEATURED.img}
                            alt={FEATURED.title}
                            className="hero-image"
                        />
                        <div className="hero-image-overlay" />
                        <span className="hero-badge">
                            <span className="live-dot" />
                            {getTranslation('Featured', lang)}
                        </span>
                    </div>
                    <div className="hero-content">
                        <span className="chip dark">{getTranslation(FEATURED.category, lang)}</span>
                        <h1 className="hero-title">{lang === 'bn' && FEATURED.title_bn ? FEATURED.title_bn : FEATURED.title}</h1>
                        <p className="hero-excerpt">
                            {lang === 'bn' ? (FEATURED.bangla_paragraph1 || FEATURED.excerpt_bn || FEATURED.excerpt) : (FEATURED.paragraph1 || FEATURED.excerpt)}
                        </p>
                        <div className="hero-meta">
                            <div className="hero-author">
                                <div className="author-avatar">{FEATURED.author[0]}</div>
                                <div>
                                    <p className="author-name">{lang === 'bn' && FEATURED.author_bn ? FEATURED.author_bn : FEATURED.author}</p>
                                    <p className="hero-date">{lang === 'bn' && FEATURED.date_bn ? FEATURED.date_bn : FEATURED.date} · {FEATURED.readTime}</p>
                                </div>
                            </div>
                            <button
                                className="btn-read"
                                onClick={e => { e.stopPropagation(); navigate(`/article/${FEATURED.id}`) }}
                            >
                                {getTranslation('ReadArticle', lang)}
                                <span className="material-icons-round">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
