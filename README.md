# Minhas Dívidas 💰

Um dashboard moderno e minimalista para gestão de dívidas e boletos, desenvolvido com **React + Vite** e integrado com **Airtable**.

## ✨ Funcionalidades

- **Dashboard Moderno**: Visualização clara de dívidas pendentes, totais e status de pagamento.
- **PWA (Progressive Web App)**: Instale o aplicativo diretamente no seu celular ou desktop para acesso rápido offline.
- **Gestão Ágil**: Cadastro e edição de cartões, boletos e empréstimos.
- **Integração Airtable**: Sincronização em tempo real dos seus dados.

## 🚀 Como Executar

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/joanpaulo/minhas-dividas.git
   cd minhas-dividas
   ```

2. **Instalar Dependências**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env` baseado no `.env.example`:
   ```env
   VITE_AIRTABLE_TOKEN=seu_token_aqui
   VITE_AIRTABLE_BASE_ID=seu_base_id_aqui
   ```

4. **Executar em Desenvolvimento**:
   ```bash
   npm run dev
   ```

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Airtable API](https://airtable.com/api)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 📱 PWA

O projeto está configurado como PWA. Para testar a instalação:
1. Execute o build: `npm run build`
2. Visualize o preview: `npm run preview`
3. Clique no ícone de instalação na barra de endereços do navegador.

---
Desenvolvido por [Joan Paulo](https://github.com/joanpaulo)
