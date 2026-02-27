// Central articles data — edit this file to add/update articles

export const ARTICLES = [
    {
        id: 'nothing-phone-4a',
        category: 'Hardware',
        title: "Meet the Pink Nothing Phone (4a) — Nothing's Boldest Color Yet",
        excerpt:
            "Nothing is gearing up for its March 5 launch, and ahead of the big reveal the company has unveiled the Phone (4a) in a striking new pink finish — a first for the brand. Here's a closer look at the new colorway and everything we know so far.",
        author: 'Ibrahim Hassan',
        authorBio: 'Ibrahim covers mobile hardware and consumer tech at TechPulse.',
        date: 'Feb 27, 2026',
        readTime: '4 min read',
        img: 'https://st.gsmarena.com/imgroot/news/26/02/nothing-phone-4a-pink/-1220x526/gsmarena_000.jpg',
        content: [
            {
                type: 'lead',
                text: "Nothing is set to reveal the Phone (4a) and Phone (4a) Pro at a launch event on March 5, 2026. Ahead of that, the company had already teased the phone in white — but it went a step further by pulling back the curtain on an all-new pink colorway, marking the very first time Nothing has produced a phone in this shade.",
            },
            {
                type: 'image',
                src: 'https://st.gsmarena.com/imgroot/news/26/02/nothing-phone-4a-pink/-1220x526/gsmarena_000.jpg',
                caption: "The Nothing Phone (4a) in its brand-new pink colorway — a first for the company.",
            },
            {
                type: 'h2',
                text: "It's Unmistakably Pink",
            },
            {
                type: 'paragraph',
                text: "There's no subtlety here — the Phone (4a) in pink is exactly what it sounds like. The form factor and specifications are identical to the previously revealed white version; Nothing has changed only the colorway. That said, the contrast between the two placed side by side makes for a genuinely striking official image.",
            },
            {
                type: 'image',
                src: 'https://st.gsmarena.com/imgroot/news/26/02/nothing-phone-4a-pink/inline/-1200/gsmarena_002.jpg',
                caption: "Pink meets white — both Phone (4a) models together in an official Nothing press shot.",
            },
            {
                type: 'h2',
                text: 'The Glyph Bar Gets a Major Upgrade',
            },
            {
                type: 'paragraph',
                text: "The Phone (4a) trades out the Glyph Interface of its predecessor for a new Glyph Bar. The Bar consists of six square LED clusters positioned along the back, with each square built from nine individually addressable mini-LEDs. The end result is a richer, more expressive notification lighting system — Nothing says it's also brighter than anything in the Glyph lineup to date. Like before, it's fully programmable and tied into notifications, timers, and now music visuals too.",
            },
            {
                type: 'h2',
                text: "Behind the Design: Nothing's Industrial Team Speaks",
            },
            {
                type: 'paragraph',
                text: "To accompany the pink reveal, Nothing published a video exploring the \"design secrets\" of the Phone (4a), featuring commentary from the company's Industrial Design team. The pink version takes center stage, giving viewers an in-depth look at how this new colorway was developed alongside Nothing's trademark transparent-back aesthetic.",
            },
            {
                type: 'h2',
                text: 'What the Specs Look Like So Far',
            },
            {
                type: 'paragraph',
                text: "Nothing hasn't officially confirmed the full spec sheet ahead of March 5, but leaks and partial disclosures have painted a fairly complete picture. The Phone (4a) is expected to sport a 6.78-inch FHD+ AMOLED screen with a 120Hz refresh rate, running on Qualcomm's Snapdragon 7s Gen 4. Configuration options are tipped to go up to 12GB RAM and 256GB of internal storage.",
            },
            {
                type: 'paragraph',
                text: "The camera system looks to be the most ambitious yet for a base A-series model. A 50MP primary sensor is joined by a 50MP telephoto with 3.5× optical zoom — achieved through a periscope mechanism, a first for this lineup — and an 8MP ultrawide. On the power side, a 5,400mAh battery with 50W wired charging is expected to handle day-to-day demands.",
            },
            {
                type: 'specs',
                title: 'Expected Specifications',
                items: [
                    ['Display', '6.78" FHD+ AMOLED, 120Hz'],
                    ['Chipset', 'Snapdragon 7s Gen 4'],
                    ['RAM / Storage', 'Up to 12GB / 256GB'],
                    ['Main Camera', '50MP'],
                    ['Telephoto', '50MP, 3.5× optical zoom (periscope)'],
                    ['Ultrawide', '8MP'],
                    ['Battery', '5,400mAh, 50W wired'],
                    ['Launch Date', 'March 5, 2026'],
                ],
            },
            {
                type: 'h2',
                text: 'Four Colorways at Launch',
            },
            {
                type: 'paragraph',
                text: "With pink now confirmed, the Nothing Phone (4a) is set to launch in at least four colors: Black, White, Pink, and Yellow. The pink addition signals a deliberate move by Nothing to court a broader, more style-conscious audience — one that appreciates distinctive hardware without sacrificing the brand's signature design identity.",
            },
            {
                type: 'paragraph',
                text: "We'll have hands-on coverage and our full first impressions live from the March 5 launch event. Stay tuned to TechPulse.",
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
            { type: 'paragraph', text: "The compiler works by statically analyzing your component tree and injecting memoization at the right points. It understands React's rules — no side effects in render, pure components — and uses that knowledge to only re-render when props genuinely change." },
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
            { type: 'paragraph', text: "Glassmorphism had its moment, but the trend has matured into something more refined — used sparingly as an overlay effect rather than a whole-UI language. Neo-brutalism, meanwhile, is fading from product design but thriving in editorial and marketing contexts." },
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
            { type: 'paragraph', text: "Apple's Neural Engine, Qualcomm's Hexagon NPU, and Google's Tensor G4 are not incremental chip updates — they represent a fundamental shift in where computation happens. Moving inference from the cloud to the device cuts latency, preserves privacy, and eliminates the need for a network connection." },
        ],
    },
]

export function getArticleById(id) {
    return ARTICLES.find(a => a.id === id) || null
}
