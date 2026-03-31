// src/utils/footerCalculations.js

import { somarMeses } from './dateManager';

export const calcularResumoFinanceiro = (boletos, cartoes, emprestimos) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const parseData = (dataStr) => {
    if (!dataStr) return new Date('1970-01-01T00:00:00');
    return new Date(dataStr + 'T00:00:00');
  };

  const ehHoje = (dataStr) => {
    const d = parseData(dataStr);
    return d.getTime() === hoje.getTime();
  };

  const ehAtrasado = (dataStr) => {
    const d = parseData(dataStr);
    return d.getTime() < hoje.getTime();
  };

  const ehMesAtual = (dataStr) => {
    const d = parseData(dataStr);
    return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
  };

  // 1. CÁLCULO BOLETOS
  const bPendentes = boletos.filter(b => b.fields.Status !== 'Pago');
  const totalBoletos = bPendentes.reduce((acc, b) => acc + (b.fields.Valor || 0), 0);
  const boletosHoje = bPendentes.filter(b => ehHoje(b.fields.Vencimento)).reduce((acc, b) => acc + (b.fields.Valor || 0), 0);
  const boletosMes = bPendentes.filter(b => ehMesAtual(b.fields.Vencimento)).reduce((acc, b) => acc + (b.fields.Valor || 0), 0);
  const boletosAtrasados = bPendentes.filter(b => ehAtrasado(b.fields.Vencimento)).reduce((acc, b) => acc + (b.fields.Valor || 0), 0);

  // 2. CÁLCULO CARTÕES
  const cPendentes = cartoes.filter(c => c.fields.Status !== 'Pago');
  const totalCartoes = cPendentes.reduce((acc, c) => acc + (c.fields.Valor || 0), 0);
  const cartoesHoje = cPendentes.filter(c => ehHoje(c.fields.Vencimento)).reduce((acc, c) => acc + (c.fields.Valor || 0), 0);
  const cartoesMes = cPendentes.filter(c => ehMesAtual(c.fields.Vencimento)).reduce((acc, c) => acc + (c.fields.Valor || 0), 0);
  const cartoesAtrasados = cPendentes.filter(c => ehAtrasado(c.fields.Vencimento)).reduce((acc, c) => acc + (c.fields.Valor || 0), 0);

  // 3. CÁLCULO EMPRÉSTIMOS
  let totalEmprestimosRestante = 0;
  let emprestimosHoje = 0;
  let emprestimosMes = 0;
  let emprestimosAtrasados = 0;

  emprestimos.forEach(emp => {
    const valorParc = emp.fields['Valor da Parcela'] || 0;
    const totalParc = emp.fields['Total de Parcelas'] || 0;
    const pagasArray = emp.fields['Parcelas Pagas'] ? emp.fields['Parcelas Pagas'].split(',').map(Number) : [];
    
    totalEmprestimosRestante += valorParc * (totalParc - pagasArray.length);

    for (let i = 0; i < totalParc; i++) {
      const numParcela = i + 1;
      if (!pagasArray.includes(numParcela)) {
        const dataVenc = somarMeses(emp.fields['Primeiro Vencimento'], i);
        
        if (ehHoje(dataVenc)) emprestimosHoje += valorParc;
        if (ehMesAtual(dataVenc)) emprestimosMes += valorParc;
        if (ehAtrasado(dataVenc)) emprestimosAtrasados += valorParc;
      }
    }
  });

  return {
    totalGeral: totalBoletos + totalCartoes + totalEmprestimosRestante,
    totalMes: boletosMes + cartoesMes + emprestimosMes,
    totalHoje: boletosHoje + cartoesHoje + emprestimosHoje,
    totalAtrasado: boletosAtrasados + cartoesAtrasados + emprestimosAtrasados,
    detalhes: {
      boletos: totalBoletos,
      cartoes: totalCartoes,
      emprestimos: totalEmprestimosRestante
    }
  };
};
