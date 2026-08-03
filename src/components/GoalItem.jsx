import { useState } from 'react'
import { supabase } from '../supabaseClient'
import ProgressBar from './ProgressBar'
import { computeGoalProgress } from '../utils/financialGoals'

function GoalItem({ goal, goals, contributions, onChange, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth === 0)
  const [contribSource, setContribSource] = useState('')
  const [contribAmount, setContribAmount] = useState('')
  const [contribActual, setContribActual] = useState(true)
  const [contribHub, setContribHub] = useState('')
  const [subGoalTitle, setSubGoalTitle] = useState('')
  const [subGoalTarget, setSubGoalTarget] = useState('')
  const [subGoalHub, setSubGoalHub] = useState('')

  const children = goals.filter((g) => g.parent_id === goal.id)
  const ownContributions = contributions.filter((c) => c.goal_id === goal.id)
  const { actual, planned, target } = computeGoalProgress(goal, goals, contributions)

  async function addContribution(e) {
    e.preventDefault()
    if (!contribSource.trim() || !contribAmount) return
    await supabase.from('goal_contributions').insert({
      goal_id: goal.id,
      source: contribSource,
      amount: Number(contribAmount),
      is_actual: contribActual,
      linked_hub: contribHub.trim() || null,
    })
    setContribSource('')
    setContribAmount('')
    setContribActual(true)
    setContribHub('')
    onChange()
  }

  async function deleteContribution(id) {
    await supabase.from('goal_contributions').delete().eq('id', id)
    onChange()
  }

  async function addSubGoal(e) {
    e.preventDefault()
    if (!subGoalTitle.trim()) return
    await supabase.from('financial_goals').insert({
      title: subGoalTitle,
      tier: goal.tier,
      parent_id: goal.id,
      target_amount: subGoalTarget ? Number(subGoalTarget) : null,
      linked_hub: subGoalHub.trim() || null,
    })
    setSubGoalTitle('')
    setSubGoalTarget('')
    setSubGoalHub('')
    onChange()
  }

  async function deleteGoal() {
    if (!confirm(`Delete "${goal.title}" and all its sub-goals/contributions?`)) return
    await supabase.from('financial_goals').delete().eq('id', goal.id)
    onChange()
  }

  return (
    <div className="goal-item" style={{ marginLeft: depth * 20 }}>
      <div className="goal-header" onClick={() => setExpanded((v) => !v)}>
        <span className="goal-toggle">{expanded ? '▾' : '▸'}</span>
        <span className="goal-title">{goal.title}</span>
        {goal.linked_hub && <span className="tag hub-tag">🔗 {goal.linked_hub}</span>}
      </div>

      <ProgressBar actual={actual} planned={planned} target={target} />

      {expanded && (
        <div className="goal-details">
          {ownContributions.length > 0 && (
            <ul className="item-list">
              {ownContributions.map((c) => (
                <li key={c.id}>
                  <span className={`tag ${c.is_actual ? 'actual' : 'planned'}`}>
                    {c.is_actual ? 'actual' : 'planned'}
                  </span>
                  <span className="item-name">
                    {c.source}
                    {c.linked_hub && <span className="hub-tag"> 🔗 {c.linked_hub}</span>}
                  </span>
                  <span className="item-amount">${Number(c.amount).toLocaleString()}</span>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => deleteContribution(c.id)}
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={addContribution} className="inline-form small">
            <input
              type="text"
              placeholder="Funding source (e.g. Wages, Gift, Scholarship)"
              value={contribSource}
              onChange={(e) => setContribSource(e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={contribAmount}
              onChange={(e) => setContribAmount(e.target.value)}
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={contribActual}
                onChange={(e) => setContribActual(e.target.checked)}
              />
              Received already
            </label>
            <input
              type="text"
              placeholder="Linked hub (optional, e.g. Baseball)"
              value={contribHub}
              onChange={(e) => setContribHub(e.target.value)}
            />
            <button type="submit">Add funding</button>
          </form>

          {children.map((child) => (
            <GoalItem
              key={child.id}
              goal={child}
              goals={goals}
              contributions={contributions}
              onChange={onChange}
              depth={depth + 1}
            />
          ))}

          <form onSubmit={addSubGoal} className="inline-form small">
            <input
              type="text"
              placeholder="Sub-goal title (e.g. Pay for 1st semester)"
              value={subGoalTitle}
              onChange={(e) => setSubGoalTitle(e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Target amount (optional)"
              value={subGoalTarget}
              onChange={(e) => setSubGoalTarget(e.target.value)}
            />
            <input
              type="text"
              placeholder="Linked hub (optional)"
              value={subGoalHub}
              onChange={(e) => setSubGoalHub(e.target.value)}
            />
            <button type="submit">Add sub-goal</button>
          </form>

          <button type="button" className="link-button danger" onClick={deleteGoal}>
            Delete this goal
          </button>
        </div>
      )}
    </div>
  )
}

export default GoalItem
