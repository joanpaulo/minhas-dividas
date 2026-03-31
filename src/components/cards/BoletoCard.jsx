// src/components/cards/BoletoCard.jsx
import styles from './BoletoCard.module.css';
import { formatarMoeda } from '../../utils/formatters';
import { formatarDataBR } from '../../utils/dateManager';
import BadgeAlerta from '../ui/BadgeAlerta';

export default function BoletoCard({ boleto, onPagar, onExcluir, onEditar }) {
  const { fields, id } = boleto;
  const estaPago = fields.Status === 'Pago';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 className={styles.title}>{fields.Nome}</h3>
          <BadgeAlerta vencimento={fields.Vencimento} statusPagamento={fields.Status} />
        </div>
        <div className={styles.actions}>
          <button onClick={() => onEditar(boleto)} className={styles.iconBtn}>✏️</button>
          <button onClick={() => onExcluir(id, 'Boletos')} className={styles.iconBtn}>🗑️</button>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.info}>Vence em: <strong>{formatarDataBR(fields.Vencimento)}</strong></p>
      </div>

      <div className={styles.footer}>
        <p className={styles.valor}>{formatarMoeda(fields.Valor)}</p>
        {!estaPago ? (
          <button className={styles.btnPagar} onClick={() => onPagar(id, 'Boletos')}>Pagar</button>
        ) : (
          <button className={styles.btnPagaActive}>✓ Pago</button>
        )}
      </div>
    </div>
  );
}
