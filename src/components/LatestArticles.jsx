import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { getTranslation } from '../data/translations'
import './LatestArticles.css'

export default function LatestArticles() {
    const navigate = useNavigate()
    const { lang, articles, loadingArticles } = useAppContext()
    const [activeTab, setActiveTab] = useState('All')

    if (loadingArticles) {
        return (
            <section className="latest">
                <div className="latest-header">
                    <h2 className="latest-title">{getTranslation('LatestArticles', lang)}</h2>
                </div>
                <div style={{ padding: '2rem 0', opacity: 0.5 }}>Loading feeds...</div>
            </section>
        )
    }

    const tabs = ['All', 'Hardware Launches', 'Software & AI', 'Asia', 'Europe', 'US/Global']

    const filteredArticles = articles.filter(article => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Hardware Launches') return article.type === 'Hardware Launch' || article.category === 'Hardware';
        if (activeTab === 'Software & AI') return article.type === 'Software' || article.category === 'Development';
        if (activeTab === 'Asia') return article.region === 'Asia';
        if (activeTab === 'Europe') return article.region === 'Europe';
        if (activeTab === 'US/Global') return article.region === 'US' || article.region === 'Global';
        return true;
    })

    return (
        <section className="latest">
            <div className="latest-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className="latest-title" style={{ width: '100%' }}>{getTranslation('LatestArticles', lang)}</h2>
                <div className="category-tabs" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.4rem 1rem',
                                borderRadius: '20px',
                                border: '1px solid var(--border)',
                                background: activeTab === tab ? 'var(--primary)' : 'transparent',
                                color: activeTab === tab ? '#fff' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="articles-list">
                {filteredArticles.length === 0 ? (
                    <p style={{ opacity: 0.6 }}>No articles found in this category.</p>
                ) : null}

                {filteredArticles.map((article, i) => (
                    <article
                        key={article.id}
                        className="article-card animate-fade-up"
                        style={{ animationDelay: `${(i % 10) * 0.05}s`, cursor: 'pointer' }}
                        onClick={() => navigate(`/article/${article.id}`)}
                    >
                        <div className="article-image-wrap">
                            <img src={article.imageUrl || article.img} alt={lang === 'bn' && article.title_bn ? article.title_bn : article.title} className="article-image" />
                        </div>
                        <div className="article-body">
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span className="chip">{article.category}</span>
                                <span className="chip" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{article.source}</span>
                            </div>
                            <h3 className="article-title">{lang === 'bn' && article.title_bn ? article.title_bn : article.title}</h3>
                            <p className="article-excerpt">{lang === 'bn' && article.excerpt_bn ? article.excerpt_bn : article.excerpt}</p>
                            <div className="article-meta">
                                <div className="article-author">
                                    <div className="article-avatar">{article.author ? article.author[0] : 'T'}</div>
                                    <div>
                                        <p className="article-author-name">{article.author}</p>
                                        <p className="article-date">{lang === 'bn' && article.date_bn ? article.date_bn : article.date} · {lang === 'bn' && article.readTime_bn ? article.readTime_bn : article.readTime}</p>
                                    </div>
                                </div>
                                <button className="bookmark-btn" aria-label="Bookmark" onClick={e => e.stopPropagation()}>
                                    <span className="material-icons-round">bookmark_border</span>
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
