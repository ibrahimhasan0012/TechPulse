// Central articles data — edit this file to add/update articles

export const ARTICLES = [
    {
        id: 'nothing-phone-4a',
        category: 'Hardware',
        title: 'Nothing Phone 4a: The Transparent Disruptor Is Back and Better Than Ever',
        excerpt:
            "Nothing's upcoming mid-ranger packs a punchier Glyph Bar, Android 16 with NothingOS 4.0, and a first-ever periscope camera — all for under $400. Here's everything we know before the March 5 launch.",
        author: 'Ibrahim Hassan',
        authorBio: 'Ibrahim covers mobile hardware and consumer tech at TechPulse.',
        date: 'Feb 27, 2026',
        readTime: '7 min read',
        img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80',
        content: [
            {
                type: 'lead',
                text: "Nothing has officially confirmed the Phone 4a for a global launch on March 5, 2026 — and the spec sheet alone is enough to turn heads. After the modest updates of the Phone (3a), the 4a promises something genuinely new: a periscope telephoto camera in a mid-range phone, a dramatically redesigned Glyph Bar powered by mini-LEDs, and Android 16 straight out of the box.",
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&q=80',
                caption: 'The Nothing Phone 4a continues the brand\'s signature transparent back design with a redesigned Glyph Bar.',
            },
            {
                type: 'h2',
                text: 'Design & Display',
            },
            {
                type: 'paragraph',
                text: "The Phone 4a keeps what made Nothing famous — a transparent glass back revealing a carefully arranged PCB and antenna lines — but the Glyph Interface gets its biggest upgrade yet. The new \"Glyph Bar\" runs along the back using mini-LED technology, enabling smoother animations, more granular notification patterns, and even music visualizations synced to whatever you're listening to. It's available in Black, White, Pink, and Yellow.",
            },
            {
                type: 'paragraph',
                text: "On the front, you get a flat 6.7-inch 1.5K AMOLED display (1260 × 2800) with a 120Hz refresh rate and a blinding peak brightness of 3000 nits. The flat panel is a deliberate choice — Nothing's design language has always leaned into simplicity over the curved-display trend.",
            },
            {
                type: 'specs',
                title: 'Display Specs',
                items: [
                    ['Panel', 'AMOLED, flat'],
                    ['Size', '6.7 inches'],
                    ['Resolution', '1.5K (1260 × 2800)'],
                    ['Refresh Rate', '120Hz'],
                    ['Peak Brightness', '3000 nits'],
                ],
            },
            {
                type: 'h2',
                text: 'Performance: Snapdragon 7s Gen 4',
            },
            {
                type: 'paragraph',
                text: "The Qualcomm Snapdragon 7s Gen 4 sits at the heart of the Phone 4a — a capable upper-mid-range chip that brings meaningful AI processing improvements over its predecessor. Paired with up to 12GB of RAM and 256GB of storage (UFS 3.1), day-to-day performance should be snappy. Nothing promises smooth gaming at medium-to-high settings and fast on-device AI features baked into NothingOS 4.0.",
            },
            {
                type: 'h2',
                text: 'Triple Camera — Including a First: Periscope Telephoto',
            },
            {
                type: 'paragraph',
                text: "This is the headline feature. For the first time in Nothing's A-series lineup, the Phone 4a gets a periscope telephoto lens — a 50MP sensor with 3.5× optical zoom. That's a big deal for a phone in this price bracket. Combined with a 50MP primary shooter and an 8MP ultrawide, this is the most versatile camera system Nothing has ever shipped on a mid-range device.",
            },
            {
                type: 'image',
                src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&q=80',
                caption: 'A periscope telephoto lens makes its debut in Nothing\'s A-series for the first time.',
            },
            {
                type: 'specs',
                title: 'Camera Specs',
                items: [
                    ['Main', '50MP, f/1.88'],
                    ['Telephoto', '50MP, 3.5× periscope optical zoom'],
                    ['Ultrawide', '8MP'],
                    ['Selfie', '32MP'],
                    ['Video', '4K@30fps, 1080p@60fps'],
                ],
            },
            {
                type: 'h2',
                text: 'Battery & Charging',
            },
            {
                type: 'paragraph',
                text: "A 5100mAh cell should comfortably get you through a full day — possibly two with light use. Nothing is sticking with 50W wired fast charging, which should top the phone up from 0–100% in under an hour. There's no wireless charging, which remains a cost-saving concession on the A-series.",
            },
            {
                type: 'h2',
                text: 'NothingOS 4.0 on Android 16',
            },
            {
                type: 'paragraph',
                text: "The Phone 4a ships with Android 16 and NothingOS 4.0 — a clean, opinionated take on Android that strips out bloatware and leans into the brand's Helvetica-and-dots aesthetic. Nothing promises 3 years of OS updates and 4 years of security patches. It also includes Nothing's own AI features for smart replies, call screening, and Glyph-integrated notifications.",
            },
            {
                type: 'h2',
                text: 'Durability & Connectivity',
            },
            {
                type: 'paragraph',
                text: "The Phone 4a carries an IP65 rating — full dust protection and resistance to water jets — which is class-leading for a mid-range phone. Connectivity includes 5G (Sub-6GHz), Wi-Fi 6, Bluetooth 5.4, NFC, and a USB-C 2.0 port.",
            },
            {
                type: 'h2',
                text: 'Verdict',
            },
            {
                type: 'paragraph',
                text: "On paper, the Nothing Phone 4a is the best value Nothing has ever put in a box. A periscope camera, a 3000-nit 1.5K display, mini-LED Glyph Bar, clean Android 16 software, and IP65 durability — all under $400. If the real-world camera performance delivers, this could be the mid-range phone to beat in 2026.",
            },
        ],
    },
    {
        id: 'react-performance-2024',
        category: 'Development',
        title: 'Optimizing React Performance in 2024',
        excerpt: 'Deep dive into the new compiler and rendering strategies that are changing how we build React apps.',
        author: 'Liam Torres',
        authorBio: 'Liam is a senior frontend engineer writing about React and web performance.',
        date: 'Oct 22, 2023',
        readTime: '6 min read',
        img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
        content: [
            { type: 'lead', text: 'The React team has been quietly shipping a compiler that changes everything about how you think about re-renders. Here is what you need to know.' },
            { type: 'paragraph', text: 'React 19 shipped the React Compiler — a Babel plugin that automatically memoizes your components at build time, eliminating the need for useMemo, useCallback, and manual React.memo wrappers in most cases. Early adopters are reporting up to 40% reduction in unnecessary re-renders without changing a single line of application code.' },
            { type: 'h2', text: 'The React Compiler in Practice' },
            { type: 'paragraph', text: 'The compiler works by statically analyzing your component tree and injecting memoization at the right points. It understands React\'s rules — no side effects in render, pure components — and uses that knowledge to only re-render when props genuinely change.' },
        ],
    },
    {
        id: 'remote-engineering-teams',
        category: 'Leadership',
        title: 'Leading Remote Engineering Teams',
        excerpt: 'Strategies for maintaining culture and productivity in a distributed-first world.',
        author: 'Maya Patel',
        authorBio: 'Maya is an engineering manager with 10+ years leading distributed teams.',
        date: 'Oct 20, 2023',
        readTime: '5 min read',
        img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
        content: [
            { type: 'lead', text: 'The shift to remote-first engineering is now permanent for most teams. Here is how to lead through the noise.' },
            { type: 'paragraph', text: 'The biggest mistake leaders make in distributed teams is replicating the office experience over Zoom. Async-first communication, clear written specs, and trust-based management are what actually work.' },
        ],
    },
    {
        id: 'ui-trends-q4',
        category: 'Design',
        title: 'UI Trends to Watch in Q4',
        excerpt: "From glassmorphism to neo-brutalism, what's sticking around and what's fading out.",
        author: 'Jordan Kim',
        authorBio: 'Jordan is a product designer and UI trends analyst.',
        date: 'Oct 18, 2023',
        readTime: '7 min read',
        img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
        content: [
            { type: 'lead', text: 'Design trends move fast. Here is a clear-eyed look at what is aging well and what is already feeling stale as we close out the year.' },
            { type: 'paragraph', text: 'Glassmorphism had its moment, but the trend has matured into something more refined — used sparingly as an overlay effect rather than a whole-UI language. Neo-brutalism, meanwhile, is fading from product design but thriving in editorial and marketing contexts.' },
        ],
    },
    {
        id: 'building-with-llms',
        category: 'AI',
        title: 'Building with Large Language Models: A Practical Guide',
        excerpt: 'Everything you need to know to integrate LLMs into your production applications safely and efficiently.',
        author: 'Alex Rivera',
        authorBio: 'Alex is an AI engineer specializing in LLM integration and safety.',
        date: 'Oct 15, 2023',
        readTime: '10 min read',
        img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
        content: [
            { type: 'lead', text: 'LLMs are everywhere, but most production integrations are naive. This guide walks through the patterns that actually work at scale.' },
            { type: 'paragraph', text: 'The biggest failure mode in LLM apps is treating the model like a database — expecting deterministic outputs from probabilistic systems. Building in retry logic, output validation, and human-in-the-loop fallbacks is not optional.' },
        ],
    },
    {
        id: 'edge-computing-chips',
        category: 'Hardware',
        title: 'The New Era of Edge Computing Chips',
        excerpt: 'How custom silicon is pushing AI inference to the very edge of the network.',
        author: 'Priya Nair',
        authorBio: 'Priya covers semiconductor and hardware innovation at TechPulse.',
        date: 'Oct 12, 2023',
        readTime: '4 min read',
        img: 'https://images.unsplash.com/photo-1555617981-dac3772603e3?w=1200&q=80',
        content: [
            { type: 'lead', text: 'The race to run AI inference at the edge is producing some of the most interesting silicon designs in years.' },
            { type: 'paragraph', text: 'Apple\'s Neural Engine, Qualcomm\'s Hexagon NPU, and Google\'s Tensor G4 are not incremental chip updates — they represent a fundamental shift in where computation happens. Moving inference from the cloud to the device cuts latency, preserves privacy, and eliminates the need for a network connection.' },
        ],
    },
]

export function getArticleById(id) {
    return ARTICLES.find(a => a.id === id) || null
}
