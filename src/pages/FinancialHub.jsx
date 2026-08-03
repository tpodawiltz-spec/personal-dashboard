import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import NetWorthSection from '../components/NetWorthSection'
import GoalsSection from '../components/GoalsSection'

function FinancialHub() {
  const [netWorthItems, setNetWorthItems] = useState([])
  const [snapshots, setSnapshots] = useState([])
  const [goals, setGoals] = useState([])
  const [contributions, setContributions] = useState([])
  const [error, setError] = useState('')

  async function loadAll() {
    const [itemsRes, snapshotsRes, goalsRes, contributionsRes] = await Promise.all([
      supabase.from('net_worth_items').select('*').order('created_at'),
      supabase.from('net_worth_snapshots').select('*').order('recorded_at'),
      supabase.from('financial_goals').select('*').order('created_at'),
      supabase.from('goal_contributions').select('*').order('created_at'),
    ])

    const firstError =
      itemsRes.error || snapshotsRes.error || goalsRes.error || contributionsRes.error
    if (firstError) {
      setError(firstError.message)
      return
    }

    setError('')
    setNetWorthItems(itemsRes.data)
    setSnapshots(snapshotsRes.data)
    setGoals(goalsRes.data)
    setContributions(contributionsRes.data)
  }

  useEffect(() => {
    loadAll()
  }, [])

  return (
    <div className="hub financial-hub">
      <h1>Financial</h1>
      {error && <p className="error-text">{error}</p>}

      <NetWorthSection items={netWorthItems} snapshots={snapshots} onChange={loadAll} />
      <GoalsSection goals={goals} contributions={contributions} onChange={loadAll} />
    </div>
  )
}

export default FinancialHub
