import './Trending.css'

const TRENDING = [
    { id: 1, tag: 'Hardware', label: "Apple's New Chip Announcement", time: '2h ago', icon: 'memory' },
    { id: 2, tag: 'Dev', label: 'Python 4.0 Rumors Debunked', time: '5h ago', icon: 'code' },
    { id: 3, tag: 'AI', label: 'The Rise of Local LLMs', time: '8h ago', icon: 'psychology' },
    { id: 4, tag: 'Security', label: 'Zero-Day Exploit Found in Major Framework', time: '11h ago', icon: 'security' },
    { id: 5, tag: 'Cloud', label: 'AWS Announces New Region in Southeast Asia', time: '14h ago', icon: 'cloud' },
]

export default function Trending() {
    return (
        <div className="trending-card">
            <div className="trending-header">
                <span className="material-icons-round trending-icon">trending_up</span>
                <h3 className="trending-title">Trending Now</h3>
            </div>
            <ul className="trending-list">
                {TRENDING.map((item, i) => (
                    <li key={item.id} className="trending-item">
                        <span className="trending-num">{String(i + 1).padStart(2, '0')}</span>
                        <div className="trending-content">
                            <p className="trending-label">{item.label}</p>
                            <div className="trending-meta">
                                <span className="badge">{item.tag}</span>
                                <span className="trending-time">{item.time}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
