import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
    const [summaryLang, setSummaryLang] = useState('en')

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
                    {/* Render new AI summary if it exists */}
                    {article.summary && (
                        <div className="ai-summary" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', borderLeft: '5px solid var(--primary)', marginBottom: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <div className="ai-summary-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.95rem', letterSpacing: '1px' }}>
                                <span className="material-icons-round" style={{ fontSize: '1.4rem' }}>auto_awesome</span>
                                AI SUMMARY BRIEF
                            </div>

                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: '500' }}>
                                {summaryLang === 'en' ? article.summary : (article.summary_bn || article.summary)}
                            </p>

                            {article.summary_bn && (
                                <button
                                    onClick={() => setSummaryLang(prev => prev === 'en' ? 'bn' : 'en')}
                                    style={{ background: 'var(--bg-primary)', border: '2px solid var(--primary)', color: 'var(--primary)', padding: '8px 20px', borderRadius: '25px', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', transition: 'all 0.2s ease' }}
                                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                >
                                    <span className="material-icons-round" style={{ fontSize: '1.2rem' }}>translate</span>
                                    {summaryLang === 'en' ? 'Toggle to Bangla' : 'Toggle to English'}
                                </button>
                            )}

                            <hr style={{ border: 'none', borderTop: '2px dashed var(--border)', margin: '2rem 0' }} />

                            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <span>Summary generated by OpenAI on {article.date}</span>
                                {article.url && article.source && (
                                    <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Read Full Article <span className="material-icons-round" style={{ fontSize: '1.1rem' }}>open_in_new</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Fallback to legacy blocks if needed */}
                    {!article.summary && (
                        <ArticleContent blocks={(lang === 'bn' && article.content_bn) ? article.content_bn : (article.content || [])} />
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
