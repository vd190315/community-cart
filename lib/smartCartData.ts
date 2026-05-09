import { products } from '@/lib/residentCatalog'

export type SmartCartPrefillMode = 'best-price' | 'preferred-vendor'

export type SmartCartSuggestion = {
  id: string
  productId: string
  suggestedQuantity: number
  reason: string
}

const PREFERRED_VENDOR_ID = 'freshcart-hub'

export const smartCartSuggestions: SmartCartSuggestion[] = [
  {
    id: 'smart-rice-ponni',
    productId: 'ponni-rice-5kg',
    suggestedQuantity: 1,
    reason: 'Frequently ordered staple',
  },
  {
    id: 'smart-dal',
    productId: 'toor-dal-1kg',
    suggestedQuantity: 1,
    reason: 'Weekly dal pattern',
  },
  {
    id: 'smart-oil',
    productId: 'sunflower-oil-1l',
    suggestedQuantity: 1,
    reason: 'Recurring cooking oil top-up',
  },
  {
    id: 'smart-onions',
    productId: 'onions-1kg',
    suggestedQuantity: 1,
    reason: 'Fresh produce usually added',
  },
  {
    id: 'smart-tomatoes',
    productId: 'tomatoes-1kg',
    suggestedQuantity: 1,
    reason: 'Fresh produce usually added',
  },
  {
    id: 'smart-milk',
    productId: 'milk-500ml',
    suggestedQuantity: 2,
    reason: 'Morning essentials pattern',
  },
  {
    id: 'smart-curd',
    productId: 'curd-400g',
    suggestedQuantity: 1,
    reason: 'Common weekly dairy add-on',
  },
  {
    id: 'smart-eggs',
    productId: 'eggs-12pcs',
    suggestedQuantity: 1,
    reason: 'Protein staple from past cycles',
  },
]

export function getSmartCartPrefillItems(mode: SmartCartPrefillMode) {
  return smartCartSuggestions
    .map((suggestion) => {
      const product = products.find((item) => item.id === suggestion.productId)
      if (!product) return null
      const bestPriceVendor = [...product.vendorOptions].sort((a, b) => a.price - b.price)[0]
      const preferredVendor =
        product.vendorOptions.find((option) => option.id === PREFERRED_VENDOR_ID) ??
        bestPriceVendor
      const chosenVendor = mode === 'best-price' ? bestPriceVendor : preferredVendor

      return {
        ...suggestion,
        productName: `${product.name} ${product.packSize}`,
        unitPrice: chosenVendor.price,
        vendorId: chosenVendor.id,
        vendorName: chosenVendor.vendorName,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}
