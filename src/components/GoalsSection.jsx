import { useState } from 'react'
import { supabase } from '../supabaseClient'
import GoalItem from './GoalItem'

const TIERS = [
  { key: 'short', label: 'Short-term' },
  { key: 'medium', label: 'Medium-term' },
  { key: 'long', label: 'Long-term' },
]

function GoalsSection({ goals, contributions, onChange }) {
  const [title, setTitle] = useState('')
  const [tier, setTier] = useState('short')
  const [targetAmount, setTargetAmount] = useState('')
  const [linkedHub, setLinkedHub] = useState('')

  const topLevelGoals = goals.filter((g) => g.parent_id === null)

  async function addGoal(e) {
    e.preventDefault()
    if (!title.trim()) return
    await supabase.from('financial_goals').insert({
      title,
      tier,
      target_amount: targetAmount ? Number(targetAmount) : null,
      linked_hub: linkedHub.trim() || null,
      parent_id: null,
    })
    setTitle('')
    setTargetAmount('')
    setLinkedHub('')
    onChange()
  }

  return (
    <section className="card">
      <h2>Goals</h2>

      <form onSubmit={addGoal} className="inline-form">
        <input
          type="text"
          placeholder="Goal title (e.g. Graduate debt-free with $50k saved)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          {TIERS.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Target amount (optional)"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Linked hub (optional, e.g. Baseball)"
          value={linkedHub}
          onChange={(e) => setLinkedHub(e.target.value)}
        />
        <button type="submit">Add goal</button>
      </form>

      {TIERS.map((t) => {
        const tierGoals = topLevelGoals.filter((g) => g.tier === t.key)
        if (tierGoals.length === 0) return null
        return (
          <div key={t.key} className="tier-group">
            <h3>{t.label}</h3>
            {tierGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                goals={goals}
                contributions={contributions}
                onChange={onChange}
              />
            ))}
          </div>
        )
      })}
    </section>
  )
}

export default GoalsSection
