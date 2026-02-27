import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { getTranslation } from '../data/translations'
import './LatestArticles.css'

export default function LatestArticles() {
    const navigate = useNavigate()
    const { lang, articles, loadingArticles } = useAppContext()

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

    return (
        <section className="latest">
            <div className="latest-header">
                <h2 className="latest-title">{getTranslation('LatestArticles', lang)}</h2>
                <a href="#" className="view-all">
                    View All
                    <span className="material-icons-round">chevron_right</span>
                </a>
            </div>
            <div className="articles-list">
                {articles.map((article, i) => (
                    <article
                        key={article.id}
                        className="article-card animate-fade-up"
                        style={{ animationDelay: `${i * 0.08}s`, cursor: 'pointer' }}
                        onClick={() => navigate(`/article/${article.id}`)}
                    >
                        <div className="article-image-wrap">
                            <img src={article.imageUrl || article.img} alt={lang === 'bn' && article.title_bn ? article.title_bn : article.title} className="article-image" />
                        </div>
                        <div className="article-body">
                            <span className="chip">{article.category}</span>
                            <h3 className="article-title">{lang === 'bn' && article.title_bn ? article.title_bn : article.title}</h3>
                            <p className="article-excerpt">{lang === 'bn' && article.excerpt_bn ? article.excerpt_bn : article.excerpt}</p>
                            <div className="article-meta">
                                <div className="article-author">
                                    <div className="article-avatar">{article.author[0]}</div>
                                    <div>
                                        <p className="article-author-name">{article.author}</p>
                                        <p className="article-date">{article.date} · {article.readTime}</p>
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
