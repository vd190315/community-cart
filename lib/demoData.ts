import { products, type Product } from "./residentCatalog";

export const demoSociety = {
  name: "Green Meadows Residency",
  city: "Chennai",
  totalFlats: 150,
  inviteCode: "GMR2026"
} as const;

/** Single shared pilot cycle copy across resident, admin, and vendor. */
export const weeklyCycle = {
  cycleLabel: "28 Apr – 4 May 2026",
  statusLabel: "Ordering open",
  cutoffLabel: "Wednesday, 8:00 PM",
  deliveryLabel: "Friday evening",
  /** Short demo copy for resident post-payment screens */
  pickupWindowHint:
    "Pickup is usually the same evening as delivery—your society desk or group will share the exact window."
} as const;

const DEMO_LINE_TO_PRODUCT_ID = {
  "Tata Salt 1kg": "tata-salt-1kg",
  "India Gate Rice 5kg": "india-gate-rice-5kg",
  "Fortune Oil 1L": "fortune-oil-1l",
  "Aashirvaad Atta 5kg": "aashirvaad-atta-5kg",
  "Toor Dal 1kg": "toor-dal-1kg"
} as const;

function productForDemoLine(lineName: string): Product {
  const id = DEMO_LINE_TO_PRODUCT_ID[lineName as keyof typeof DEMO_LINE_TO_PRODUCT_ID];
  if (!id) {
    throw new Error(`Unknown demo catalog line: ${lineName}`);
  }
  const p = products.find((x) => x.id === id);
  if (!p) {
    throw new Error(`Missing product for demo: ${id}`);
  }
  return p;
}

function lineGross(line: { name: string; qty: number }): number {
  const p = productForDemoLine(line.name);
  return line.qty * p.price;
}

function lineSavings(line: { name: string; qty: number }): number {
  const p = productForDemoLine(line.name);
  return line.qty * (p.savingsPerUnit ?? 0);
}

function lineNet(line: { name: string; qty: number }): number {
  return lineGross(line) - lineSavings(line);
}

function sumLines(
  items: readonly { name: string; qty: number }[],
  fn: (line: { name: string; qty: number }) => number
): number {
  return items.reduce((s, line) => s + fn(line), 0);
}

/** Per-flat lines are the source of truth for quantities; totals and GMV derive from here + catalog. */
export const vendorPackingHouseholds = [
  {
    flat: "A-302",
    resident: "Anita Iyer",
    items: [
      { name: "Tata Salt 1kg", qty: 3 },
      { name: "India Gate Rice 5kg", qty: 4 },
      { name: "Fortune Oil 1L", qty: 3 },
      { name: "Aashirvaad Atta 5kg", qty: 2 },
      { name: "Toor Dal 1kg", qty: 2 }
    ]
  },
  {
    flat: "B-1204",
    resident: "Priya Raman",
    items: [
      { name: "Tata Salt 1kg", qty: 3 },
      { name: "India Gate Rice 5kg", qty: 5 },
      { name: "Fortune Oil 1L", qty: 4 },
      { name: "Aashirvaad Atta 5kg", qty: 3 },
      { name: "Toor Dal 1kg", qty: 2 }
    ]
  },
  {
    flat: "C-905",
    resident: "Rahul Menon",
    items: [
      { name: "Tata Salt 1kg", qty: 3 },
      { name: "India Gate Rice 5kg", qty: 4 },
      { name: "Fortune Oil 1L", qty: 4 },
      { name: "Aashirvaad Atta 5kg", qty: 2 },
      { name: "Toor Dal 1kg", qty: 3 }
    ]
  },
  {
    flat: "D-1102",
    resident: "Shreya Nair",
    items: [
      { name: "Tata Salt 1kg", qty: 3 },
      { name: "India Gate Rice 5kg", qty: 5 },
      { name: "Fortune Oil 1L", qty: 4 },
      { name: "Aashirvaad Atta 5kg", qty: 3 },
      { name: "Toor Dal 1kg", qty: 2 }
    ]
  }
] as const;

