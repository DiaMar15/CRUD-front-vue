<template>
  <div class="inventory-container">
    <div class="controls">
      <button class="add-button" @click="showModal = true">Agregar producto</button>
      <input class="search-input" v-model="search" placeholder="Buscar Producto" />
      <select class="category-select" v-model="selectedCategory">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <table class="inventory-table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre Producto</th>
          <th>Categoría</th>
          <th>Stock</th>
          <th>Stock Mínimo</th>
          <th>Unidad de medida</th>
          <th>Alerta</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredProducts" :key="item.codigo" :class="{ 'low-stock': item.stock < item.stockMinimo }">
          <td>{{ item.codigo }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.categoria }}</td>
          <td>{{ item.stock }} {{ item.unidad }}</td>
          <td>{{ item.stockMinimo }} {{ item.unidad }}</td>
          <td>{{ item.unidad }}</td>
          <td>
            <span v-if="item.stock < item.stockMinimo" class="alert-icon" @click="showStockAlert(item)">⚠️</span>
          </td>
          <td>
            <button class="edit-button" @click="editProduct(item)">✏️ Editar</button>
            <button class="delete-button" @click="confirmDelete(item)">🗑️ Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AddProductComponent v-if="showModal" @save="addProduct" @close="showModal = false" />

    <EditProductComponent
      v-if="editingProduct"
      :product="editingProduct"
      @save="updateProduct"
      @close="editingProduct = null"
    />

    <ConfirmDeleteComponent
      :product="productToDelete"
      :showModal="showConfirmModal"
      @delete="deleteProduct"
      @close="closeConfirmModal"
    />

 
    <LowStockAlertComponent v-if="showAlertModal" :show="showAlertModal" :product="alertProduct" @close="closeAlertModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AddProductComponent from '@/components/AddProductComponent.vue'
import EditProductComponent from '@/components/EditProductComponent.vue'
import ConfirmDeleteComponent from '@/components/ConfirmDeleteComponent.vue'
import LowStockAlertComponent from '@/components/LowStockAlertComponent.vue'

interface Product {
  codigo: string
  nombre: string
  categoria: string
  stock: number
  stockMinimo: number
  unidad: string
}

const search = ref<string>('')
const selectedCategory = ref<string>('')
const showModal = ref<boolean>(false)
const editingProduct = ref<Product | null>(null)
const showConfirmModal = ref<boolean>(false)
const productToDelete = ref<Product | null>(null)
const showAlertModal = ref<boolean>(false)
const alertProduct = ref<Product | null>(null)

const products = ref<Product[]>([
  { codigo: '001', nombre: 'Costilla de cerdo', categoria: 'Carnes', stock: 20, stockMinimo: 10, unidad: 'kilos' },
  { codigo: '012', nombre: 'Cerveza poker', categoria: 'Bebidas', stock: 30, stockMinimo: 50, unidad: 'Botellas' },
  { codigo: '035', nombre: 'Queso Doblecrema', categoria: 'Lacteos', stock: 8, stockMinimo: 5, unidad: 'kilos' },
  { codigo: '054', nombre: 'Tomate', categoria: 'Frutas y Verduras', stock: 7, stockMinimo: 10, unidad: 'kilos' },
  { codigo: '067', nombre: 'Arroz', categoria: 'Granos', stock: 15, stockMinimo: 25, unidad: 'kilos' }
])

const categories = computed<string[]>(() => [...new Set(products.value.map(p => p.categoria))])

const filteredProducts = computed<Product[]>(() => {
  return products.value.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = selectedCategory.value ? p.categoria === selectedCategory.value : true
    return matchesSearch && matchesCategory
  })
})

function addProduct(newProduct: Product) {
  products.value.push(newProduct)
  showModal.value = false
}

function editProduct(product: Product) {
  editingProduct.value = { ...product }
}

function updateProduct(updatedProduct: Product) {
  const index = products.value.findIndex(p => p.codigo === updatedProduct.codigo)
  if (index !== -1) {
    products.value[index] = updatedProduct
  }
  editingProduct.value = null
}

function confirmDelete(product: Product) {
  productToDelete.value = product
  showConfirmModal.value = true
}

function deleteProduct(product: Product) {
  const index = products.value.findIndex(p => p.codigo === product.codigo)
  if (index !== -1) {
    products.value.splice(index, 1)
  }
  closeConfirmModal()
}

function closeConfirmModal() {
  showConfirmModal.value = false
  productToDelete.value = null
}

function showStockAlert(product: Product) {
  alertProduct.value = product
  showAlertModal.value = true
}

function closeAlertModal() {
  showAlertModal.value = false
  alertProduct.value = null
}
</script>

<style scoped>
.inventory-container {
  padding: 1rem;
  font-family: Arial, sans-serif;
}
.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.add-button, .edit-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.add-button:hover, .edit-button:hover {
  background-color: #2563eb;
}
.search-input, .category-select {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.inventory-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  color: #333;
}
.inventory-table th, .inventory-table td {
  border: 1px solid #ddd;
  padding: 0.6rem;
  text-align: left;
}
.inventory-table th {
  background-color: #f4f4f4;
  color: #333;
}
.low-stock {
  background-color: #fa3142;
  color: #000000;
}
.alert-icon {
  color: red;
  font-size: 1.2rem;
  cursor: pointer;
}
button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #2563eb;
}
</style>
