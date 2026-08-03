import { useState } from 'react'
import { supabase } from '../supabaseClient'

function NetWorthSection({ items, snapshots, onChange }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('asset')
  const [amount, setAmount] = useState('')

  const totalAssets = items
    .filter((i) => i.category === 'asset')
    .reduce((sum, i) => sum + Number(i.amount), 0)
  const totalLiabilities = items
    .filter((i) => i.category === 'liability')
    .reduce((sum, i) => sum + Number(i.amount), 0)
  const netWorth = totalAssets - totalLiabilities

  async function addItem(e) {
    e.preventDefault()
    if (!name.trim() || !amount) return
    await supabase
      .from('net_worth_items')
      .insert({ name, category, amount: Number(amount) })
    setName('')
    setAmount('')
    onChange()
  }

  async function deleteItem(id) {
    await supabase.from('net_worth_items').delete().eq('id', id)
    onChange()
  }

  async function saveSnapshot() {
    await supabase.from('net_worth_snapshots').insert({ total: netWorth })
    onChange()
  }

  const recentSnapshots = [...snapshots]
    .sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at))
    .slice(0, 5)

  return (
    <section className="card">
      <h2>Net Worth</h2>
      <p className={`net-worth-total ${netWorth >= 0 ? 'positive' : 'negative'}`}>
        ${netWorth.toLocaleString()}
      </p>
      <p className="muted">
        ${totalAssets.toLocaleString()} in assets &minus; $
        {totalLiabilities.toLocaleString()} in liabilities
      </p>

      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id}>
            <span className={`tag ${item.category}`}>{item.category}</span>
            <span className="item-name">{item.name}</span>
            <span className="item-amount">${Number(item.amount).toLocaleString()}</span>
            <button type="button" className="link-button" onClick={() => deleteItem(item.id)}>
              remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={addItem} className="inline-form">
        <input
          type="text"
          placeholder="Name (e.g. Checking account)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="asset">Asset</option>
          <option value="liability">Liability</option>
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="snapshot-row">
        <button type="button" onClick={saveSnapshot}>
          Save net worth snapshot
        </button>
        {recentSnapshots.length > 0 && (
          <ul className="snapshot-list">
            {recentSnapshots.map((s) => (
              <li key={s.id}>
                {new Date(s.recorded_at).toLocaleDateString()} &mdash; $
                {Number(s.total).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default NetWorthSection
