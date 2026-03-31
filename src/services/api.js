import axios from 'axios';

const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

// A baseURL agora aponta só para a Base (removemos a tabela do final)
const api = axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}/`,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// ==========================================
// FUNÇÕES GENÉRICAS (Servem para as 3 tabelas)
// ==========================================

// Ler (GET)
export const buscarDados = async (nomeDaTabela) => {
  try {
    const response = await api.get(nomeDaTabela);
    return response.data.records;
  } catch (error) {
    console.error(`Erro ao buscar dados da tabela ${nomeDaTabela}:`, error);
    return[];
  }
};

// Criar (POST)
export const criarDado = async (nomeDaTabela, campos) => {
  try {
    const response = await api.post(nomeDaTabela, {
      records:[{ fields: campos }]
    });
    return response.data.records[0];
  } catch (error) {
    console.error(`Erro ao criar em ${nomeDaTabela}:`, error);
    throw error;
  }
};

// Atualizar (PATCH)
export const atualizarDado = async (nomeDaTabela, id, camposAtualizados) => {
  try {
    const response = await api.patch(nomeDaTabela, {
      records: [{ id: id, fields: camposAtualizados }]
    });
    return response.data.records[0];
  } catch (error) {
    console.error(`Erro ao atualizar em ${nomeDaTabela}:`, error);
    throw error;
  }
};

// Deletar (DELETE)
export const deletarDado = async (nomeDaTabela, id) => {
  try {
    const response = await api.delete(`${nomeDaTabela}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar em ${nomeDaTabela}:`, error);
    throw error;
  }
};
