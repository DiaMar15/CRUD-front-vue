import axios from 'axios'

const API_URL = 'http://localhost:3333/api/v1/inventario'

export const getProducts = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const deleteProduct = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}

export const updateProduct = async (id: number, data: any) => {
  const response = await axios.put(`${API_URL}/${id}`, data)
  return response.data
}

export const createProduct = async (data: any) => {
  const response = await axios.post(API_URL, data)
  return response.data
}
