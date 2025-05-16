import axios from 'axios';

const API_URL = 'http://localhost:3333/api/v1';

export const loginRequest = async (correo: string, contrasena: string) => {
    const response = await axios.post(`${API_URL}/login`, { correo, contrasena,});
    return response.data;
}

export const registerRequest = async (nombre: string, correo: string, contrasena: string) => {
    const response = await axios.post(`${API_URL}/register`, { nombre, correo, contrasena });
    return response.data;
}