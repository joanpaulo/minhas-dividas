import { useState, useEffect } from 'react';

// API e Utils
import { buscarDados, atualizarDado, deletarDado, criarDado } from './services/api';
import { formatarMoeda } from './utils/formatters';

// Componentes
import Modal from './components/Modal';
import FormMultiplo from './components/modals/FormMultiplo';
import BoletoCard from './components/cards/BoletoCard';
import EmprestimoCard from './components/cards/EmprestimoCard';
import CartaoCard from './components/cards/CartaoCard';
import FooterResumo from './components/layout/FooterResumo';

function App() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dividaEmEdicao, setDividaEmEdicao] = useState(null);
  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  
  // Estados para as 3 tabelas
  const [boletos, setBoletos] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);

  useEffect(() => {
    carregarTudo();
  }, []);

  const carregarTudo = async () => {
    setLoading(true);
    // Busca das 3 tabelas simultaneamente
    const [dBoletos, dCartoes, dEmprestimos] = await Promise.all([
      buscarDados('Boletos'),
      buscarDados('Cartoes'),
      buscarDados('Emprestimos')
    ]);

    // Ordenação por data (Boletos e Cartões)
    const sortData = (a, b) => new Date(a.fields.Vencimento) - new Date(b.fields.Vencimento);
    
    setBoletos(dBoletos.sort(sortData));
    setCartoes(dCartoes.sort(sortData));
    setEmprestimos(dEmprestimos);
    setLoading(false);
  };

  // --- LÓGICA DE AGRUPAMENTO DE CARTÕES ---
  const cartoesAgrupados = cartoes.reduce((acc, fatura) => {
    const nome = fatura.fields.Cartao || 'Outros';
    if (!acc[nome]) acc[nome] = [];
    acc[nome].push(fatura);
    return acc;
  }, {});

  const nomesCartoesDisponiveis = [...new Set(cartoes.map(c => c.fields.Cartao))].filter(Boolean);

  // --- AÇÕES ---
  const handlePagar = async (id, tabela) => {
    try {
      await atualizarDado(tabela, id, { Status: 'Pago' });
      carregarTudo(); // Recarrega para atualizar totais e badges
    } catch (e) { alert("Erro ao pagar"); }
  };

  // 1. Apenas abre o modal e guarda quem clicamos
  const handleExcluirRequest = (id, tabela) => {
    setItemParaExcluir({ id, tabela });
  };

  // 2. A função que realmente vai no banco e deleta
  const confirmarExclusao = async () => {
    if (!itemParaExcluir) return;
    try {
      await deletarDado(itemParaExcluir.tabela, itemParaExcluir.id);
      setItemParaExcluir(null); // Fecha o modal
      carregarTudo(); // Atualiza a tela
    } catch (e) {
      alert("Erro ao excluir dívida.");
    }
  };

  const handleUpdateParcelas = async (id, novaString) => {
    try {
      await atualizarDado('Emprestimos', id, { "Parcelas Pagas": novaString });
      carregarTudo();
    } catch (e) { alert("Erro ao atualizar parcelas"); }
  };

  const abrirModalNova = () => {
    setDividaEmEdicao(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (divida) => {
    setDividaEmEdicao(divida);
    setIsModalOpen(true);
  };

  const handleSalvarDivida = async (tabela, dados, id) => {
    try {
      if (id) {
        await atualizarDado(tabela, id, dados);
      } else {
        await criarDado(tabela, dados);
      }
      setIsModalOpen(false);
      setDividaEmEdicao(null);
      carregarTudo(); 
    } catch (e) {
      alert("Erro ao salvar dados.");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Minhas Dívidas</h1>
          <p style={styles.subtitle}>Gestão Financeira Avançada</p>
        </div>
      </header>


      {loading ? (
        <div style={styles.loading}>Carregando dados do Airtable...</div>
      ) : (
        <main style={{...styles.main, paddingBottom: '100px'}}>
          
          {/* SESSÃO DE CARTÕES */}
          {Object.keys(cartoesAgrupados).length > 0 && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>💳 Cartões de Crédito</h2>
              <div style={styles.grid}>
                {Object.entries(cartoesAgrupados).map(([nome, faturas]) => (
                  <CartaoCard 
                    key={nome} 
                    nomeCartao={nome} 
                    faturas={faturas} 
                    onPagar={handlePagar} 
                    onExcluir={handleExcluirRequest} 
                    onEditar={abrirModalEditar}
                  />
                ))}
              </div>
            </section>
          )}

          {/* SESSÃO DE EMPRÉSTIMOS */}
          {emprestimos.length > 0 && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>🏦 Empréstimos e Financiamentos</h2>
              <div style={styles.grid}>
                {emprestimos.map(emp => (
                  <EmprestimoCard 
                    key={emp.id} 
                    emprestimo={emp} 
                    onUpdateParcelas={handleUpdateParcelas}
                    onExcluir={handleExcluirRequest}
                  />
                ))}
              </div>
            </section>
          )}

          {/* SESSÃO DE BOLETOS */}
          {boletos.length > 0 && (
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>📄 Boletos e Contas Fixas</h2>
              <div style={styles.grid}>
                {boletos.map(bol => (
                  <BoletoCard 
                    key={bol.id} 
                    boleto={bol} 
                    onPagar={handlePagar} 
                    onExcluir={handleExcluirRequest}
                    onEditar={abrirModalEditar}
                  />
                ))}
              </div>
            </section>
          )}

        </main>
      )}

      {/* NOVO COMPONENTE */}
      <FooterResumo 
        boletos={boletos} 
        cartoes={cartoes} 
        emprestimos={emprestimos} 
        onAddClick={abrirModalNova}
      />

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={dividaEmEdicao ? "Editar Dívida" : "Adicionar Dívida"}>
        <FormMultiplo 
          dividaAtual={dividaEmEdicao}
          cartoesDisponiveis={nomesCartoesDisponiveis}
          onSubmit={handleSalvarDivida} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <Modal 
        isOpen={!!itemParaExcluir} 
        onClose={() => setItemParaExcluir(null)} 
        title="⚠️ Confirmar Exclusão"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p style={{ color: 'var(--text-main)', fontSize: '1.05rem' }}>
            Tem certeza que deseja excluir este item permanentemente?
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Esta ação não poderá ser desfeita e os valores serão removidos dos cálculos.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '10px' }}>
            <button 
              onClick={() => setItemParaExcluir(null)} 
              style={styles.btnCancelConfirm}
            >
              Cancelar
            </button>
            <button 
              onClick={confirmarExclusao} 
              style={styles.btnConfirmDelete}
            >
              Sim, Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  title: { fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px' },
  subtitle: { color: 'var(--text-muted)', fontSize: '1rem' },
  
  section: { marginBottom: '4rem' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--text-main)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' },
  loading: { textAlign: 'center', padding: '5rem', color: 'var(--text-muted)', fontSize: '1.2rem' },

  btnCancelConfirm: {
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  btnConfirmDelete: {
    backgroundColor: 'var(--danger)', // Vermelho!
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'opacity 0.2s'
  }
};

export default App;
