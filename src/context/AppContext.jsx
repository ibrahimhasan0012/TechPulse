import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Check local storage for initial values or system preference for theme
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [lang, setLang] = useState(() => {
        const saved = localStorage.getItem('lang');
        return saved || 'en';
    });

    const [articles, setArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // Fetch from the public folder dynamically
                const response = await fetch(`${import.meta.env.BASE_URL}data/articles.json`);
                if (response.ok) {
                    const data = await response.json();
                    setArticles(data);
                } else {
                    console.error("Failed to fetch articles:", response.status);
                }
            } catch (error) {
                console.error("Error fetching articles data:", error);
            } finally {
                setLoadingArticles(false);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
    }, [lang]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const toggleLang = () => setLang(prev => prev === 'en' ? 'bn' : 'en');

    return (
        <AppContext.Provider value={{ theme, lang, toggleTheme, toggleLang, articles, loadingArticles }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
