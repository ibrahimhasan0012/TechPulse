import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { getTranslation } from '../data/translations'
import './ArticlePage.css'

function SpecTable({ title, items }) {
    return (
        <div className="spec-table-wrap">
            <h4 className="spec-table-title">{title}</h4>
            <table className="spec-table">
                <tbody>
                    {items.map(([label, value]) => (
                        <tr key={label}>
                            <td className="spec-label">{label}</td>
                            <td className="spec-value">{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function ArticleContent({ blocks }) {
    return (
        <div className="article-content">
            {blocks.map((block, i) => {
                switch (block.type) {
                    case 'lead':
                        return <p key={i} className="content-lead">{block.text}</p>
                    case 'paragraph':
                        return <p key={i} className="content-paragraph">{block.text}</p>
                    case 'h2':
                        return <h2 key={i} className="content-h2">{block.text}</h2>
                    case 'image':
                        return (
                            <figure key={i} className="content-figure">
                                <img src={block.src} alt={block.caption} className="content-img" />
                                <figcaption className="content-caption">{block.caption}</figcaption>
                            </figure>
                        )
                    case 'specs':
                        return <SpecTable key={i} title={block.title} items={block.items} />
                    case 'youtube':
                        return (
                            <div key={i} className="video-section">
                                {block.title && <h3 className="video-title">{block.title}</h3>}
                                <div className="video-container">
                                    <iframe
                                        width="100%"
                                        height="600"
                                        src={`https://www.youtube.com/embed/${block.videoId}`}
                                        title={block.title || "YouTube video player"}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                            </div>
                        )
                    default:
                        return null
                }
            })}
        </div>
    )
}

export default function ArticlePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { lang, articles, loadingArticles } = useAppContext()

    useEffect(() => { window.scrollTo(0, 0) }, [id])

    if (loadingArticles) {
        return <div className="article-page" style={{ textAlign: 'center', padding: '100px', opacity: 0.5 }}>Loading...</div>
    }

    const article = articles.find(a => String(a.id) === String(id));

    if (!article) {
        return (
            <div className="article-not-found">
                <span className="material-icons-round">article</span>
                <h2>{getTranslation('ArticleNotFound', lang)}</h2>
                <button onClick={() => navigate('/')}>{getTranslation('BackToHome', lang)}</button>
            </div>
        )
    }

    const related = articles.filter(a => a.id !== id && a.category === article.category).slice(0, 2)

    return (
        <div className="article-page">
            {/* Hero banner */}
            <div className="article-hero" style={{ backgroundImage: `url(${article.imageUrl || article.img})` }}>
                <div className="article-hero-overlay" />
                <div className="container article-hero-content">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <span className="material-icons-round">arrow_back</span>
                        {getTranslation('Back', lang)}
                    </button>
                    <span className="chip dark">{article.category}</span>
                    <h1 className="article-page-title">{lang === 'bn' && article.title_bn ? article.title_bn : article.title}</h1>
                    <div className="article-page-meta">
                        <div className="article-page-author">
                            <div className="page-author-avatar">{article.author[0]}</div>
                            <div>
                                <p className="page-author-name">{article.author}</p>
                                <p className="page-author-date">{article.date} · {article.readTime}</p>
                            </div>
                        </div>
                        <div className="article-page-actions">
                            <button className="action-btn" aria-label="Share">
                                <span className="material-icons-round">share</span>
                            </button>
                            <button className="action-btn" aria-label="Bookmark">
                                <span className="material-icons-round">bookmark_border</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article body */}
            <div className="container article-layout">
                <article className="article-body-col">
                    <ArticleContent blocks={(lang === 'bn' && article.content_bn) ? article.content_bn : (article.content || [])} />

                    {article.url && article.source && (
                        <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>
                            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '14px 28px', background: 'var(--accent)', color: 'white', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', transition: 'var(--transition)' }}>
                                {lang === 'bn' ? 'মূল ওয়েবসাইটে পড়ুন' : `Read Full Article on ${article.source}`}
                            </a>
                        </div>
                    )}

                    {/* Author card */}
                    <div className="author-card">
                        <div className="author-card-avatar">{article.author[0]}</div>
                        <div>
                            <p className="author-card-name">{article.author}</p>
                            <p className="author-card-bio">{article.authorBio}</p>
                        </div>
                    </div>
                </article>

                {/* Sidebar */}
                <aside className="article-sidebar">
                    {/* Quick specs for hardware articles */}
                    {article.category === 'Hardware' && (article.id === 'nothing-phone-4a' || article.id === 'samsung-galaxy-s26-ultra') && (
                        <div className="sidebar-card">
                            <h4 className="sidebar-card-title">
                                <span className="material-icons-round">memory</span>
                                {getTranslation('QuickSpecs', lang)}
                            </h4>
                            <ul className="quick-specs">
                                {(article.id === 'samsung-galaxy-s26-ultra' ? [
                                    ['Display', '6.9" QHD+ AMOLED, 120Hz'],
                                    ['Chip', 'Snapdragon 8 Elite Gen 5'],
                                    ['RAM', 'Up to 20GB'],
                                    ['Storage', 'Up to 2TB'],
                                    ['Battery', '5,000mAh, 60W'],
                                    ['OS', 'Android 16, One UI 8.5'],
                                    ['Build', '7.9mm, 214g'],
                                    ['Launch', 'March 11, 2026'],
                                ] : [
                                    ['Display', '6.7" 1.5K AMOLED, 120Hz'],
                                    ['Chip', 'Snapdragon 7s Gen 4'],
                                    ['RAM', 'Up to 12GB'],
                                    ['Storage', 'Up to 256GB'],
                                    ['Battery', '5100mAh, 50W'],
                                    ['OS', 'Android 16, NothingOS 4.0'],
                                    ['IP Rating', 'IP65'],
                                    ['Launch', 'March 5, 2026'],
                                ]).map(([k, v]) => (
                                    <li key={k} className="quick-spec-row">
                                        <span className="qs-label">{k}</span>
                                        <span className="qs-value">{v}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {/* Related articles */}
                    {related.length > 0 && (
                        <div className="sidebar-card">
                            <h4 className="sidebar-card-title">
                                <span className="material-icons-round">library_books</span>
                                {getTranslation('Related', lang)}
                            </h4>
                            <div className="related-list">
                                {related.map(a => (
                                    <div
                                        key={a.id}
                                        className="related-item"
                                        onClick={() => navigate(`/article/${a.id}`)}
                                    >
                                        <img src={a.imageUrl || a.img} alt={a.title} className="related-img" />
                                        <div>
                                            <p className="related-title">{lang === 'bn' && a.title_bn ? a.title_bn : a.title}</p>
                                            <p className="related-date">{a.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    )
}
