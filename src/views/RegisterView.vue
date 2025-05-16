<template>
  <div class="container">
    <div class="form-container">
      <h1>¡¡Registrate ahora!!</h1>
      <form @submit.prevent="register">
        <input v-model="username" type="text" placeholder="usuario" />
        <input v-model="email" type="email" placeholder="correo" />
        <input v-model="password" type="password" placeholder="contraseña" />

        <button type="submit">Crear cuenta</button>

        <p><Router-link to="/Login">¿Recuerdas tu contraseña?</Router-link></p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerRequest } from '@/services/authService';

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const register = async () => {
      if (!username.value || !email.value || !password.value) {
        alert('Todos los campos son obligatorios');
        return;
      }

      try {
        await registerRequest(username.value, email.value, password.value);
        alert('Usuario registrado con éxito');
        router.push('/Login');
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('No se pudo registrar el usuario');
      }
    };

    return {
      username,
      email,
      password,
      register,
    };
  },
});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-container {
  width: 400px;
  padding: 40px;
  background: #fafafa;
  border-radius: 10px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  background-color: #fafafa;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 4px;
  font-size: 12px;
}

button {
  background: #bb71e8;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
}
</style>