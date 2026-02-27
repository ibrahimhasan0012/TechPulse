import './Hero.css'

const FEATURED = {
    category: 'AI',
    tag: 'Featured',
    title: 'The Future of AI in Mobile Development: Beyond Chatbots',
    excerpt:
        'Exploring how generative AI models are reshaping the architectural landscape of modern mobile applications and user experiences.',
    author: 'Sarah Chen',
    date: 'Oct 24, 2023',
    readTime: '8 min read',
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
}

export default function Hero() {
    return (
        <section className="hero">
            <div className="container">
                {/* Category pills */}
                <div className="hero-pills animate-fade-in">
                    {['AI', 'Development', 'Design', 'Hardware', 'Startups'].map(c => (
                        <a key={c} href="#" className="pill">{c}</a>
                    ))}
                </div>

                {/* Featured card */}
                <div className="hero-card animate-fade-up">
                    <div className="hero-image-wrap">
                        <img
                            src={FEATURED.img}
                            alt={FEATURED.title}
                            className="hero-image"
                        />
                        <div className="hero-image-overlay" />
                        <span className="hero-badge">
                            <span className="live-dot" />
                            Featured
                        </span>
                    </div>
                    <div className="hero-content">
                        <span className="chip dark">{FEATURED.category}</span>
                        <h1 className="hero-title">{FEATURED.title}</h1>
                        <p className="hero-excerpt">{FEATURED.excerpt}</p>
                        <div className="hero-meta">
                            <div className="hero-author">
                                <div className="author-avatar">{FEATURED.author[0]}</div>
                                <div>
                                    <p className="author-name">{FEATURED.author}</p>
                                    <p className="hero-date">{FEATURED.date} · {FEATURED.readTime}</p>
                                </div>
                            </div>
                            <button className="btn-read">
                                Read Article
                                <span className="material-icons-round">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
