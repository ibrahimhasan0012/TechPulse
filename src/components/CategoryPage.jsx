import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ArticleCard from './ArticleCard';
import Trending from './Trending';
import Newsletter from './Newsletter';
import { getTranslation } from '../data/translations';
import './LatestArticles.css';

export default function CategoryPage() {
    const { name } = useParams();
    const { lang, articles, loadingArticles } = useAppContext();

    if (loadingArticles) {
        return <div style={{ padding: '6rem', textAlign: 'center', opacity: 0.5 }}>Loading {name}...</div>;
    }

    // Filter articles based on category parameter 
    // Example: parameter name might be 'Hardware', or 'AI'
    const categoryArticles = articles.filter(a => a.category === name);

    return (
        <section className="content-section" style={{ minHeight: '80vh' }}>
            <div className="container content-grid">
                <div className="main-col">
                    <div className="feed-block" style={{ marginTop: '1rem' }}>
                        <h2 className="latest-title" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                            {name}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
                            {getTranslation('CoveringAll', lang)} {name} {getTranslation('News', lang)}
                        </p>

                        {categoryArticles.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                No articles found in this category.
                            </div>
                        ) : (
                            <div className="articles-list">
                                {categoryArticles.map((article, i) => (
                                    <ArticleCard key={article.id} article={article} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="side-col">
                    <Trending />
                    <Newsletter />
                </aside>
            </div>
        </section>
    );
}
