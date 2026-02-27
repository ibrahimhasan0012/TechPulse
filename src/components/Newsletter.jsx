import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { getTranslation } from '../data/translations'
import './Newsletter.css'

export default function Newsletter() {
    const { lang } = useAppContext()
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
            <h3 className="newsletter-title">{getTranslation('StayUpdated', lang)}</h3>
            <p className="newsletter-desc">
                {getTranslation('NewsletterDescDetailed', lang)}
            </p>
            {subscribed ? (
                <div className="newsletter-success">
                    <span className="material-icons-round">check_circle</span>
                    {getTranslation('SubscribedSuccess', lang)}
                </div>
            ) : (
                <form className="newsletter-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder={getTranslation('NewsletterPlaceholder', lang)}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="newsletter-input"
                        required
                    />
                    <button type="submit" className="newsletter-btn">
                        {getTranslation('Subscribe', lang)}
                        <span className="material-icons-round">send</span>
                    </button>
                </form>
            )}
            <p className="newsletter-note">{getTranslation('NewsletterNote', lang)}</p>
        </div>
    )
}
