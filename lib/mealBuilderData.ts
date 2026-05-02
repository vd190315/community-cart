export type MealBuilderOrderItem = {
  item_name_snapshot: string
  quantity: number
  line_total: number
}

export type MealBuilderPantryItem = {
  item_name: string
  confidence_level: number
}

export type MealBuilderData = {
  orderId: string
  householdId: string
  finalAmount: number
  orderItems: MealBuilderOrderItem[]
  pantryItems: MealBuilderPantryItem[]
}

export async function getMealBuilderData(): Promise<MealBuilderData> {
  return {
    orderId: 'demo-order-001',
    householdId: 'demo-household-001',
    finalAmount: 1590,
    orderItems: [
      { item_name_snapshot: 'Potato', quantity: 2, line_total: 80 },
      { item_name_snapshot: 'Onion', quantity: 1, line_total: 40 },
      { item_name_snapshot: 'Tomato', quantity: 1, line_total: 35 },
      { item_name_snapshot: 'Toor Dal', quantity: 1, line_total: 140 },
      { item_name_snapshot: 'Rice', quantity: 1, line_total: 320 },
      { item_name_snapshot: 'Wheat Atta', quantity: 1, line_total: 220 },
      { item_name_snapshot: 'Green Chilli', quantity: 1, line_total: 20 },
      { item_name_snapshot: 'Curry Leaves', quantity: 1, line_total: 10 },
      { item_name_snapshot: 'Turmeric Powder', quantity: 1, line_total: 30 },
      { item_name_snapshot: 'Sunflower Oil', quantity: 1, line_total: 180 },
    ],
    pantryItems: [
      { item_name: 'Salt', confidence_level: 0.95 },
      { item_name: 'Chilli Powder', confidence_level: 0.9 },
      { item_name: 'Mustard Seeds', confidence_level: 0.75 },
    ],
  }
}