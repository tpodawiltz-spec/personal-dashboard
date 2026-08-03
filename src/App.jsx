import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  async function loadItems() {
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setStatus(`Error loading: ${error.message}`)
      return
    }
    setItems(data)
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function handleSave() {
    if (!message.trim()) return
    const { error } = await supabase
      .from('test_items')
      .insert({ message })

    if (error) {
      setStatus(`Error saving: ${error.message}`)
      return
    }
    setMessage('')
    setStatus('Saved!')
    loadItems()
  }

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Supabase connection test</h1>
      <p>{status}</p>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a test message"
      />
      <button type="button" onClick={handleSave}>
        Save to database
      </button>

      <h2>Saved items</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.message}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
