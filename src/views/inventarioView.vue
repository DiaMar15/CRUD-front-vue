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
        <tr
          v-for="item in filteredProducts"
          :key="item.codigo"
          :class="{ 'low-stock': item.stock < item.stockMinimo }"
        >
          <td>{{ item.codigo }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.categoria }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.stockMinimo }}</td>
          <td>{{ item.unidad }}</td>
          <td>
            <span
              v-if="item.stock < item.stockMinimo"
              class="alert-icon"
              @click="showStockAlert(item)"
            >
              ⚠️
            </span>
          </td>
          <td>
            <button class="edit-button" @click="editProduct(item)">Editar</button>
            <button class="delete-button" @click="deleteProduct(item)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <AddProductComponent
      v-if="showModal"
      @save="handleSave"
      @close="showModal = false"
    />

    <EditProductComponent
      v-if="showEditModal"
      :product="selectedProduct"
      @save="handleSave"
      @close="showEditModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AddProductComponent from '@/components/AddProductComponent.vue'
import EditProductComponent from '@/components/EditProductComponent.vue'
import { getProducts, deleteProduct as deleteProductService } from '@/services/inventoryService'

interface Product {
  id: number 
  codigo: number
  nombre: string
  categoria: string
  stock: number
  stockMinimo: number
  unidad: string
}

const search = ref<string>('')
const selectedCategory = ref<string>('')
const showModal = ref<boolean>(false)
const showEditModal = ref<boolean>(false)
const products = ref<Product[]>([])
const selectedProduct = ref<Product | null>(null)

// Función para cargar productos desde el backend
async function fetchProducts() {
  try {
    const data = await getProducts()
    products.value = data.map((item: any) => ({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombreProducto,
      categoria: item.categoria,
      stock: item.stock,
      stockMinimo: item.minStock,
      unidad: item.uM,
    }))
  } catch (error) {
    console.error('Error al cargar los productos:', error)
    alert('Ocurrió un error al cargar los productos')
  }
}

// Llamar a la función para cargar los productos al montar el componente
onMounted(() => {
  fetchProducts()
})

// Computed para obtener las categorías únicas
const categories = computed<string[]>(() => [...new Set(products.value.map(p => p.categoria))])

// Computed para filtrar los productos según la búsqueda y la categoría seleccionada
const filteredProducts = computed<Product[]>(() => {
  return products.value.filter((p) => {
    const matchesSearch = p.nombre?.toLowerCase().includes(search.value.toLowerCase()) || false
    const matchesCategory = selectedCategory.value ? p.categoria === selectedCategory.value : true
    return matchesSearch && matchesCategory
  })
})

// Función para manejar el evento 'save' y recargar los datos
function handleSave() {
  fetchProducts() // Recargar los datos desde el backend
  showModal.value = false // Cerrar el modal de agregar
  showEditModal.value = false // Cerrar el modal de edición
}

// Función para editar un producto
function editProduct(item: Product) {
  selectedProduct.value = { ...item }; // Asegúrate de que `item` incluya el campo `id`
  showEditModal.value = true;
  console.log('Producto seleccionado para editar:', selectedProduct.value);
}

// Función para eliminar un producto
async function deleteProduct(item: Product) {
  const confirmed = confirm(`¿Estás seguro de que deseas eliminar el producto "${item.nombre}"?`)
  if (!confirmed) return

  try {
    await deleteProductService(item.id)
    fetchProducts()
    alert(`Producto "${item.nombre}" eliminado exitosamente`)
  } catch (error) {
    console.error('Error al eliminar el producto:', error)
    alert('Ocurrió un error al eliminar el producto')
  }
}

// Función para mostrar una alerta de stock bajo
function showStockAlert(item: Product) {
  alert(`El producto "${item.nombre}" tiene un stock bajo (${item.stock} unidades).`);
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
.delete-button {
  background-color: #f87171;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.delete-button:hover {
  background-color: #ef4444;
}
</style>
