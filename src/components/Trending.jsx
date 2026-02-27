import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { getTranslation } from '../data/translations'
import './Trending.css'

export default function Trending() {
    const { lang, articles, loadingArticles } = useAppContext()

    if (loadingArticles) {
        return <div className="trending-card" style={{ opacity: 0.5 }}>Loading trending...</div>
    }

    // Dynamically calculate trending by getting the top 3 newest articles
    const trendingList = [...articles]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)

    return (
        <div className="trending-card">
            <div className="trending-header">
                <span className="material-icons-round trending-icon">trending_up</span>
                <h3 className="trending-title">{getTranslation('TrendingNow', lang)}</h3>
            </div>
            <ul className="trending-list">
                {trendingList.map((item, i) => {
                    const title = lang === 'bn' && item.title_bn ? item.title_bn : item.title;
                    const category = getTranslation(item.category, lang);
                    const author = lang === 'bn' && item.author_bn ? item.author_bn : item.author;
                    const dateDesc = lang === 'bn' && item.date_bn ? item.date_bn : item.date;

                    return (
                        <li key={item.id} className="trending-item">
                            <span className="trending-num">{String(i + 1).padStart(2, '0')}</span>
                            <div className="trending-content">
                                <Link to={`/article/${item.id}`} className="trending-label">
                                    {title}
                                </Link>
                                <div className="trending-meta">
                                    <span className="badge">{category}</span>
                                    <span className="trending-time">{dateDesc}</span>
                                </div>
                                {author && (
                                    <span className="trending-author">
                                        {getTranslation('By', lang)} {author}
                                    </span>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
