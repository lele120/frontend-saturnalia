import { useState, useEffect } from 'react'
import { Container, Typography, Button, Alert, Box } from '@mui/material'
import ItemList from './components/ItemList'
import ItemForm from './components/ItemForm'
import { getItems, createItem, updateItem, deleteItem } from './services/apiService'
import { Item } from './types'

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [sortField, setSortField] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchItems()
  }, [sortField, sortOrder])

  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getItems(sortField, sortOrder)
      setItems(data)
    } catch {
      setError('Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    setSortField(field)
    setSortOrder(order)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteItem(id)
      setItems(items.filter(item => item.id !== id))
    } catch {
      setError('Failed to delete item')
    }
  }

  const handleSubmit = async (itemData: { name: string; description: string; price: string }) => {
    try {
      if (editingItem) {
        const updated = await updateItem(editingItem.id, itemData)
        setItems(items.map(item => item.id === editingItem.id ? updated : item))
      } else {
        const newItem = await createItem(itemData)
        setItems([...items, newItem])
      }
      setShowForm(false)
      setEditingItem(null)
    } catch {
      setError('Failed to save item')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Item Manager
      </Typography>
      {error && (
        // @ts-ignore
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading && (
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Loading...
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleAdd}
        >
          Add Item
        </Button>
      </Box>
      <ItemList items={items} onEdit={handleEdit} onDelete={handleDelete} sortField={sortField} sortOrder={sortOrder} onSortChange={handleSortChange} />
      {showForm && (
        <Box sx={{ mt: 4 }}>
          <ItemForm
            onSubmit={handleSubmit}
            initialItem={editingItem}
            onCancel={handleCancel}
          />
        </Box>
      )}
    </Container>
  )
}

export default App
