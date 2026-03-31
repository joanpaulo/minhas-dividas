// Converte "2026-05-10" para "10/05/2026"
export const formatarDataBR = (dataString) => {
  if (!dataString) return 'N/A';
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
};

// A "Inteligência" dos alertas
export const calcularStatusVencimento = (dataString) => {
  if (!dataString) return { status: 'ok', dias: null, cor: 'transparent', texto: '' };

  // Pegamos a data de HOJE e zeramos as horas para comparação justa
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Criamos a data do VENCIMENTO e zeramos as horas
  const [ano, mes, dia] = dataString.split('-');
  const dataVencimento = new Date(ano, mes - 1, dia); // mês em JS começa no 0
  dataVencimento.setHours(0, 0, 0, 0);

  // Calcula a diferença em milissegundos e converte para Dias
  const diffTempo = dataVencimento.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    return { 
      status: 'vencido', dias: Math.abs(diffDias), 
      cor: '#ef4444', // Vermelho (danger)
      texto: `Vencido há ${Math.abs(diffDias)} dia(s)` 
    };
  } else if (diffDias === 0) {
    return { 
      status: 'hoje', dias: 0, 
      cor: '#f97316', // Laranja
      texto: 'Vence HOJE!' 
    };
  } else if (diffDias <= 3) {
    return { 
      status: 'proximo', dias: diffDias, 
      cor: '#eab308', // Amarelo
      texto: `Vence em ${diffDias} dia(s)` 
    };
  } else {
    return { status: 'ok', dias: diffDias, cor: 'transparent', texto: `Vence em ${diffDias} dias` };
  }
};

// Soma meses a uma data mantendo o dia original se possível
export const somarMeses = (dataString, mesesParaSomar) => {
  const [ano, mes, dia] = dataString.split('-').map(Number);
  const data = new Date(ano, mes - 1 + mesesParaSomar, dia);
  
  // Formata de volta para YYYY-MM-DD
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

