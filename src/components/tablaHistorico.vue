<template>
  <div>
    <h2>Registros de Pesaje</h2>
    <!-- Inputs para agregar o editar registro -->
    <div class="nuevo-registro">
      <input v-model="nuevo.categoria" placeholder="Producto" />
      <input v-model="nuevo.text" type="number" step="any" placeholder="Peso" />
      <select v-model="nuevo.uM">
        <option value="kg">kg</option>
        <option value="lb">lb</option>
        <option value="Ml">Ml</option>
        <option value="L">L</option>
      </select>
      <button @click="guardarRegistro">{{ editando ? 'Actualizar' : 'Agregar' }}</button>
      <button v-if="editando" @click="() => { nuevo = { categoria: '', text: '', uM: 'kg', id: null }; editando = false; }">Cancelar</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Peso</th>
          <th>Unidad</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="registro in registros" :key="registro.id">
          <td>{{ registro.categoria }}</td>
          <td>{{ registro.text }}</td>
          <td>{{ registro.uM }}</td>
          <td>
            <button @click="editarRegistro(registro)">Editar</button>
            <button @click="eliminarRegistro(registro.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { obtenerRegistrosPesos, actualizarRegistroOCR, eliminarRegistroOCR } from '@/services/entradaSalidaProductos';
import axios from 'axios';

const registros = ref<any[]>([]);
const nuevo = ref({ categoria: '', text: '', uM: 'kg', id: null });
const editando = ref(false);

onMounted(async () => {
  await cargarRegistros();
});

async function cargarRegistros() {
  registros.value = await obtenerRegistrosPesos();
}

function editarRegistro(registro: any) {
    nuevo.value = { 
      categoria: registro.categoria, 
      text: registro.text, 
      uM: registro.uM, 
      id: registro.id 
    };
    editando.value = true;
  }


// Si está editando, actualiza; si no, agrega
async function guardarRegistro() {
  if (!nuevo.value.categoria || !nuevo.value.text) return;
  if (editando.value && nuevo.value.id) {
    if (confirm('¿Confirmas la actualización de este registro?')) {
      await actualizarRegistroOCR(nuevo.value.id, {
        text: nuevo.value.text.toString(),
        uM: nuevo.value.uM,
        categoria: nuevo.value.categoria
      });
    } else {
      return;
    }
  } else {
    await axios.post('/api/ocr/peso', {
      categoria: nuevo.value.categoria,
      text: nuevo.value.text.toString(),
      uM: nuevo.value.uM
    });
  }
  nuevo.value = { categoria: '', text: '', uM: 'kg', id: null };
  editando.value = false;
  await cargarRegistros();
}

async function eliminarRegistro(id: number) {
  if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
    await eliminarRegistroOCR(id);
    await cargarRegistros();
  }
}
</script>

<style scoped>
.nuevo-registro {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  text-align: center;
}
button {
  margin: 0 0.25rem;
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  background: #1e90ff;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background: #1565c0;
}
input, select {
  padding: 0.25rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>