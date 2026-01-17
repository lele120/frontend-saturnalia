import { useState, useEffect } from 'react'
import { Container, Typography, Button, Alert, Box, TextField } from '@mui/material'
import ItemList from './components/ItemList'
import ItemForm from './components/ItemForm'
import { getItems, createItem, updateItem, deleteItem, ItemsResponse } from './services/apiService'
import { Item } from './types'

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [sortField, setSortField] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [descriptionFilter, setDescriptionFilter] = useState<string>('')
  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)

  useEffect(() => {
    fetchItems()
  }, [sortField, sortOrder, descriptionFilter, page, pageSize])

  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getItems(page * pageSize, pageSize, sortField, sortOrder, descriptionFilter || undefined)
      setItems(data.items)
      setTotal(data.total)
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TextField
          label="Filter by Description"
          variant="outlined"
          value={descriptionFilter}
          onChange={(e) => setDescriptionFilter(e.target.value)}
          sx={{ minWidth: 300 }}
        />
      </Box>
      <ItemList 
        items={items} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        sortField={sortField} 
        sortOrder={sortOrder} 
        onSortChange={handleSortChange} 
        total={total} 
        page={page} 
        pageSize={pageSize} 
        onPageChange={setPage} 
        onPageSizeChange={setPageSize} />
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
