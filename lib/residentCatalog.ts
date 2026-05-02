export type Category = "Staples" | "Oils" | "Pulses" | "Vegetables" | "Household";

export type Product = {
  id: string;
  name: string;
  brand: string;
  packSize: string;
  price: number;
  category: Category;
  savingsLabel?: string;
  savingsPerUnit?: number;
  image?: string;
};

export const categories: Category[] = ["Staples", "Oils", "Pulses", "Vegetables", "Household"];

export const products: Product[] = [
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

/** Short lines for weekly society-listing context (Indian apartment bulk order). */
export const catalogListingNotes: Record<string, string> = {
  "tata-salt-1kg": "Pantry staple — most flats add 1–2 packs per week.",
  "india-gate-rice-5kg": "5kg bag — typical weekly rice for a small family.",
  "fortune-oil-1l": "Refined oil — common pick for daily cooking.",
  "aashirvaad-atta-5kg": "Chapati atta — society list almost always includes atta.",
  "toor-dal-1kg": "Sambar / dal — standard pulse for the week.",
  "onions-1kg": "Sabzi basket — fresh with Friday delivery.",
  "tomatoes-1kg": "Sabzi basket — fresh with Friday delivery.",
  "potatoes-1kg": "Sabzi basket — fresh with Friday delivery.",
  "vim-dishwash-bar": "Daily dishwash — small add-on many households bundle."
};
