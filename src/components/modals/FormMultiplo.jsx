import { useState } from 'react';
import styles from './FormMultiplo.module.css'; // Importando o CSS Responsivo

export default function FormMultiplo({ onSubmit, onCancel, dividaAtual, cartoesDisponiveis =[] }) {
  let initialAba = 'Boletos';
  if (dividaAtual) {
    if (dividaAtual.fields['Cartao']) initialAba = 'Cartoes';
    else if (dividaAtual.fields['Total de Parcelas']) initialAba = 'Emprestimos';
  }

  const [aba, setAba] = useState(initialAba);
  const[loading, setLoading] = useState(false);
  const fields = dividaAtual ? dividaAtual.fields : {};

  const [nome, setNome] = useState(fields['Nome'] || fields['Nome da Fatura'] || '');
  const [valor, setValor] = useState(fields['Valor'] || fields['Valor da Parcela'] || '');
  const [data, setData] = useState(fields['Vencimento'] || fields['Primeiro Vencimento'] || '');
  const [banco, setBanco] = useState(fields['Cartao'] || '');
  
  // NOVO: Controle do nosso Menu Suspenso
  const[mostrarDropdown, setMostrarDropdown] = useState(false);
  
  // NOVO: Filtro em tempo real (não difere maiúscula de minúscula)
  const cartoesFiltrados = cartoesDisponiveis.filter(c => 
    c.toLowerCase().includes(banco.toLowerCase())
  );
  const [totalParcelas, setTotalParcelas] = useState(fields['Total de Parcelas'] || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let dados = {};
    if (aba === 'Boletos') dados = { "Nome": nome, "Vencimento": data, "Valor": Number(valor), "Status": fields.Status || "Pendente" };
    else if (aba === 'Cartoes') {
      const[ano, mes] = data.split('-');
      dados = { "Nome da Fatura": `Fatura ${mes}/${ano}`, "Cartao": banco, "Vencimento": data, "Valor": Number(valor), "Status": fields.Status || "Pendente" };
    } else if (aba === 'Emprestimos') dados = { "Nome": nome, "Valor da Parcela": Number(valor), "Total de Parcelas": Number(totalParcelas), "Primeiro Vencimento": data, "Parcelas Pagas": fields['Parcelas Pagas'] || "" };

    await onSubmit(aba, dados, dividaAtual?.id);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {!dividaAtual && (
        <div className={styles.tabContainer}>
          {['Boletos', 'Cartoes', 'Emprestimos'].map(tipo => (
            <button 
              key={tipo} type="button" onClick={() => setAba(tipo)}
              className={styles.tab}
              style={{ borderBottom: aba === tipo ? '2px solid var(--primary)' : 'none', color: aba === tipo ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              {tipo.replace('es', 'ões')}
            </button>
          ))}
        </div>
      )}

      {aba !== 'Cartoes' && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nome / Descrição</label>
          <input required className={styles.input} type="text" placeholder="Ex: Aluguel" value={nome} onChange={e => setNome(e.target.value)} />
        </div>
      )}

      {/* Input de Cartão com Menu Suspenso Customizado */}
      {aba === 'Cartoes' && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nome do Cartão (Banco)</label>
          <input 
            required 
            className={styles.input} 
            placeholder="Ex: Nubank ou selecione abaixo" 
            value={banco} 
            onChange={e => {
              setBanco(e.target.value);
              setMostrarDropdown(true); // Abre o menu ao digitar
            }} 
            onFocus={() => setMostrarDropdown(true)} // Abre ao clicar
            // O setTimeout é necessário para dar tempo de clicar no item antes de fechar
            onBlur={() => setTimeout(() => setMostrarDropdown(false), 200)} 
            autoComplete="off"
          />
          
          {/* Nosso Menu Suspenso Bonitão */}
          {mostrarDropdown && cartoesFiltrados.length > 0 && (
            <ul className={styles.dropdown}>
              {cartoesFiltrados.map(c => (
                <li 
                  key={c} 
                  className={styles.dropdownItem}
                  onClick={() => {
                    setBanco(c);
                    setMostrarDropdown(false); // Fecha ao selecionar
                  }}
                >
                  💳 {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Esta .row vai empilhar no mobile magicamente graças ao CSS Module */}
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{aba === 'Emprestimos' ? 'Valor da Parcela' : 'Valor'}</label>
          <input required className={styles.input} type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{aba === 'Emprestimos' ? '1º Vencimento' : 'Vencimento'}</label>
          <input required className={styles.input} type="date" value={data} onChange={e => setData(e.target.value)} />
        </div>
      </div>

      {aba === 'Emprestimos' && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Total de Parcelas</label>
          <input required className={styles.input} type="number" placeholder="Ex: 48" value={totalParcelas} onChange={e => setTotalParcelas(e.target.value)} />
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.btnCancel}>Cancelar</button>
        <button type="submit" disabled={loading} className={styles.btnSubmit}>
          {loading ? 'Salvando...' : (dividaAtual ? 'Salvar Alterações' : 'Cadastrar Dívida')}
        </button>
      </div>
    </form>
  );
}

