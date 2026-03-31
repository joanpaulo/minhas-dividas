import { useState } from 'react';

export default function FormDivida({ onSubmit, onCancel, dividaAtual }) {
  const dadosIniciais = dividaAtual ? dividaAtual.fields : {};

  const[nome, setNome] = useState(dadosIniciais['Nome da Dívida'] || '');
  const[tipo, setTipo] = useState(dadosIniciais['Tipo'] || 'Cartão de Crédito');
  const[vencimento, setVencimento] = useState(dadosIniciais['Vencimento'] || '');
  const[valorAtual, setValorAtual] = useState(dadosIniciais['Valor Atual'] || '');
  const[infoCartao, setInfoCartao] = useState(dadosIniciais['Info do Cartão'] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dadosDaDivida = {
      "Nome da Dívida": nome,
      "Tipo": tipo,
      "Vencimento": vencimento,
      "Valor Atual": Number(valorAtual),
    };

    if (tipo === 'Cartão de Crédito' && infoCartao) {
      dadosDaDivida["Info do Cartão"] = infoCartao;
    }

    if (!dividaAtual) {
      dadosDaDivida["Status"] = "Pendente";
    }

    await onSubmit(dadosDaDivida, dividaAtual?.id);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Nome ou Descrição</label>
        <input required style={styles.input} type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>

      <div style={styles.row}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Tipo de Dívida</label>
          <select style={styles.input} value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Empréstimo">Empréstimo</option>
            <option value="Boleto">Boleto</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Vencimento</label>
          <input required style={styles.input} type="text" value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
        </div>
      </div>

      {tipo === 'Cartão de Crédito' && (
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nome/Final do Cartão</label>
          <input style={styles.input} type="text" value={infoCartao} onChange={(e) => setInfoCartao(e.target.value)} />
        </div>
      )}

      <div style={styles.inputGroup}>
        <label style={styles.label}>Valor da Parcela/Fatura (R$)</label>
        <input required style={styles.input} type="number" step="0.01" value={valorAtual} onChange={(e) => setValorAtual(e.target.value)} />
      </div>

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.btnCancel}>Cancelar</button>
        <button type="submit" disabled={isSubmitting} style={styles.btnSubmit}>
          {isSubmitting ? 'Salvando...' : (dividaAtual ? 'Atualizar Dívida' : 'Salvar Dívida')}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: { display: 'flex', gap: '1rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 },
  label: { color: 'var(--text-muted)', fontSize: '0.9rem' },
  input: {
    backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border)',
    padding: '10px', borderRadius: '6px', fontSize: '1rem', outline: 'none'
  },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
  btnCancel: { backgroundColor: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: '1rem' },
  btnSubmit: { backgroundColor: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }
};
