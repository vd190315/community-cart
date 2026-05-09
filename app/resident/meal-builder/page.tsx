'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  getMealBuilderData,
  getNeighborsWithIngredient,
  MealBuilderData,
  type DemoNeighborProfile,
} from '@/lib/mealBuilderData'

type MealCard = {
  id: string
  label: string
  title: string
  description: string
  ingredientsUsed: string[]
  missingIngredients: { ingredient: string; quantity: number }[]
  steps: string[]
  image: string
  theme: string
  accent: string
}

type IngredientRequest = {
  id: string
  mealTitle: string
  ingredient: string
  quantity: number
  requesterName: string
  requesterFlat: string
  recipientName: string
  recipientFlat: string
  status: 'pending' | 'approved' | 'declined'
}

function formatIngredientQuantityLabel(ingredient: string, quantity: number): string {
  const normalized = ingredient.toLowerCase()
  if (quantity === 1) {
    return `1 ${normalized}`
  }
  if (normalized.endsWith('o')) {
    return `${quantity} ${normalized}es`
  }
  return `${quantity} ${normalized}s`
}

export default function ResidentMealBuilderPage() {
  const [data, setData] = useState<MealBuilderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [activeMissingIngredient, setActiveMissingIngredient] = useState<{
    mealId: string
    mealTitle: string
    ingredient: string
    quantity: number
  } | null>(null)
  const [ingredientRequests, setIngredientRequests] = useState<IngredientRequest[]>([])

  const requesterProfile = {
    name: 'Meera',
    flat: 'C-702',
  }

  useEffect(() => {
    const loadMealBuilderData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await getMealBuilderData()
        setData(result)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load meal builder data.')
      } finally {
        setLoading(false)
      }
    }

    loadMealBuilderData()
  }, [])

  const orderedIngredients =
    data?.orderItems.map((item) => item.item_name_snapshot).filter(Boolean) ?? []

  const pantryIngredients =
    data?.pantryItems.map((item) => item.item_name).filter(Boolean) ?? []

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    )
  }

  const activeIngredients =
    selectedIngredients.length > 0 ? selectedIngredients : orderedIngredients

  const meals: MealCard[] = [
    {
      id: 'breakfast',
      label: 'Breakfast idea',
      title: 'Simple Spiced Potato Breakfast Bowl',
      description:
        'A quick breakfast built around potatoes, onions, green chilli, curry leaves, and pantry spices you likely already have.',
      ingredientsUsed: [
        'Potato',
        'Onion',
        'Green Chilli',
        'Curry Leaves',
        'Turmeric Powder',
        'Sunflower Oil',
      ],
      missingIngredients: [{ ingredient: 'Mustard Seeds', quantity: 1 }],
      steps: [
        'Heat oil and add green chilli with curry leaves.',
        'Add onion and potato, then sauté with turmeric and salt.',
        'Finish warm and serve as a quick breakfast bowl.',
      ],
      image: '/meals-breakfast.jpg',
      theme: 'from-amber-200 via-orange-100 to-yellow-50',
      accent: 'text-orange-700',
    },
    {
      id: 'lunch',
      label: 'Lunch idea',
      title: 'Tomato Dal with Rice',
      description:
        'A practical lunch using your dal, tomato, onion, green chilli, rice, and basic pantry staples.',
      ingredientsUsed: [
        'Tomato',
        'Toor Dal',
        'Onion',
        'Green Chilli',
        'Curry Leaves',
        'Rice',
        'Turmeric Powder',
      ],
      missingIngredients: [{ ingredient: 'Tomato', quantity: 2 }],
      steps: [
        'Cook dal until soft with turmeric and a little salt.',
        'Temper onion, chilli, curry leaves, and tomato in oil.',
        'Mix into the dal and serve hot with steamed rice.',
      ],
      image: '/meals-lunch.jpg',
      theme: 'from-emerald-200 via-lime-100 to-white',
      accent: 'text-emerald-700',
    },
    {
      id: 'dinner',
      label: 'Dinner idea',
      title: 'Aloo Curry with Soft Chapaties',
      description:
        'A comforting dinner using atta, potato, onion, tomato, and pantry spices from this week’s cart.',
      ingredientsUsed: [
        'Wheat Atta',
        'Potato',
        'Onion',
        'Tomato',
        'Chilli Powder',
        'Sunflower Oil',
      ],
      missingIngredients: [{ ingredient: 'Curd', quantity: 1 }],
      steps: [
        'Knead atta with water and rest the dough.',
        'Cook onion, tomato, spices, and potato into a simple curry.',
        'Roll and roast chapaties, then serve hot with the curry.',
      ],
      image: '/meals-dinner.jpg',
      theme: 'from-rose-100 via-orange-50 to-white',
      accent: 'text-rose-700',
    },
  ]

  const normalizedActiveIngredients = activeIngredients.map((item) => item.toLowerCase())

  const mealsWithMatch = useMemo(() => {
    return meals
      .map((meal) => {
        const matchCount = meal.ingredientsUsed.filter((ingredient) =>
          normalizedActiveIngredients.includes(ingredient.toLowerCase())
        ).length

        return {
          ...meal,
          matchCount,
        }
      })
      .sort((a, b) => b.matchCount - a.matchCount)
      .map((meal, index) => ({
        ...meal,
        isBestMatch: index === 0 && meal.matchCount > 0,
      }))
  }, [normalizedActiveIngredients])

  const allMissingIngredients = Array.from(
    new Set(meals.flatMap((meal) => meal.missingIngredients.map((item) => item.ingredient)))
  ).join(' · ')

  const neighborsForActiveIngredient = useMemo(() => {
    if (!activeMissingIngredient) return []
    return getNeighborsWithIngredient(activeMissingIngredient.ingredient)
  }, [activeMissingIngredient])

  const requestForMissingIngredient = (mealId: string, ingredient: string) =>
    ingredientRequests.find(
      (request) => request.mealTitle === meals.find((meal) => meal.id === mealId)?.title && request.ingredient === ingredient
    )

  const sendIngredientRequest = (neighbor: DemoNeighborProfile) => {
    if (!activeMissingIngredient) return

    const nextRequest: IngredientRequest = {
      id: `${activeMissingIngredient.mealId}-${activeMissingIngredient.ingredient}-${neighbor.id}`,
      mealTitle: activeMissingIngredient.mealTitle,
      ingredient: activeMissingIngredient.ingredient,
      quantity: activeMissingIngredient.quantity,
      requesterName: requesterProfile.name,
      requesterFlat: requesterProfile.flat,
      recipientName: neighbor.name,
      recipientFlat: neighbor.flat,
      status: 'pending',
    }

    setIngredientRequests((prev) => {
      const withoutCurrent = prev.filter(
        (request) =>
          !(request.mealTitle === nextRequest.mealTitle && request.ingredient === nextRequest.ingredient)
      )
      return [...withoutCurrent, nextRequest]
    })
    setActiveMissingIngredient(null)
  }

  const updateRequestStatus = (requestId: string, status: 'approved' | 'declined') => {
    setIngredientRequests((prev) =>
      prev.map((request) => (request.id === requestId ? { ...request, status } : request))
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">AI Meal Builder</h1>
          <p className="mt-2 text-sm text-slate-600">
            Loading your grocery-based meal ideas...
          </p>
          <div className="mt-4">
            <Button href="/resident/home" variant="outline" className="w-full">
              Back to home
            </Button>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">AI Meal Builder</h1>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <div className="mt-4">
            <Button href="/resident/home" variant="outline" className="w-full">
              Back to home
            </Button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              AI Meal Builder
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              Cook with this week&apos;s cart
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Demo suggestions based on a typical Green Meadows weekly basket and your
              pantry profile.
            </p>
          </div>

          <div className="sm:w-auto w-full">
            <Button href="/resident/home" variant="outline" className="w-full">
              Back to home
            </Button>
          </div>
        </div>

        {data?.finalAmount ? (
          <div className="mt-4 inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800">
            Order total: ₹{data.finalAmount}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Choose ingredients to cook with</h2>
        <p className="mt-2 text-sm text-slate-600">
          Tap ingredients from your order to personalize meal ideas.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          If nothing is selected, we use your full order by default.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {orderedIngredients.map((ingredient) => {
            const isSelected =
              selectedIngredients.length === 0 || selectedIngredients.includes(ingredient)

            return (
              <button
                key={ingredient}
                type="button"
                onClick={() => toggleIngredient(ingredient)}
                className={[
                  'rounded-full border px-3 py-1.5 text-sm transition',
                  isSelected
                    ? 'border-green-700 bg-green-50 text-green-800'
                    : 'border-slate-300 bg-white text-slate-700',
                ].join(' ')}
              >
                {ingredient}
              </button>
            )
          })}
        </div>

        {pantryIngredients.length > 0 ? (
          <p className="mt-4 text-xs text-slate-500">
            Pantry support: {pantryIngredients.join(', ')}.
          </p>
        ) : (
          <p className="mt-4 text-xs text-slate-500">
            For this demo, we assume a basic home spice box and staples.
          </p>
        )}

        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Building ideas with: {activeIngredients.join(', ')}
        </div>
      </section>

      <section className="grid gap-5">
        {mealsWithMatch.map((meal) => (
          <article
            key={meal.id}
            className={`overflow-hidden rounded-3xl bg-white shadow-sm ${
              meal.matchCount === 0 ? 'opacity-80' : ''
            }`}
          >
            <img
              src={meal.image}
              alt={meal.title}
              className="h-44 w-full object-cover"
            />

            <div className={`bg-gradient-to-r ${meal.theme} px-6 py-5`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${meal.accent}`}>
                    {meal.label}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{meal.title}</h3>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full bg-white/80 px-3 py-1 text-xs font-medium ${meal.accent}`}>
                    {meal.matchCount}/{meal.ingredientsUsed.length} match
                  </span>
                  {meal.isBestMatch ? (
                    <span className="rounded-full bg-green-700 px-3 py-1 text-xs font-medium text-white">
                      Best match
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <p className="text-sm text-slate-600">{meal.description}</p>

              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-900">
                  Match score: {meal.matchCount}/{meal.ingredientsUsed.length} selected ingredients
                </p>
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-medium text-slate-900">Ingredients used:</span>{' '}
                  {meal.ingredientsUsed.join(', ')}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Missing ingredients:</span>{' '}
                  {meal.missingIngredients.map((missing) => {
                    const request = requestForMissingIngredient(meal.id, missing.ingredient)

                    return (
                      <span
                        key={`${meal.id}-${missing.ingredient}`}
                        className="mt-2 block rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <span className="font-medium text-slate-900">
                          {missing.ingredient} ({missing.quantity})
                        </span>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMissingIngredient({
                                mealId: meal.id,
                                mealTitle: meal.title,
                                ingredient: missing.ingredient,
                                quantity: missing.quantity,
                              })
                            }
                            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                          >
                            Check with neighbors
                          </button>

                          {request ? (
                            <span className="text-xs text-slate-700">
                              {request.status === 'pending' ? (
                                <>
                                  Request sent to {request.recipientName} · {request.recipientFlat} ·{' '}
                                  <span className="font-medium text-amber-700">Pending approval</span>
                                </>
                              ) : request.status === 'approved' ? (
                                <span className="font-medium text-green-700">
                                  Approved by {request.recipientName} · {request.recipientFlat}
                                </span>
                              ) : (
                                <span className="font-medium text-rose-700">
                                  Declined by {request.recipientName} · {request.recipientFlat}
                                </span>
                              )}
                            </span>
                          ) : null}
                        </div>
                      </span>
                    )
                  })}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900">Quick steps</h4>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
                  {meal.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Next week helper</h2>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;ll remember these missing items for your next cycle: {allMissingIngredients}.
        </p>
      </section>

      {ingredientRequests.length > 0 ? (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Incoming ingredient requests (demo)</h2>
          <p className="mt-1 text-xs text-slate-500">
            Recipient-side mock approval state for selected neighbors.
          </p>

          <div className="mt-4 space-y-3">
            {ingredientRequests.map((request) => (
              <article
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm"
              >
                <p className="text-slate-900">
                  {request.requesterName} from {request.requesterFlat} is requesting{' '}
                  {formatIngredientQuantityLabel(request.ingredient, request.quantity)} for{' '}
                  <span className="font-medium">{request.mealTitle}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Recipient: {request.recipientName} · {request.recipientFlat}
                </p>

                {request.status === 'pending' ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateRequestStatus(request.id, 'approved')}
                      className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => updateRequestStatus(request.id, 'declined')}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <p
                    className={`mt-3 text-xs font-medium ${
                      request.status === 'approved' ? 'text-green-700' : 'text-rose-700'
                    }`}
                  >
                    {request.status === 'approved' ? 'Approved' : 'Declined'}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <Button href="/resident/home" variant="outline" className="w-full">
          Back to home
        </Button>
      </section>

      {activeMissingIngredient ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Neighbors who have this item</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {activeMissingIngredient.ingredient} for {activeMissingIngredient.mealTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMissingIngredient(null)}
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {neighborsForActiveIngredient.length > 0 ? (
                neighborsForActiveIngredient.map((neighbor) => (
                  <div
                    key={neighbor.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {neighbor.name} · {neighbor.flat}
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          Ingredient available: {activeMissingIngredient.ingredient}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">From this week&apos;s cart</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => sendIngredientRequest(neighbor)}
                        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                      >
                        Send request
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No opted-in neighbors currently have this ingredient in their demo cart.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}