function buildConsolidated(
  households: readonly { items: readonly { name: string; qty: number }[] }[]
): { name: string; units: number }[] {
  const totals = new Map<string, number>();
  for (const h of households) {
    for (const item of h.items) {
      totals.set(item.name, (totals.get(item.name) ?? 0) + item.qty);
    }
  }
  const order = households[0]?.items.map((i) => i.name) ?? [];
  return order.map((name) => ({ name, units: totals.get(name) ?? 0 }));
}

export const consolidatedItems = buildConsolidated(vendorPackingHouseholds);

const HOUSEHOLD_PAYMENT: Record<string, "Paid" | "Pending"> = {
  "C-905": "Pending"
};

export const adminHouseholdOrders = vendorPackingHouseholds.map((h) => ({
  flat: h.flat,
  resident: h.resident,
  amount: sumLines(h.items, lineNet),
  paymentStatus: HOUSEHOLD_PAYMENT[h.flat] ?? "Paid"
}));

/** Paid flats only — quantities for the vendor sheet RWA sends after collections. */
export const consolidatedItemsPaidOrders = buildConsolidated(
  vendorPackingHouseholds.filter((h) => (HOUSEHOLD_PAYMENT[h.flat] ?? "Paid") === "Paid")
);

/** Flat-wise lines for paid households only (vendor packing / dispatch). */
export const vendorPackingHouseholdsPaid = vendorPackingHouseholds.filter(
  (h) => (HOUSEHOLD_PAYMENT[h.flat] ?? "Paid") === "Paid"
);

/** Net payable summed for paid households only (matches dashboard rows with “Paid”). */
export const paidHouseholdsNetTotal = adminHouseholdOrders
  .filter((o) => o.paymentStatus === "Paid")
  .reduce((sum, o) => sum + o.amount, 0);

/** Catalogue savings attributed to paid flats only (for consolidation summary). */
export const paidHouseholdsEstimatedSavings = vendorPackingHouseholds
  .filter((h) => (HOUSEHOLD_PAYMENT[h.flat] ?? "Paid") === "Paid")
  .reduce((s, h) => s + sumLines(h.items, lineSavings), 0);

/** List-price GMV for paid flats only (matches vendor sheet scope). */
export const paidHouseholdsGrossTotal = vendorPackingHouseholdsPaid.reduce(
  (s, h) => s + sumLines(h.items, lineGross),
  0
);

const grossAllHouseholds = vendorPackingHouseholds.reduce(
  (s, h) => s + sumLines(h.items, lineGross),
  0
);
const savingsAllHouseholds = vendorPackingHouseholds.reduce(
  (s, h) => s + sumLines(h.items, lineSavings),
  0
);

export const pilotMetrics = {
  participatingHouseholds: vendorPackingHouseholds.length,
  paidHouseholds: adminHouseholdOrders.filter((o) => o.paymentStatus === "Paid").length,
  totalGmv: grossAllHouseholds,
  estimatedSavings: savingsAllHouseholds
} as const;

/** Shared order / cycle id format for resident confirmation, admin handoff, and vendor context. */
export const orderIdPattern = "CC-GMR-2026";
export const sampleOrderId = `${orderIdPattern}-1042`;

export const residentProfile = {
  name: "Priya Raman",
  flat: "B-1204"
} as const;

export const demoResidents = vendorPackingHouseholds.map((h) => ({
  flat: h.flat,
  name: h.resident
}));

/** Resident-facing stages on order status (shared timeline labels). */
export const residentOrderStages = [
  "Paid",
  "Packed",
  "Delivered to society gate",
  "Ready for pickup"
] as const;

export type ResidentOrderStage = (typeof residentOrderStages)[number];

/** Per-supplier leg when one paid order is fulfilled by multiple vendors (same order / cycle id). */
export type DemoResidentVendorFulfillmentLeg = {
  vendorName: string;
  currentStage: ResidentOrderStage;
};

/** Admin batch stages (coordinator tracking). */
export const adminBatchStages = [
  "Sent to vendor",
  "Packing",
  "Dispatched",
  "Delivered to society gate"
] as const;

export type DemoAdminVendorFulfillmentLeg = {
  vendorName: string;
  statusLabel: string;
  nextStepLabel: string;
};

