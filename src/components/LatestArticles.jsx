import { useNavigate } from 'react-router-dom'
import { ARTICLES } from '../data/articles'
import './LatestArticles.css'

export default function LatestArticles() {
    const navigate = useNavigate()

    return (
        <section className="latest">
            <div className="latest-header">
                <h2 className="latest-title">Latest Articles</h2>
                <a href="#" className="view-all">
                    View All
                    <span className="material-icons-round">chevron_right</span>
                </a>
            </div>
            <div className="articles-list">
                {ARTICLES.map((article, i) => (
                    <article
                        key={article.id}
                        className="article-card animate-fade-up"
                        style={{ animationDelay: `${i * 0.08}s`, cursor: 'pointer' }}
                        onClick={() => navigate(`/article/${article.id}`)}
                    >
                        <div className="article-image-wrap">
                            <img src={article.img} alt={article.title} className="article-image" />
                        </div>
                        <div className="article-body">
                            <span className="chip">{article.category}</span>
                            <h3 className="article-title">{article.title}</h3>
                            <p className="article-excerpt">{article.excerpt}</p>
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
