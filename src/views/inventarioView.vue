<template>
  <div>
    <!-- NavBar negro -->
    <nav class="navbar"></nav>

    <!-- Fila de búsqueda -->
    <div class="search-bar">
      <input
        class="search-input"
        v-model="search"
        placeholder="Buscar Producto"
        @keyup.enter="applyFilters"
      />
      <select class="category-select" v-model="selectedCategory" @change="applyFilters">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <button class="search-btn" @click="applyFilters">
        <span class="material-icons">search</span>
      </button>
    </div>

    <!-- Tabla de productos -->
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
              title="Stock bajo"
            >
              ⚠️
            </span>
          </td>
          <td>
            <button class="icon-btn edit" @click="editProduct(item)" title="Editar">
              <span class="material-icons">edit</span>
            </button>
            <button class="icon-btn delete" @click="deleteProduct(item)" title="Eliminar">
              <span class="material-icons">delete</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modales -->
    <AddProductComponent
      v-if="showModal"
      @save="handleSave"
      @close="showModal = false"
    />

    <EditProductComponent
      v-if="showEditModal && selectedProduct"
      :product="selectedProduct"
      @save="handleSave"
      @close="showEditModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
const filteredProducts = ref<Product[]>([])

// Cargar productos desde el backend
async function fetchProducts() {
  try {
    const data = await getProducts()
    products.value = data.map((item: any) => ({
      id: item.id,
      codigo: item.codigo,
      nombre: item.producto,
      categoria: item.categoria,
      stock: item.stock,
      stockMinimo: item.minStock,
      unidad: item.uM,
    }))
    applyFilters()
  } catch (error) {
    console.error('Error al cargar los productos:', error)
    alert('Ocurrió un error al cargar los productos')
  }
}

onMounted(() => {
  fetchProducts()
})

// Categorías únicas
const categories = computed<string[]>(() => [...new Set(products.value.map(p => p.categoria))])

// Filtrar productos por búsqueda y categoría
function applyFilters() {
  filteredProducts.value = products.value.filter((p) => {
    const matchesSearch = p.nombre?.toLowerCase().includes(search.value.toLowerCase()) || false
    const matchesCategory = selectedCategory.value ? p.categoria === selectedCategory.value : true
    return matchesSearch && matchesCategory
  })
}

// Guardar cambios y recargar productos
function handleSave() {
  fetchProducts()
  showModal.value = false
  showEditModal.value = false
}

// Editar producto
function editProduct(item: Product) {
  selectedProduct.value = { ...item }
  showEditModal.value = true
}

// Eliminar producto
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

// Alerta de stock bajo
function showStockAlert(item: Product) {
  alert(`El producto "${item.nombre}" tiene un stock bajo (${item.stock} unidades).`);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.navbar {
  width: 100%;
  height: 48px;
  background: #111;
  margin-bottom: 1.5rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: #fff;
  padding: 1rem 1.5rem 1rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.search-input, .category-select {
  padding: 0.5rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.search-btn {
  background: #3b82f6;
  border: none;
  border-radius: 4px;
  color: #fff;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  transition: background 0.2s;
}
.search-btn:hover {
  background: #2563eb;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  color: #333;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
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
.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  margin-right: 0.2rem;
  display: inline-flex;
  align-items: center;
  font-size: 1.3rem;
  transition: background 0.2s;
}
.icon-btn.edit {
  color: #22c55e;
}
.icon-btn.edit:hover {
  background: #e0fbe6;
}
.icon-btn.delete {
  color: #ef4444;
}
.icon-btn.delete:hover {
  background: #fee2e2;
}
</style>
