import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// Simple helper to map regions to emojis
const getRegionBadge = (region) => {
    switch (region) {
        case 'Bangladesh': return '🇧🇩 Bangladesh';
        case 'India': return '🇮🇳 India';
        case 'Pakistan': return '🇵🇰 Pakistan';
        case 'Global': return '🌍 Global';
        case 'Europe': return '🇪🇺 Europe';
        case 'Asia-Pacific': return '🌏 Asia-Pacific';
        case 'US': return '🇺🇸 US';
        default: return '🌍 Global';
    }
};

export default function ArticleCard({ article, index = 0 }) {
    const navigate = useNavigate();
    const { lang } = useAppContext();

    return (
        <article
            className="article-card animate-fade-up"
            style={{ animationDelay: `${(index % 10) * 0.05}s`, cursor: 'pointer' }}
            onClick={() => navigate(`/article/${article.id}`)}
        >
            <div className="article-image-wrap">
                <img
                    src={article.imageUrl || article.img}
                    alt={lang === 'bn' && article.title_bn ? article.title_bn : article.title}
                    className="article-image"
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {getRegionBadge(article.region)}
                </div>
            </div>

            <div className="article-body">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="chip">{article.category}</span>
                    <span className="chip" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        {article.source}
                    </span>
                    {article.alsoReportedBy && article.alsoReportedBy.length > 0 && (
                        <span className="chip" style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                            +{article.alsoReportedBy.length} more
                        </span>
                    )}
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
    );
}
