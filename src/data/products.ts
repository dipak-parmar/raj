export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  rating: number;
  reviewsCount: number;
  imgUrl: string;
  gallery: string[];
  organic: boolean;
  benefits: string[];
  ingredients: string[];
  usage: string[];
  skinType: string;
  reviews: Review[];
}

export const products: Product[] = [
  {
    id: "pearl-herbal-shampoo",
    name: "Pearl Herbal Shampoo",
    tagline: "Nature Powered Hair Strength",
    description: "A premium, nature-infused restorative cleanser formulated with wild herbs and botanical pearls. It gently purifies the scalp, rebuilds compromised hair bonds, and revitalizes follicles for resilient, silky, and voluminous hair.",
    originalPrice: 299,
    offerPrice: 149,
    rating: 4.8,
    reviewsCount: 142,
    imgUrl: "/images/shop/product-1.png",
    gallery: [
      "/images/shop/product-1.png"
    ],
    organic: true,
    benefits: [
      "Strengthens hair roots and reduces breakage",
      "Promotes hair density and natural volume",
      "Gently cleanses without stripping natural oils",
      "Infuses a long-lasting herbal freshness"
    ],
    ingredients: [
      "Amla Extract",
      "Shikakai Concentrate",
      "Bhringraj Oil",
      "Aloe Vera Gel",
      "Pearl Protein Essence"
    ],
    usage: [
      "Apply to wet hair and gently massage into the scalp.",
      "Lather and leave on for 1-2 minutes to let the botanicals absorb.",
      "Rinse thoroughly with lukewarm water."
    ],
    skinType: "All Hair Types",
    reviews: [
      { id: "r1", author: "Neeta Sharma", rating: 5, date: "2026-06-12", comment: "This shampoo has single-handedly solved my hair fall issue! Smells amazingly fresh." },
      { id: "r2", author: "Rajesh Kumar", rating: 4, date: "2026-07-01", comment: "Excellent herbal shampoo. My hair feels much thicker and softer." }
    ]
  },
  {
    id: "sree-hari-seva-kesar-goti",
    name: "Sree Hari Seva Kesar Goti",
    tagline: "Glow Naturally with Kesar",
    description: "An artisanal Ayurvedic cleansing bar enriched with finest Kashmiri Kesar (Saffron) and therapeutic herbs. It gently polishes the skin, removes tan, and unveils an ethereal, luminescent golden glow with every wash.",
    originalPrice: 120,
    offerPrice: 79,
    rating: 4.9,
    reviewsCount: 215,
    imgUrl: "/images/shop/product-2.png",
    gallery: [
      "/images/shop/product-2.png"
    ],
    organic: true,
    benefits: [
      "Restores skin's natural radiance and golden glow",
      "Fades dark spots, pigmentation and sun tan",
      "Deeply purifies and refines pores",
      "Maintains skin's soft elastic texture"
    ],
    ingredients: [
      "Kashmiri Saffron (Kesar)",
      "Pure Sandalwood Extract",
      "Neem Liquid",
      "Organic Goat Milk",
      "Sweet Almond Oil"
    ],
    usage: [
      "Wet face and the Kesar Goti bar.",
      "Create a rich lather and apply gently on face and neck.",
      "Leave for 30 seconds, then rinse with cool water."
    ],
    skinType: "All Skin Types",
    reviews: [
      { id: "r3", author: "Priya Patel", rating: 5, date: "2026-05-18", comment: "The glow is instant! This is hands down the best Ayurvedic bar I have ever used." },
      { id: "r4", author: "Aman Verma", rating: 5, date: "2026-06-25", comment: "Has cleared up my acne scars and tan within weeks. Super fast results!" }
    ]
  },
  {
    id: "night-cream",
    name: "Night Cream",
    tagline: "Overnight Skin Repair",
    description: "An advanced overnight rejuvenation treatment that works in harmony with your skin's nocturnal recovery cycle. Rich in cellular repair complexes, it dramatically diminishes fine lines, replenishes elasticity, and wakes you up to a firm, intensely hydrated complexion.",
    originalPrice: 599,
    offerPrice: 399,
    rating: 4.8,
    reviewsCount: 188,
    imgUrl: "/images/shop/prodcu-4.png",
    gallery: [
      "/images/shop/prodcu-4.png"
    ],
    organic: true,
    benefits: [
      "Simulates overnight cell repair and renewal",
      "Intensely hydrates and plumps skin texture",
      "Minimizes appearance of fine lines and aging spots",
      "Improves elasticity and firmness"
    ],
    ingredients: [
      "Hyaluronic Acid",
      "Retinol (Plant-derived)",
      "Rosehip Seed Oil",
      "Coenzyme Q10",
      "Shea Butter"
    ],
    usage: [
      "Cleanse face thoroughly and apply toner.",
      "Massage a dime-sized amount onto face and neck in upward strokes.",
      "Leave overnight and rinse during your morning routine."
    ],
    skinType: "Dry, Normal, and Aging Skin",
    reviews: [
      { id: "r5", author: "Meera Nair", rating: 5, date: "2026-07-03", comment: "Waking up with baby soft skin is addictive! This night cream works miracles." },
      { id: "r6", author: "Suresh Gupta", rating: 4, date: "2026-07-11", comment: "Visible reduction in expression lines on my forehead. Outstanding formula." }
    ]
  },
  {
    id: "day-cream",
    name: "Day Cream",
    tagline: "Daily Glow & Protection",
    description: "A lightweight, protective day shield packed with vitamins and natural solar protection. It hydrates continuously, refines skin texture, and blocks environmental stressors, keeping your skin radiant, fresh, and matte all day.",
    originalPrice: 599,
    offerPrice: 399,
    rating: 4.7,
    reviewsCount: 164,
    imgUrl: "/images/shop/product-5.png",
    gallery: [
      "/images/shop/product-5.png"
    ],
    organic: true,
    benefits: [
      "Provides all-day hydration with a clean, matte finish",
      "Forms a protective barrier against pollution and irritants",
      "Fights dullness and boosts skin brightness",
      "Provides broad-spectrum natural SPF shield"
    ],
    ingredients: [
      "Vitamin C",
      "Niacinamide",
      "Aloe Vera Extract",
      "Zinc Oxide (Natural SPF)",
      "Green Tea Pollen"
    ],
    usage: [
      "Apply every morning on a freshly cleansed face.",
      "Smooth gently over cheeks, forehead, nose, and chin.",
      "Can be used as a base before applying makeup."
    ],
    skinType: "All Skin Types, Oily & Normal",
    reviews: [
      { id: "r7", author: "Kriti Sen", rating: 5, date: "2026-06-20", comment: "Super lightweight and non-greasy. Kept my face fresh all day long even in summer." },
      { id: "r8", author: "Arnav Shah", rating: 4, date: "2026-07-05", comment: "Love the subtle citrus fragrance and the light cover it provides. Keeps skin matte." }
    ]
  },
  {
    id: "raj-drops",
    name: "Raj Drops",
    tagline: "Fast Relief from Pain",
    description: "A concentrated, fast-acting therapeutic herbal liquid formulated with ancient cooling herbs and active botanicals. It penetrates quickly to provide rapid, natural relief from muscular aches, joint pain, and local inflammation.",
    originalPrice: 99,
    offerPrice: 49,
    rating: 4.9,
    reviewsCount: 312,
    imgUrl: "/images/shop/product-3.png",
    gallery: [
      "/images/shop/product-3.png"
    ],
    organic: true,
    benefits: [
      "Provides high-speed relief from joints & muscle pain",
      "Soothes headaches, neck pain, and sinus congestion",
      "Reduces local inflammation and swelling",
      "100% natural, quick-absorbing non-sticky texture"
    ],
    ingredients: [
      "Menthol Essence",
      "Eucalyptus Concentrate",
      "Camphor Oil",
      "Thymol Extract",
      "Gandhapura Oil"
    ],
    usage: [
      "Apply 2-3 drops on the affected pain area.",
      "Gently massage in circular motion until absorbed.",
      "For headaches, apply slightly on the temples and forehead."
    ],
    skinType: "All Skin / External Application Only",
    reviews: [
      { id: "r9", author: "Baldev Singh", rating: 5, date: "2026-06-15", comment: "Unbelievable relief! My knee pain is gone within minutes of applying Raj Drops." },
      { id: "r10", author: "Anjali Joshi", rating: 5, date: "2026-07-09", comment: "Always carry this in my bag. Perfect for sudden headaches or neck strain." }
    ]
  },
  {
    id: "apollo-noni-toothpaste",
    name: "Apollo Noni Toothpaste",
    tagline: "Best Natural and Herbal Toothpaste 150gm",
    description: "A premium fluoridated herbal toothpaste featuring the powerful antibacterial property of organic Noni fruit, mint, and active botanicals. It fights plaque, prevents cavities, strengthens gums, and delivers a burst of long-lasting icy freshness.",
    originalPrice: 299,
    offerPrice: 99,
    rating: 4.8,
    reviewsCount: 95,
    imgUrl: "/images/shop/product-6.png",
    gallery: [
      "/images/shop/product-6.png"
    ],
    organic: true,
    benefits: [
      "Purges harmful oral bacteria and prevents decay",
      "Protects gums and fights gingivitis/bleeding",
      "Banishes bad breath with fresh icy mint",
      "Gently whitens teeth by cleaning plaque"
    ],
    ingredients: [
      "Organic Noni Fruit Extract",
      "Spearmint & Peppermint Oil",
      "Clove Extract",
      "Neem Seed Essence",
      "Calcium Carbonate"
    ],
    usage: [
      "Squeeze a pea-sized amount onto a soft toothbrush.",
      "Brush thoroughly for 2 minutes, twice daily.",
      "Rinse mouth completely with water after brushing."
    ],
    skinType: "Oral Care (150gm)",
    reviews: [
      { id: "r11", author: "Dr. Sandeep Patel", rating: 5, date: "2026-06-28", comment: "Highly recommend this to my dental clients. Naturally keeps teeth cavity-free." },
      { id: "r12", author: "Kiran Goel", rating: 4, date: "2026-07-06", comment: "The freshness lasts so much longer than normal commercial toothpastes. Love the Noni touch!" }
    ]
  }
];
