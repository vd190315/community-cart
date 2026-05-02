'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [result, setResult] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, household_id, final_amount, payment_status')
        .eq('payment_status', 'paid')
        .limit(1)
        .single()

      if (orderError) {
        setError(`Order error: ${orderError.message}`)
        setLoading(false)
        return
      }

      const { data: orderItems, error: orderItemsError } = await supabase
        .from('order_items')
        .select('item_name_snapshot, quantity, line_total')
        .eq('order_id', order.id)
        .order('item_name_snapshot', { ascending: true })

      if (orderItemsError) {
        setError(`Order items error: ${orderItemsError.message}`)
        setLoading(false)
        return
      }

      const { data: pantryItems, error: pantryError } = await supabase
        .from('pantry_items')
        .select('item_name, confidence_level')
        .eq('household_id', order.household_id)
        .order('item_name', { ascending: true })

      if (pantryError) {
        setError(`Pantry error: ${pantryError.message}`)
        setLoading(false)
        return
      }

      setResult({
        order,
        orderItems,
        pantryItems,
      })

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>

  return (
    <div style={{ padding: 24 }}>
      <h1>Meal Builder Data Debug</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}