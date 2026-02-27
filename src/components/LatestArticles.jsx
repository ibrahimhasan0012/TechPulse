import './LatestArticles.css'

const ARTICLES = [
    {
        id: 1,
        category: 'Hardware',
        title: 'Nothing Phone 4a: The Transparent Disruptor Is Back and Better Than Ever',
        excerpt: 'Nothing\'s latest mid-range phone packs a punchier Glyph Interface, a cleaner NothingOS 3.0, and surprisingly great cameras — all for under $400. Here\'s our full hands-on.',
        author: 'Ibrahim Hassan',
        date: 'Feb 27, 2026',
        readTime: '5 min read',
        img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    },
    {
        id: 2,
        category: 'Development',
        title: 'Optimizing React Performance in 2024',
        excerpt: 'Deep dive into the new compiler and rendering strategies that are changing how we build React apps.',
        author: 'Liam Torres',
        date: 'Oct 22, 2023',
        readTime: '6 min read',
        img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
    },
    {
        id: 3,
        category: 'Leadership',
        title: 'Leading Remote Engineering Teams',
        excerpt: 'Strategies for maintaining culture and productivity in a distributed-first world.',
        author: 'Maya Patel',
        date: 'Oct 20, 2023',
        readTime: '5 min read',
        img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    },
    {
        id: 4,
        category: 'Design',
        title: 'UI Trends to Watch in Q4',
        excerpt: 'From glassmorphism to neo-brutalism, what\'s sticking around and what\'s fading out.',
        author: 'Jordan Kim',
        date: 'Oct 18, 2023',
        readTime: '7 min read',
        img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    },
    {
        id: 5,
        category: 'AI',
        title: 'Building with Large Language Models: A Practical Guide',
        excerpt: 'Everything you need to know to integrate LLMs into your production applications safely and efficiently.',
        author: 'Alex Rivera',
        date: 'Oct 15, 2023',
        readTime: '10 min read',
        img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
    },
    {
        id: 6,
        category: 'Hardware',
        title: 'The New Era of Edge Computing Chips',
        excerpt: 'How custom silicon is pushing AI inference to the very edge of the network.',
        author: 'Priya Nair',
        date: 'Oct 12, 2023',
        readTime: '4 min read',
        img: 'https://images.unsplash.com/photo-1555617981-dac3772603e3?w=600&q=80',
    },
]

export default function LatestArticles() {
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
                        style={{ animationDelay: `${i * 0.08}s` }}
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
                                <button className="bookmark-btn" aria-label="Bookmark">
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
