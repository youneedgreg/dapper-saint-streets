export interface StyledLook {
  id: string;
  image: string;
  title: string;
  description: string;
  productIds?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  images: string[];
  images360?: string[];  // 360° view images
  styledLooks?: StyledLook[];  // Styled looks for this product
  colors: { name: string; hex: string; image: string }[];
  sizes: string[];
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

// Dummy 360 images - to be replaced with admin uploads
const dummy360Images = [
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop",
];

// Dummy styled looks - to be replaced with admin uploads
const dummyStyledLooks: StyledLook[] = [
  {
    id: "look-1",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop",
    title: "Street Ready",
    description: "Casual downtown vibes",
    productIds: ["1", "4"]
  },
  {
    id: "look-2",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop",
    title: "Urban Edge",
    description: "Bold city aesthetic",
    productIds: ["3", "5"]
  },
  {
    id: "look-3",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    title: "Night Out",
    description: "Evening sophistication",
    productIds: ["2", "8"]
  },
  {
    id: "look-4",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
    title: "Weekend Casual",
    description: "Effortless style",
    productIds: ["6", "10"]
  }
];

export const products: Product[] = [
  {
    id: "1",
    name: "Sovereign Hoodie",
    price: 285,
    originalPrice: 350,
    category: "Hoodies",
    description: "Premium heavyweight cotton hoodie with gold-embroidered logo. Features a relaxed silhouette, kangaroo pocket, and ribbed cuffs. The epitome of luxury streetwear.",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks.slice(0, 2),
    colors: [
      { name: "Obsidian", hex: "#0A0A0A", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop" },
      { name: "Ivory", hex: "#FAFAFA", image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&auto=format&fit=crop" },
      { name: "Charcoal", hex: "#2D2D2D", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tags: ["bestseller", "limited"],
    isNew: true,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: "2",
    name: "Empire Tee",
    price: 125,
    category: "T-Shirts",
    description: "100% Egyptian cotton tee with subtle metallic print. Oversized fit with dropped shoulders. Luxury meets street in this essential piece.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks.slice(1, 3),
    colors: [
      { name: "Black", hex: "#0A0A0A", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop" },
      { name: "White", hex: "#FFFFFF", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop" },
      { name: "Gold", hex: "#D4AF37", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    tags: ["essential"],
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: "3",
    name: "Dynasty Bomber",
    price: 495,
    category: "Jackets",
    description: "Satin bomber jacket with custom embroidered back panel. Premium YKK zippers, silk lining, and ribbed collar. A statement piece for the modern aristocrat.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks.slice(0, 3),
    colors: [
      { name: "Midnight", hex: "#0D1117", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop" },
      { name: "Olive", hex: "#3D4F2F", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop" },
      { name: "Burgundy", hex: "#722F37", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop" }
    ],
    sizes: ["S", "M", "L", "XL"],
    tags: ["limited", "exclusive"],
    isNew: true,
    isFeatured: true
  },
  {
    id: "4",
    name: "Crown Joggers",
    price: 195,
    category: "Pants",
    description: "Technical joggers with tapered fit and hidden zip pockets. Water-resistant fabric with four-way stretch. Comfort engineered for the streets.",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks.slice(2, 4),
    colors: [
      { name: "Black", hex: "#0A0A0A", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop" },
      { name: "Grey", hex: "#4A4A4A", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop" },
      { name: "Navy", hex: "#1B2838", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    tags: ["essential", "comfort"],
    isFeatured: true
  },
  {
    id: "5",
    name: "Reign Cap",
    price: 85,
    category: "Accessories",
    description: "Structured six-panel cap with embroidered crown logo. Adjustable brass closure. Premium cotton twill construction.",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks,
    colors: [
      { name: "Black", hex: "#0A0A0A", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop" },
      { name: "White", hex: "#FFFFFF", image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&auto=format&fit=crop" },
      { name: "Tan", hex: "#C4A77D", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop" }
    ],
    sizes: ["One Size"],
    tags: ["accessory"]
  },
  {
    id: "6",
    name: "Noble Crewneck",
    price: 225,
    category: "Sweaters",
    description: "Heavy-weight French terry crewneck with chain-stitched logo. Vintage wash finish. The perfect layering piece for distinguished style.",
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks.slice(0, 2),
    colors: [
      { name: "Heather Grey", hex: "#9CA3AF", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop" },
      { name: "Black", hex: "#0A0A0A", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop" },
      { name: "Cream", hex: "#FFFDD0", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop" }
    ],
    sizes: ["S", "M", "L", "XL"],
    tags: ["comfort", "essential"]
  },
  {
    id: "7",
    name: "Monarch Denim",
    price: 325,
    originalPrice: 400,
    category: "Pants",
    description: "Japanese selvedge denim with custom hardware. Relaxed straight fit. Hand-distressed details for authentic character.",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks.slice(1, 4),
    colors: [
      { name: "Indigo", hex: "#3F51B5", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop" },
      { name: "Washed Black", hex: "#2D2D2D", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop" }
    ],
    sizes: ["28", "30", "32", "34", "36"],
    tags: ["denim", "premium"],
    isNew: true
  },
  {
    id: "8",
    name: "Scepter Bag",
    price: 245,
    category: "Accessories",
    description: "Crossbody bag in full-grain leather with gold hardware. Multiple compartments with magnetic closure. Urban utility meets refined craftsmanship.",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks,
    colors: [
      { name: "Black", hex: "#0A0A0A", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop" },
      { name: "Brown", hex: "#8B4513", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop" }
    ],
    sizes: ["One Size"],
    tags: ["accessory", "leather"],
    isBestSeller: true
  },
  {
    id: "9",
    name: "Throne Puffer",
    price: 595,
    category: "Jackets",
    description: "Down-filled puffer with matte finish. Detachable hood and inner pocket system. Warmth and style for the urban throne.",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks.slice(0, 3),
    colors: [
      { name: "Matte Black", hex: "#1A1A1A", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop" },
      { name: "Olive", hex: "#556B2F", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop" }
    ],
    sizes: ["S", "M", "L", "XL"],
    tags: ["winter", "premium"],
    isNew: true
  },
  {
    id: "10",
    name: "Legacy Shorts",
    price: 145,
    category: "Pants",
    description: "Premium cotton shorts with embroidered logo. Elastic waist with drawstring. Above-knee cut for a modern silhouette.",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop"
    ],
    images360: dummy360Images,
    styledLooks: dummyStyledLooks.slice(2, 4),
    colors: [
      { name: "Black", hex: "#0A0A0A", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop" },
      { name: "Stone", hex: "#A0917D", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop" },
      { name: "Navy", hex: "#1B2838", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop" }
    ],
    sizes: ["S", "M", "L", "XL"],
    tags: ["summer", "essential"]
  }
];

export const categories = [
  "All",
  "Hoodies",
  "T-Shirts",
  "Jackets",
  "Pants",
  "Sweaters",
  "Accessories"
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "All") return products;
  return products.filter(p => p.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(p => p.isFeatured).slice(0, 4);
};

export const getNewArrivals = (): Product[] => {
  return products.filter(p => p.isNew);
};

export const getBestSellers = (): Product[] => {
  return products.filter(p => p.isBestSeller);
};
