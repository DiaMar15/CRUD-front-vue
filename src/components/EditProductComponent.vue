<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2>Editar producto</h2>
        <button class="close-button" @click="$emit('close')">✖</button>
      </div>
      <div class="modal-body">
        <label>Código</label>
        <input v-model="editableProduct.codigo" type="text" disabled />

        <label>Nombre del producto</label>
        <input v-model="editableProduct.nombre" type="text" />

        <label>Categoría</label>
        <input v-model="editableProduct.categoria" type="text" />

        <label>Stock</label>
        <input v-model.number="editableProduct.stock" type="number" />

        <label>Stock mínimo</label>
        <input v-model.number="editableProduct.stockMinimo" type="number" />

        <label>Unidad</label>
        <input v-model="editableProduct.unidad" type="text" />
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="$emit('close')">Cancelar</button>
        <button class="save-button" @click="save">Guardar cambios</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
// Update the import path if the file is in a different location, for example:
import { updateProduct } from '../services/inventoryService';
// Or, if the file does not exist, create 'src/services/inventoryService.ts' and export 'updateProduct' from it.

interface Producto {
  id: number; 
  codigo: number;
  nombre: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  unidad: string;
}

const props = defineProps<{
  product: Producto;
}>();

const emits = defineEmits<{
  (event: 'save', product: Producto): void;
  (event: 'close'): void;
}>();

const editableProduct = reactive<Producto>({ ...props.product });

// Si cambian las props.product (por ejemplo, al abrir otro producto), actualizamos la copia local
watch(
  () => props.product,
  (newProduct) => {
    Object.assign(editableProduct, newProduct);
  }
);

async function save() {
  try {
    await updateProduct(editableProduct.id, {
      codigo: editableProduct.codigo,
      producto: editableProduct.nombre,
      categoria: editableProduct.categoria,
      stock: editableProduct.stock,
      min_stock: editableProduct.stockMinimo,
      u_m: editableProduct.unidad,
    });
    alert('Producto actualizado exitosamente');
    emits('save', { ...editableProduct });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    alert('Ocurrió un error al actualizar el producto');
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #e53e3e; 
  cursor: pointer;
}

.modal-body label {
  display: block;
  margin-top: 0.5rem;
  font-weight: bold;
  color: #444;
}

.modal-body input {
  width: 100%;
  margin-top: 0.2rem;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.cancel-button, .save-button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.cancel-button {
  background-color: #e2e2e2;
  color: #333;
}

.save-button {
  background-color: #3b82f6;
  color: white;
}

.save-button:hover {
  background-color: #2563eb;
}

.cancel-button:hover {
  background-color: #d1d1d1;
}
</style>
