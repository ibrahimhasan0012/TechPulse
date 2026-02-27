import './Footer.css'

const LINKS = {
    Topics: ['Technology', 'AI & Machine Learning', 'Development', 'Design', 'Hardware', 'Startups'],
    Company: ['About Us', 'Careers', 'Advertise', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="logo-icon">
                                <span className="material-icons-round">bolt</span>
                            </div>
                            <span className="logo-text">TechPulse</span>
                        </div>
                        <p className="footer-tagline">
                            Your daily source for technology news, analysis, and insights that matter.
                        </p>
                        <div className="footer-socials">
                            {['twitter', 'linkedin', 'rss_feed', 'alternate_email'].map(icon => (
                                <a key={icon} href="#" className="social-btn" aria-label={icon}>
                                    <span className="material-icons-round">{icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(LINKS).map(([col, items]) => (
                        <div key={col} className="footer-col">
                            <h4 className="footer-col-title">{col}</h4>
                            <ul>
                                {items.map(item => (
                                    <li key={item}>
                                        <a href="#" className="footer-link">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="footer-bottom">
                    <p>© 2024 TechPulse. All rights reserved.</p>
                    <p>Built with ❤️ for curious minds</p>
                </div>
            </div>
        </footer>
    )
}
