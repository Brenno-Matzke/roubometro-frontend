import axios from "axios";

// Base URL única e centralizada — se a porta do backend mudar, só este
// arquivo precisa ser editado. Em produção, VITE_API_URL vem de uma
// variável de ambiente configurada no serviço de hospedagem (Vercel);
// em dev, cai no fallback do localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

export default api;
