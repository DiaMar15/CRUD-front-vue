const API_URL = 'http://localhost:3333/api/v1/inventario'

export const getProducts = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error al obtener productos')
  return await response.json()
}

export const deleteProduct = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Error al eliminar producto')
  return await response.json()
}

export const updateProduct = async (id: number, data: any) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Error al actualizar producto')
  return await response.json()
}

export const createProduct = async (data: any) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Error al crear producto')
  return await response.json()
}
