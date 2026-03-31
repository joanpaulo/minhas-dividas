// src/components/cards/CartaoCard.jsx
import { useState } from 'react';
import styles from './CartaoCard.module.css'; // Importando o CSS Module
import { formatarMoeda } from '../../utils/formatters';
import { formatarDataBR } from '../../utils/dateManager';
import BadgeAlerta from '../ui/BadgeAlerta';
import Modal from '../Modal'; // Reaproveitando seu componente de Modal

export default function CartaoCard({ nomeCartao, faturas, onPagar, onExcluir, onEditar }) {
  const [isListOpen, setIsListOpen] = useState(false);

  // 1. Encontrar a fatura principal (a primeira que não está paga)
  const faturasPendentes = faturas.filter(f => f.fields.Status !== 'Pago');
  const faturaPrincipal = faturasPendentes.length > 0 ? faturasPendentes[0] : faturas[0];

  // 2. Calcular total pendente
  const totalPendente = faturasPendentes.reduce((sum, f) => sum + (f.fields.Valor || 0), 0);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>💳 {nomeCartao}</h3>
        {/* Botão que abre o modal */}
        <button className={styles.badgeBtn} onClick={() => setIsListOpen(true)}>
          {faturas.length} faturas 📂
        </button>
      </div>

      <div className={styles.body}>
        <p className={styles.label}>Próxima a vencer:</p>
        <div className={styles.faturaRow}>
          <div className={styles.faturaInfo}>
            <span>{formatarDataBR(faturaPrincipal.fields.Vencimento)}</span>
            <BadgeAlerta
              vencimento={faturaPrincipal.fields.Vencimento}
              statusPagamento={faturaPrincipal.fields.Status}
            />
          </div>

          <span className={styles.faturaValor}>
            {formatarMoeda(faturaPrincipal.fields.Valor)}
          </span>

          {faturaPrincipal.fields.Status !== 'Pago' ? (
            <button className={styles.btnPagar} onClick={() => onPagar(faturaPrincipal.id, 'Cartoes')}>
              Pagar
            </button>
          ) : (
            <button className={styles.btnPagaActive}>✓ Pago</button>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.label}>Total Pendente:</span>
        <span className={styles.valorTotal}>{formatarMoeda(totalPendente)}</span>
      </div>

      {/* Modal com a listagem completa */}
      <Modal
        isOpen={isListOpen}
        onClose={() => setIsListOpen(false)}
        title={`Faturas: ${nomeCartao}`}
      >
        <div className={styles.modalLista}>
          {faturas.map(f => (
            <div key={f.id} className={styles.modalItem}>
              <div className={styles.faturaInfo}>
                <span style={{ fontSize: '0.9rem' }}>{formatarDataBR(f.fields.Vencimento)}</span>
                <BadgeAlerta vencimento={f.fields.Vencimento} statusPagamento={f.fields.Status} />
              </div>

              <span style={{ fontWeight: 'bold' }}>{formatarMoeda(f.fields.Valor)}</span>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {f.fields.Status !== 'Pago' ? (
                  <button className={styles.btnPagar} onClick={() => onPagar(f.id, 'Cartoes')}>Pagar</button>
                ) : (
                  <button className={styles.btnPagaActive}>✓ Pago</button>
                )}
                
                <button className={styles.iconBtn} onClick={() => {
                   setIsListOpen(false);
                   onEditar(f);
                }}>✏️</button>

                <button className={styles.iconBtn} onClick={() => onExcluir(f.id, 'Cartoes')}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}