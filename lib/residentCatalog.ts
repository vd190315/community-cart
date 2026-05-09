export type Category = "Staples" | "Oils" | "Pulses" | "Vegetables" | "Household";

/** One of three fulfillment options shown when a resident adds a SKU from the catalog. */
export type ProductVendorOption = {
  id: string;
  vendorName: string;
  price: number;
  /** 0–5 scale for demo display */
  rating: number;
  etaLabel: string;
  stockLabel: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  packSize: string;
  /** Reference / list price; vendor options may differ slightly. */
  price: number;
  category: Category;
  savingsLabel?: string;
  savingsPerUnit?: number;
  image?: string;
  /** Exactly three vendor choices per product for the resident picker modal. */
  vendorOptions: [ProductVendorOption, ProductVendorOption, ProductVendorOption];
};

export const categories: Category[] = ["Staples", "Oils", "Pulses", "Vegetables", "Household"];

const DEMO_VENDOR_BASE = [
  {
    id: "freshcart-hub",
    vendorName: "FreshCart Hub",
    rating: 4.7,
    etaLabel: "Fri, 2–4 pm"
  },
  {
    id: "society-supplies",
    vendorName: "Society Supplies Co.",
    rating: 4.4,
    etaLabel: "Fri, 4–6 pm"
  },
  {
    id: "quickmart-local",
    vendorName: "QuickMart Local",
    rating: 4.9,
    etaLabel: "Thu eve cutoff"
  }
] as const;

const STOCK_ROTATION = ["In stock", "Low stock", "In stock", "Only 4 left", "Pre-order for Fri"] as const;

function vendorOptionsForProduct(basePrice: number, productIndex: number): Product["vendorOptions"] {
  return DEMO_VENDOR_BASE.map((v, i) => ({
    id: v.id,
    vendorName: v.vendorName,
    rating: v.rating,
    etaLabel: v.etaLabel,
    stockLabel: STOCK_ROTATION[(productIndex + i) % STOCK_ROTATION.length],
    price: Math.max(1, Math.round(basePrice * (1 + (i - 1) * 0.04 + (productIndex % 4) * 0.01)))
  })) as Product["vendorOptions"];
}

function withVendors<P extends Omit<Product, "vendorOptions">>(p: P, index: number): Product {
  return { ...p, vendorOptions: vendorOptionsForProduct(p.price, index) };
}

const productSeeds: Omit<Product, "vendorOptions">[] = [
  {
    id: "tata-salt-1kg",
    name: "Tata Salt",
    brand: "Tata",
    packSize: "1kg",
    price: 22,
    category: "Staples",
    image: "/products/tata-salt.jpg"
  },
  {
    id: "india-gate-rice-5kg",
    name: "India Gate Rice",
    brand: "India Gate",
    packSize: "5kg",
    price: 320,
    category: "Staples",
    savingsLabel: "Save ₹18",
    savingsPerUnit: 18,
    image: "/products/india-gate-rice.jpg"
  },
  {
    id: "ponni-rice-5kg",
    name: "Ponni Rice",
    brand: "Aachi",
    packSize: "5kg",
    price: 345,
    category: "Staples",
    savingsLabel: "Save ₹16",
    savingsPerUnit: 16
  },
  {
    id: "fortune-oil-1l",
    name: "Fortune Oil",
    brand: "Fortune",
    packSize: "1L",
    price: 118,
    category: "Oils",
    savingsLabel: "Save ₹7",
    savingsPerUnit: 7,
    image: "/products/fortune-oil.jpg"
  },
  {
    id: "sunflower-oil-1l",
    name: "Sunflower Oil",
    brand: "Gemini",
    packSize: "1L",
    price: 130,
    category: "Oils",
    savingsLabel: "Save ₹6",
    savingsPerUnit: 6
  },
  {
    id: "aashirvaad-atta-5kg",
    name: "Aashirvaad Atta",
    brand: "Aashirvaad",
    packSize: "5kg",
    price: 235,
    category: "Staples",
    image: "/products/aashirvaad-atta.jpg"
  },
  {
    id: "toor-dal-1kg",
    name: "Toor Dal",
    brand: "Udhaiyam",
    packSize: "1kg",
    price: 165,
    category: "Pulses",
    savingsLabel: "Save ₹10",
    savingsPerUnit: 10,
    image: "/products/toor-dal.jpg"
  },
  {
    id: "onions-1kg",
    name: "Onions",
    brand: "Farm Fresh",
    packSize: "1kg",
    price: 28,
    category: "Vegetables",
    image: "/products/onions.jpg"
  },
  {
    id: "tomatoes-1kg",
    name: "Tomatoes",
    brand: "Farm Fresh",
    packSize: "1kg",
    price: 24,
    category: "Vegetables",
    image: "/products/tomatoes.jpg"
  },
  {
    id: "milk-500ml",
    name: "Milk",
    brand: "Aavin",
    packSize: "500ml pack",
    price: 32,
    category: "Household"
  },
  {
    id: "curd-400g",
    name: "Curd",
    brand: "Aavin",
    packSize: "400g tub",
    price: 45,
    category: "Household"
  },
  {
    id: "eggs-12pcs",
    name: "Eggs",
    brand: "Farm Select",
    packSize: "12 pcs",
    price: 78,
    category: "Household"
  },
  {
    id: "potatoes-1kg",
    name: "Potatoes",
    brand: "Farm Fresh",
    packSize: "1kg",
    price: 30,
    category: "Vegetables",
    image: "/products/potatoes.jpg"
  },
  {
    id: "vim-dishwash-bar",
    name: "Vim Dishwash Bar",
    brand: "Vim",
    packSize: "300g",
    price: 35,
    category: "Household",
    image: "/products/vim-bar.jpg"
  }
];

export const products: Product[] = productSeeds.map((p, i) => withVendors(p, i));

/** Stable line key for a product + vendor pair (separate lines per vendor). */
export function residentCartLineId(productId: string, vendorId: string): string {
  return `${productId}::${vendorId}`;
}

/** Short lines for weekly society-listing context (Indian apartment bulk order). */
export const catalogListingNotes: Record<string, string> = {
  "tata-salt-1kg": "Pantry staple — most flats add 1–2 packs per week.",
  "india-gate-rice-5kg": "5kg bag — typical weekly rice for a small family.",
  "ponni-rice-5kg": "Popular South Indian staple for regular home cooking.",
  "fortune-oil-1l": "Refined oil — common pick for daily cooking.",
  "sunflower-oil-1l": "Sunflower oil top-up many flats add each cycle.",
  "aashirvaad-atta-5kg": "Chapati atta — society list almost always includes atta.",
  "toor-dal-1kg": "Sambar / dal — standard pulse for the week.",
  "onions-1kg": "Sabzi basket — fresh with Friday delivery.",
  "tomatoes-1kg": "Sabzi basket — fresh with Friday delivery.",
  "milk-500ml": "Daily breakfast essential — often added in pairs.",
  "curd-400g": "Common fridge staple for quick meals.",
  "eggs-12pcs": "Versatile protein staple for most homes.",
  "potatoes-1kg": "Sabzi basket — fresh with Friday delivery.",
  "vim-dishwash-bar": "Daily dishwash — small add-on many households bundle."
};
