# 💸 Minhas Dívidas - Gestão Financeira Avançada

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Airtable](https://img.shields.io/badge/Airtable-18BFFF?style=for-the-badge&logo=Airtable&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

Um aplicativo de gestão financeira pessoal focado em **alta performance, design premium e inteligência no lado do cliente (Thick Client)**. Desenvolvido para gerenciar faturas de cartões, contas fixas e financiamentos complexos de forma elegante e automatizada.

---

## ✨ Funcionalidades Principais

- **📊 Motor de Cálculos (Thick Client):** O banco de dados guarda apenas o essencial. O React fica encarregado de calcular parcelas virtuais, somar saldos devedores e agrupar faturas em tempo real.
- **📱 PWA (Progressive Web App):** Instalável no celular, funcionando como um aplicativo nativo em tela cheia e sem barras de navegação.
- **🖥️ UI/UX Premium:** Design focado em *Glassmorphism* (efeito de vidro), tema escuro moderno e responsividade total.
- **🕹️ Dock de Navegação Inteligente:** Um rodapé flutuante estilo Mac OS / iOS que abriga botões dinâmicos e resume a saúde financeira do usuário no mês e no dia.
- **🚦 Semáforo Financeiro:** Alertas visuais automatizados baseados em datas (Vencido, Vence Hoje, Vence em Breve).
- **📂 Agrupamento de Cartões:** Faturas do mesmo banco são agrupadas em um único card para manter a interface limpa.
- **🔄 Gestão de Empréstimos em 1 Linha:** Um financiamento de 60 meses ocupa apenas 1 linha no banco de dados. O frontend gera as parcelas e gerencia os pagamentos dinamicamente.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React.js + Vite
- **Estilização:** Vanilla CSS Modules (Design System customizado)
- **Backend / Banco de Dados:** Airtable API (BaaS)
- **PWA:** Vite PWA Plugin
- **Requisições:** Axios / Fetch

---

## 📸 Screenshots

| Dashboard Desktop | Interface Mobile (Dock Expandido) | Modal de Edição |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/300x200/0f172a/6366f1?text=Print+Desktop" width="300"/> | <img src="https://via.placeholder.com/150x300/0f172a/6366f1?text=Print+Mobile" width="150"/> | <img src="https://via.placeholder.com/150x300/0f172a/6366f1?text=Print+Modal" width="150"/> |

---

## ⚙️ Estrutura do Banco de Dados (Airtable)

O projeto consome uma base do Airtable dividida em tabelas específicas:

1. **Boletos:** `Nome`, `Vencimento`, `Valor`, `Status`
2. **Cartoes:** `Nome da Fatura`, `Cartao`, `Vencimento`, `Valor`, `Status`
3. **Emprestimos:** `Nome`, `Valor da Parcela`, `Total de Parcelas`, `Parcelas Pagas` *(string separada por vírgula)*, `Primeiro Vencimento`

---

## 🚀 Como rodar o projeto localmente

1. **Clone o repositório:**
```bash
git clone https://github.com/joanpaulo/minhas-dividas.git
```

2. **Entre na pasta do projeto:**
```bash
cd minhas-dividas
```

3. **Instale as dependências:**
```bash
npm install --legacy-peer-deps
```

4. **Configuração de Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
```env
VITE_AIRTABLE_TOKEN=seu_personal_access_token_aqui
VITE_AIRTABLE_BASE_ID=seu_base_id_aqui
```

5. **Rode o servidor de desenvolvimento:**
```bash
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

---

## 👨‍💻 Autor

Desenvolvido por **[Joan Paulo](https://github.com/joanpaulo)** durante um processo de refatoração extrema de UI/UX e arquitetura Front-end.

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/joanpaulo)
