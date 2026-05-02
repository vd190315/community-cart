'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { getMealBuilderData, MealBuilderData } from '@/lib/mealBuilderData'

type MealCard = {
  id: string
  label: string
  title: string
  description: string
  ingredientsUsed: string[]
  missingIngredients: string
  steps: string[]
  image: string
  theme: string
  accent: string
}

export default function ResidentMealBuilderPage() {
  const [data, setData] = useState<MealBuilderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])

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
      missingIngredients: 'Optional mustard seeds or lemon',
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
      missingIngredients: 'Optional coriander leaves',
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
      missingIngredients: 'Optional curd for a richer curry base',
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
    new Set(meals.map((meal) => meal.missingIngredients))
  ).join(' · ')

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
                  {meal.missingIngredients}
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

      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <Button href="/resident/home" variant="outline" className="w-full">
          Back to home
        </Button>
      </section>
    </div>
  )
}