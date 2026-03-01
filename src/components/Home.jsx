import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ArticleCard from './ArticleCard';
import Trending from './Trending';
import Newsletter from './Newsletter';
import { getTranslation } from '../data/translations';
import './LatestArticles.css';

export default function Home() {
    const { lang, articles, loadingArticles } = useAppContext();

    if (loadingArticles) {
        return <div style={{ padding: '6rem', textAlign: 'center', opacity: 0.5 }}>Loading Regional Feeds...</div>;
    }

    // Dynamic 60/40 Split Enforced Sorting
    const southAsiaArticles = articles.filter(a => ['Bangladesh', 'India', 'Pakistan'].includes(a.region));
    const globalArticles = articles.filter(a => !['Bangladesh', 'India', 'Pakistan'].includes(a.region));

    const saFeatured = southAsiaArticles.slice(0, 3);
    const globalFeatured = globalArticles.slice(0, 3);

    const bangladeshFeed = southAsiaArticles.filter(a => a.region === 'Bangladesh').slice(0, 4);
    const indiaFeed = southAsiaArticles.filter(a => a.region === 'India').slice(0, 4);
    const pakistanFeed = southAsiaArticles.filter(a => a.region === 'Pakistan').slice(0, 4);

    const [visibleArticles, setVisibleArticles] = useState(9);
    const globalFeed = globalArticles.slice(3, visibleArticles);

    const handleLoadMore = () => {
        setVisibleArticles(prev => prev + 6);
    };

    return (
        <section className="content-section">
            <div className="container content-grid">
                <div className="main-col">

                    {/* SCROLL LATER: Add category tabs here if desired, right now honoring strict layout */}

                    {saFeatured.length > 0 && (
                        <div className="feed-block">
                            <h2 className="latest-title" style={{ color: 'var(--primary)' }}>🔥 {getTranslation('TrendingInSouthAsia', lang)}</h2>
                            <div className="articles-list">
                                {saFeatured.map((article, i) => <ArticleCard key={article.id} article={article} index={i} />)}
                            </div>
                        </div>
                    )}

                    {globalFeatured.length > 0 && (
                        <div className="feed-block" style={{ marginTop: '3rem' }}>
                            <h2 className="latest-title">🌍 {getTranslation('TrendingGlobally', lang)}</h2>
                            <div className="articles-list">
                                {globalFeatured.map((article, i) => <ArticleCard key={article.id} article={article} index={i} />)}
                            </div>
                        </div>
                    )}

                    {bangladeshFeed.length > 0 && (
                        <div className="feed-block" style={{ marginTop: '3rem' }}>
                            <h2 className="latest-title">🇧🇩 {getTranslation('LatestBangladesh', lang)}</h2>
                            <div className="articles-list">
                                {bangladeshFeed.map((article, i) => <ArticleCard key={article.id} article={article} index={i} />)}
                            </div>
                        </div>
                    )}

                    {indiaFeed.length > 0 && (
                        <div className="feed-block" style={{ marginTop: '3rem' }}>
                            <h2 className="latest-title">🇮🇳 {getTranslation('LatestIndia', lang)}</h2>
                            <div className="articles-list">
                                {indiaFeed.map((article, i) => <ArticleCard key={article.id} article={article} index={i} />)}
                            </div>
                        </div>
                    )}

                    {pakistanFeed.length > 0 && (
                        <div className="feed-block" style={{ marginTop: '3rem' }}>
                            <h2 className="latest-title">🇵🇰 {getTranslation('LatestPakistan', lang)}</h2>
                            <div className="articles-list">
                                {pakistanFeed.map((article, i) => <ArticleCard key={article.id} article={article} index={i} />)}
                            </div>
                        </div>
                    )}

                    {globalFeed.length > 0 && (
                        <div className="feed-block" style={{ marginTop: '3rem' }}>
                            <h2 className="latest-title">💻 {getTranslation('GlobalTechNews', lang)}</h2>
                            <div className="articles-list">
                                {globalFeed.map((article, i) => <ArticleCard key={article.id} article={article} index={i} />)}
                            </div>
                            {visibleArticles < globalArticles.length && (
                                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    <button
                                        onClick={handleLoadMore}
                                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', transition: 'all 0.2s ease' }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                    >
                                        <span className="material-icons-round">expand_more</span>
                                        {lang === 'bn' ? 'আরও দেখুন' : 'Load More'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <aside className="side-col">
                    <Trending />
                    <Newsletter />
                </aside>
            </div>
        </section>
    );
}
