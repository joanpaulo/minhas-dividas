// src/components/cards/EmprestimoCard.jsx
import { useState } from 'react';
import styles from './EmprestimoCard.module.css';
import { formatarMoeda } from '../../utils/formatters';
import { formatarDataBR, somarMeses } from '../../utils/dateManager';
import BadgeAlerta from '../ui/BadgeAlerta';
import Modal from '../Modal';

export default function EmprestimoCard({ emprestimo, onUpdateParcelas, onExcluir }) {
  const { fields, id } = emprestimo;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Processar parcelas pagas
  const pagasArray = fields['Parcelas Pagas'] ? fields['Parcelas Pagas'].split(',').map(Number) : [];
  const totalParcelas = fields['Total de Parcelas'] || 0;
  const valorParcela = fields['Valor da Parcela'] || 0;
  const dataInicial = fields['Primeiro Vencimento'];

  // 2. Gerar a lista virtual de todas as parcelas
  const todasAsParcelas = Array.from({ length: totalParcelas }, (_, i) => {
    const numero = i + 1;
    return {
      numero,
      vencimento: somarMeses(dataInicial, i),
      paga: pagasArray.includes(numero)
    };
  });

  // 3. Identificar a próxima parcela pendente
  const proximaPendente = todasAsParcelas.find(p => !p.paga) || todasAsParcelas[todasAsParcelas.length - 1];
  
  // 4. Cálculos de progresso e saldo
  const qtdPagas = pagasArray.length;
  const saldoDevedor = valorParcela * (totalParcelas - qtdPagas);
  const progresso = (qtdPagas / totalParcelas) * 100;

  const toggleParcela = (num) => {
    let novasPagas = pagasArray.includes(num) 
      ? pagasArray.filter(n => n !== num) 
      : [...pagasArray, num].sort((a, b) => a - b);
    onUpdateParcelas(id, novasPagas.join(','));
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>🏦 {fields.Nome}</h3>
        <button className={styles.badgeBtn} onClick={() => setIsModalOpen(true)}>
          {qtdPagas}/{totalParcelas} pagas 📂
        </button>
      </div>

      <div className={styles.body}>
        <p className={styles.label}>Próxima Parcela ({proximaPendente.numero}º):</p>
        <div className={styles.parcelaRow}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{formatarDataBR(proximaPendente.vencimento)}</span>
            <BadgeAlerta vencimento={proximaPendente.vencimento} statusPagamento={proximaPendente.paga ? 'Pago' : 'Pendente'} />
          </div>
          <span style={{ fontWeight: 'bold' }}>{formatarMoeda(valorParcela)}</span>
        </div>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar} style={{ width: `${progresso}%` }} />
        </div>
      </div>

      <div className={styles.footer}>
        <div>
          <span className={styles.label}>Saldo Devedor:</span>
          <p className={styles.valorTotal}>{formatarMoeda(saldoDevedor)}</p>
        </div>
        <button onClick={() => onExcluir(id, 'Emprestimos')} style={{background:'none', border:'none', cursor:'pointer'}}>🗑️</button>
      </div>

      {/* Modal Detalhado das Parcelas */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Parcelas: ${fields.Nome}`}>
        <div className={styles.modalLista}>
          {todasAsParcelas.map(p => (
            <div key={p.numero} className={`${styles.modalItem} ${p.paga ? styles.pago : ''}`}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>#{p.numero}</span>
                <span>{formatarDataBR(p.vencimento)}</span>
                <BadgeAlerta vencimento={p.vencimento} statusPagamento={p.paga ? 'Pago' : 'Pendente'} />
              </div>
              
              <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <span style={{fontWeight:'bold'}}>{formatarMoeda(valorParcela)}</span>
                <button 
                  className={p.paga ? styles.btnPagaActive : styles.btnPagarModal}
                  onClick={() => toggleParcela(p.numero)}
                >
                  {p.paga ? '✓ Paga' : 'Pagar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
