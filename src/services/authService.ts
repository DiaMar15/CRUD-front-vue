const API_URL = 'http://localhost:3333/api/v1';

export const loginRequest = async (correo: string, contrasena: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  });
  if (!response.ok) throw new Error('Error al iniciar sesión');
  return await response.json();
};

export const registerRequest = async (nombre: string, correo: string, contrasena: string) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, contrasena }),
  });
  if (!response.ok) throw new Error('Error al registrar usuario');
  return await response.json();
};