/**
 * Aligned demo progression: resident view vs admin consolidated handoff (same story, role-specific labels).
 * Indices line up: Paid / Sent to vendor → Packed / Packing → gate delivery → pickup-ready.
 *
 * Split fulfillment: when `vendorFulfillmentLegs` has 2+ entries, resident + admin tracking UIs show
 * per-vendor sections for the same order id. Use `[]` for a single consolidated supplier (default).
 */
export const demoOrderProgress = {
  resident: {
    stages: residentOrderStages,
    currentStage: "Packed" as const satisfies ResidentOrderStage,
    /**
     * Two+ legs → resident order-status shows per-supplier cards. Replace with `[]` for a single
     * consolidated timeline only.
     */
    vendorFulfillmentLegs: [
      { vendorName: "FreshCart Hub", currentStage: "Packed" },
      { vendorName: "Society Supplies Co.", currentStage: "Paid" }
    ] as const satisfies readonly DemoResidentVendorFulfillmentLeg[]
  },
  admin: {
    stages: adminBatchStages,
    currentStageIndex: 1 as const,
    statusLabel: "Packing" as const,
    nextStepLabel: "Vendor finishing flat-wise bags" as const,
    vendorFulfillmentLegs: [
      {
        vendorName: "FreshCart Hub",
        statusLabel: "Packing",
        nextStepLabel: "Vendor finishing flat-wise bags"
      },
      {
        vendorName: "Society Supplies Co.",
        statusLabel: "Sent to vendor",
        nextStepLabel: "Batch queued for this partner"
      }
    ] as const satisfies readonly DemoAdminVendorFulfillmentLeg[]
  }
} as const;

/** Net society rate per unit after bulk discount (matches payable math in resident demo). */
function societyNetRatePerDemoLine(lineName: string): number {
  const p = productForDemoLine(lineName);
  return Math.max(0, p.price - (p.savingsPerUnit ?? 0));
}

/** Split integer units across N vendors; first `remainder` vendors get one extra unit. */
function splitUnitsAcrossVendors(
  totalUnits: number,
  vendorNames: readonly string[]
): { vendorName: string; units: number }[] {
  if (vendorNames.length === 0) {
    return [];
  }
  const n = vendorNames.length;
  const base = Math.floor(totalUnits / n);
  const remainder = totalUnits % n;
  return vendorNames
    .map((vendorName, i) => ({
      vendorName,
      units: base + (i < remainder ? 1 : 0)
    }))
    .filter((x) => x.units > 0);
}

export type ConsolidationVendorRoutingRow = {
  vendorName: string;
  productName: string;
  units: number;
  societyRatePerUnit: number;
};

export type ConsolidationVendorRouting = {
  isSplit: boolean;
  /** When `isSplit` is false, use this name in the single-vendor summary line. */
  singleVendorName: string;
  /** Populated when `isSplit`; each row is one vendor × product slice of the paid batch. */
  rows: ConsolidationVendorRoutingRow[];
};

/**
 * Read-only routing for the admin consolidation screen: same paid SKU totals as
 * `consolidatedItemsPaidOrders`, allocated across `demoOrderProgress.admin.vendorFulfillmentLegs`.
 * No network I/O — pilot demo only.
 */
export function getConsolidationVendorRouting(): ConsolidationVendorRouting {
  const vendorNames = demoOrderProgress.admin.vendorFulfillmentLegs.map((l) => l.vendorName);

  if (vendorNames.length <= 1) {
    return {
      isSplit: false,
      singleVendorName: vendorNames[0] ?? "FreshCart Hub",
      rows: []
    };
  }

  const rows: ConsolidationVendorRoutingRow[] = [];
  for (const item of consolidatedItemsPaidOrders) {
    const parts = splitUnitsAcrossVendors(item.units, vendorNames);
    const rate = societyNetRatePerDemoLine(item.name);
    for (const p of parts) {
      rows.push({
        vendorName: p.vendorName,
        productName: item.name,
        units: p.units,
        societyRatePerUnit: rate
      });
    }
  }

  return { isSplit: true, singleVendorName: vendorNames[0] ?? "", rows };
}
