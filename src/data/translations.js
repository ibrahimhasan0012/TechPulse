export const translations = {
    Home: {
        en: 'Home',
        bn: 'হোম'
    },
    Technology: {
        en: 'Technology',
        bn: 'প্রযুক্তি'
    },
    AI: {
        en: 'AI',
        bn: 'এআই'
    },
    Development: {
        en: 'Development',
        bn: 'ডেভেলপমেন্ট'
    },
    Design: {
        en: 'Design',
        bn: 'ডিজাইন'
    },
    Subscribe: {
        en: 'Subscribe',
        bn: 'সাবস্ক্রাইব'
    },
    BackToHome: {
        en: '← Back to Home',
        bn: '← হোমে ফিরে যান'
    },
    Back: {
        en: 'Back',
        bn: 'ফিরে যান'
    },
    ArticleNotFound: {
        en: 'Article not found',
        bn: 'নিবন্ধটি পাওয়া যায়নি'
    },
    QuickSpecs: {
        en: 'Quick Specs',
        bn: 'একনজরে স্পেকস'
    },
    Related: {
        en: 'Related',
        bn: 'সম্পর্কিত'
    },
    LatestArticles: {
        en: 'Latest Articles',
        bn: 'সর্বশেষ সংবাদ'
    },
    TrendingNow: {
        en: 'Trending Now',
        bn: 'ট্রেন্ডিং'
    },
    NewsletterTitle: {
        en: 'Stay inside the loop',
        bn: 'আপডেট থাকুন'
    },
    NewsletterDesc: {
        en: 'Get our weekly newsletter delivered directly to your inbox.',
        bn: 'সরাসরি ইনবক্সে সাপ্তাহিক নিউজলেটার পান।'
    },
    NewsletterPlaceholder: {
        en: 'Email address',
        bn: 'ইমেইল অ্যাড্রেস'
    },
    ReadPrefix: {
        en: 'Read ',
        bn: 'পড়তে '
    },
    ReadSuffix: {
        en: ' min',
        bn: ' মিনিট'
    },
    ApplesNewChip: {
        en: "Apple's New Chip Announcement",
        bn: "অ্যাপলের নতুন চিপ ঘোষণা"
    },
    Python4Rumors: {
        en: 'Python 4.0 Rumors Debunked',
        bn: 'পাইথন ৪.০ এর গুজব খণ্ডিত'
    },
    RiseOfLocalLLMs: {
        en: 'The Rise of Local LLMs',
        bn: 'লোকাল এলএলএম এর উত্থান'
    },
    ZeroDayExploit: {
        en: 'Zero-Day Exploit Found in Major Framework',
        bn: 'প্রধান ফ্রেমওয়ার্কে জিরো-ডে এক্সপ্লয়েট'
    },
    AWSSoutheastAsia: {
        en: 'AWS Announces New Region in Southeast Asia',
        bn: 'এডব্লিউএস দক্ষিণ-পূর্ব এশিয়ায় নতুন রিজিয়ন ঘোষণা করেছে'
    },
    StayUpdated: {
        en: 'Stay Updated',
        bn: 'আপডেট থাকুন'
    },
    NewsletterDescDetailed: {
        en: 'Get the latest tech news delivered to your inbox weekly. No spam, ever.',
        bn: 'আপনার ইনবক্সে সাপ্তাহিক সর্বশেষ প্রযুক্তি খবর পান। কোন স্প্যাম নেই, কখনই না।'
    },
    SubscribedSuccess: {
        en: "You're subscribed! Welcome aboard.",
        bn: 'আপনি সাবস্ক্রাইব করেছেন! স্বাগতম।'
    },
    NewsletterNote: {
        en: 'Join 28,400+ readers · Cancel anytime',
        bn: '২৮,৪০০+ পাঠকের সাথে যোগ দিন · যে কোনো সময় বাতিল করুন'
    },
    AboutUs: {
        en: 'About Us',
        bn: 'আমাদের সম্পর্কে'
    },
    Careers: {
        en: 'Careers',
        bn: 'ক্যারিয়ার'
    },
    Contact: {
        en: 'Contact',
        bn: 'যোগাযোগ'
    },
    FooterTagline: {
        en: 'Your daily source for technology news, analysis, and insights that matter.',
        bn: 'প্রযুক্তি খবর, বিশ্লেষণ এবং গুরুত্বপূর্ণ দৃষ্টিভঙ্গির আপনার দৈনিক উৎস।'
    }
};

export const getTranslation = (key, lang = 'en') => {
    return translations[key]?.[lang] || key;
};
