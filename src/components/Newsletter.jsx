import { useState } from 'react'
import './Newsletter.css'

export default function Newsletter() {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email.trim()) {
            setSubscribed(true)
        }
    }

    return (
        <div className="newsletter-card">
            <div className="newsletter-icon-wrap">
                <span className="material-icons-round newsletter-icon">mail</span>
            </div>
            <h3 className="newsletter-title">Stay Updated</h3>
            <p className="newsletter-desc">
                Get the latest tech news delivered to your inbox weekly. No spam, ever.
            </p>
            {subscribed ? (
                <div className="newsletter-success">
                    <span className="material-icons-round">check_circle</span>
                    You're subscribed! Welcome aboard.
                </div>
            ) : (
                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="newsletter-input"
                        required
                    />
                    <button type="submit" className="newsletter-btn">
                        Subscribe
                        <span className="material-icons-round">send</span>
                    </button>
                </form>
            )}
            <p className="newsletter-note">Join 28,400+ readers · Cancel anytime</p>
        </div>
    )
}
