<template>
  <div>
    <h1>Factura de Compra</h1>
    <button @click="showForm = true" class="btn-nueva">Nueva Factura</button>

    <!-- Formulario para crear/editar -->
    <div v-if="showForm" class="form-container horizontal-form">
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label>Número de factura</label>
            <input v-model="form.numero_factura" inputmode="numeric" pattern="[0-9]*" required />
          </div>
          <div class="form-group">
            <label>NIT</label>
            <input v-model="form.nit" inputmode="numeric" pattern="[0-9]*" required />
          </div>
          <div class="form-group">
            <label>Nombre de la empresa</label>
            <input v-model="form.nombre_empresa" required />
          </div>
          <div class="form-group">
            <label>Dirección de la empresa</label>
            <input v-model="form.direccion_empresa" required />
          </div>
          <div class="form-group">
            <label>Proveedor</label>
            <input v-model="form.proveedor" required />
          </div>
          <div class="form-group">
            <label>Producto</label>
            <input v-model="form.producto" required />
          </div>
          <div class="form-group">
            <label>Cantidad</label>
            <input v-model="form.cantidad" inputmode="numeric" pattern="[0-9]*" required />
          </div>
          <div class="form-group">
            <label>Precio</label>
            <input v-model="form.precio" inputmode="decimal" pattern="[0-9.]*" required />
          </div>
          <div class="form-group">
            <label>Subtotal</label>
            <input v-model="form.subtotal" inputmode="decimal" pattern="[0-9.]*" required />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-guardar">{{ form.id ? 'Actualizar' : 'Crear' }}</button>
          <button type="button" @click="resetForm" class="btn-cancelar">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Tabla de facturas -->
    <div class="table-container">
      <table class="factura-table">
        <thead>
          <tr>
            <th>Número Factura</th>
            <th>NIT</th>
            <th>Nombre Empresa</th>
            <th>Dirección Empresa</th>
            <th>Proveedor</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="facturas.length === 0">
            <td colspan="10" class="no-data">No hay facturas registradas.</td>
          </tr>
          <tr v-for="factura in facturas" :key="factura.id">
            <td>{{ factura.numero_factura }}</td>
            <td>{{ factura.nit }}</td>
            <td>{{ factura.nombre_empresa }}</td>
            <td>{{ factura.direccion_empresa }}</td>
            <td>{{ factura.proveedor }}</td>
            <td>{{ factura.producto }}</td>
            <td>{{ factura.cantidad }}</td>
            <td>{{ factura.precio }}</td>
            <td>{{ factura.subtotal }}</td>
            <td>
              <button @click="editFactura(factura)" class="btn-accion editar">Editar</button>
              <button @click="deleteFactura(factura.id)" class="btn-accion eliminar">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as facturaService from '@/services/facturaCompraService'

interface Factura {
  id: number
  numero_factura: number | string
  nit: number | string
  nombre_empresa: string
  direccion_empresa: string
  proveedor: string
  producto: string
  cantidad: number | string
  precio: number | string
  subtotal: number | string
}

const facturas = ref<Factura[]>([])
const showForm = ref(false)
const form = ref<Partial<Factura>>({})

async function cargarFacturas() {
  facturas.value = await facturaService.getFacturas()
}

onMounted(cargarFacturas)

async function handleSubmit() {
  if (form.value.id) {
    await facturaService.updateFactura(form.value.id as number, form.value)
  } else {
    await facturaService.createFactura(form.value)
  }
  await cargarFacturas()
  resetForm()
}

function editFactura(factura: Factura) {
  form.value = { ...factura }
  showForm.value = true
}

async function deleteFactura(id: number) {
  await facturaService.deleteFactura(id)
  await cargarFacturas()
}

function resetForm() {
  form.value = {}
  showForm.value = false
}
</script>

<style scoped>
.table-container {
  margin-top: 2rem;
  overflow-x: auto;
}

.factura-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.factura-table th, .factura-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
}

.factura-table th {
  background: #f4f6fa;
  color: #222;
  font-weight: 600;
}

.factura-table tr:last-child td {
  border-bottom: none;
}

.no-data {
  text-align: center;
  color: #888;
  font-style: italic;
}

.btn-accion {
  margin: 0 4px;
  padding: 0.3rem 0.7rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.btn-accion.editar {
  background: #e0eaff;
  color: #1a4fa3;
}

.btn-accion.eliminar {
  background: #ffe0e0;
  color: #c0392b;
}

.btn-accion.editar:hover {
  background: #b3d4fc;
}

.btn-accion.eliminar:hover {
  background: #ffb3b3;
}

.btn-nueva {
  margin-bottom: 1rem;
  background: #1a4fa3;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-nueva:hover {
  background: #163d7a;
}

.form-container {
  margin-bottom: 1.5rem;
  background: #f4f6fa;
  padding: 1.5rem 2vw;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  max-width: 1200px;
  min-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.horizontal-form form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-group label {
  font-size: 0.97rem;
  color: #1a4fa3;
  font-weight: 500;
  margin-bottom: 0.1rem;
}

.form-group input {
  padding: 0.45rem 0.7rem;
  border: 1px solid #bfc9d9;
  border-radius: 5px;
  font-size: 1rem;
  background: #fff;
  transition: border 0.2s;
}

.form-group input:focus {
  border: 1.5px solid #1a4fa3;
  outline: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-guardar {
  background: #1a4fa3;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-guardar:hover {
  background: #163d7a;
}

.btn-cancelar {
  background: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancelar:hover {
  background: #bdbdbd;
}
</style>