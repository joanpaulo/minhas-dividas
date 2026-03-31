import React from 'react';
import { calcularStatusVencimento } from '../../utils/dateManager';

export default function BadgeAlerta({ vencimento, statusPagamento }) {
  // Se a dívida já foi paga, a gente não enche o saco do usuário com alertas!
  if (statusPagamento === 'Pago') return null;

  // Usa nossa inteligência temporal
  const info = calcularStatusVencimento(vencimento);

  // Se falta mais de 3 dias, não mostra o alerta
  if (info.status === 'ok') return null;

  return (
    <span 
      title={info.texto} // O title nativo faz aparecer o balãozinho ao passar o mouse
      style={{ 
        color: info.cor, 
        cursor: 'help', 
        display: 'flex', 
        alignItems: 'center',
        marginLeft: '8px'
      }}
    >
      {/* Ícone de Triângulo de Atenção com a cor dinâmica */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    </span>
  );
}
