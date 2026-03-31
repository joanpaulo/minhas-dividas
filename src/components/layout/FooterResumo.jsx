import { useState } from 'react';
import styles from './FooterResumo.module.css';
import { formatarMoeda } from '../../utils/formatters';
import { calcularResumoFinanceiro } from '../../utils/footerCalculations';
import Modal from '../Modal';

export default function FooterResumo({ boletos, cartoes, emprestimos, onAddClick }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [menuState, setMenuState] = useState('idle'); 

  const resumo = calcularResumoFinanceiro(boletos, cartoes, emprestimos);

  // 1. Função isolada que só cuida de FECHAR a animação
  const closeMenu = () => {
    if (menuState === 'open') {
      setMenuState('closing');
      setTimeout(() => {
        setMenuState((prev) => prev === 'closing' ? 'idle' : prev);
      }, 700); // Aguarda a animação de saída terminar
    }
  };

  // 2. Função de clique no botão principal (Abre ou Fecha)
  const handleToggleMenu = () => {
    if (menuState === 'open') {
      closeMenu();
    } else if (menuState === 'idle') {
      setMenuState('open');
    }
  };

  return (
    <>
      {/* 3. O ESCUDO INVISÍVEL: Só existe se o menu estiver aberto ou fechando */}
      {menuState !== 'idle' && (
        <div className={styles.overlay} onClick={closeMenu} />
      )}

      <div className={styles.dockContainer}>
        
        {/* BOTÕES FLUTUANTES */}
        <div 
          className={styles.dockWrapper} 
          onClick={() => {
            setIsDetailOpen(true);
            closeMenu(); // Fecha o menu ao abrir o resumo
          }} 
          title="Resumo"
        >
          <button className={`${styles.dockCard} ${styles.btnCard} ${styles.summaryBtn}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </button>
        </div>

        <div 
          className={styles.dockWrapper} 
          onClick={() => {
            onAddClick();
            closeMenu(); // Fecha o menu ao abrir o formulário
          }} 
          title="Nova Dívida"
        >
          <button className={`${styles.dockCard} ${styles.btnCard} ${styles.addBtn}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        {/* CONTAINER DOS VALORES */}
        <div className={styles.valuesContainer}>
          
          {/* CARD PRINCIPAL (Agora ele é estático, só aciona a função) */}
          <div 
            className={styles.dockWrapper} 
            style={{ zIndex: 10, cursor: 'pointer' }}
            onClick={handleToggleMenu}
          >
            <div className={`${styles.dockCard} ${styles.valueCard}`}>
              <span className={styles.label}>Total Geral</span>
              <span className={styles.value} style={{color: '#818cf8'}}>{formatarMoeda(resumo.totalGeral)}</span>
            </div>
          </div>

          {/* CARDS SECUNDÁRIOS (Recebem a classe dinamicamente: .open ou .closing) */}
          <div className={`${styles.extraCards} ${styles[menuState]}`}>
            
            {/* Card 1: Atrasado (Mais perto da base) */}
            <div className={`${styles.dockWrapper} ${styles.extraWrapper} ${styles.card1}`}>
              <div className={`${styles.dockCard} ${styles.valueCard}`}>
                <span className={styles.label}>Atrasado</span>
                <span className={styles.value} style={{color: resumo.totalAtrasado > 0 ? '#ef4444' : 'var(--text-muted)'}}>
                  {formatarMoeda(resumo.totalAtrasado)}
                </span>
              </div>
            </div>

            {/* Card 2: No Mês */}
            <div className={`${styles.dockWrapper} ${styles.extraWrapper} ${styles.card2}`}>
              <div className={`${styles.dockCard} ${styles.valueCard}`}>
                <span className={styles.label}>No Mês</span>
                <span className={styles.value} style={{color: 'var(--text-main)'}}>{formatarMoeda(resumo.totalMes)}</span>
              </div>
            </div>

            {/* Card 3: Hoje (Mais no topo) */}
            <div className={`${styles.dockWrapper} ${styles.extraWrapper} ${styles.card3}`}>
              <div className={`${styles.dockCard} ${styles.valueCard}`}>
                <span className={styles.label}>Hoje</span>
                <span className={styles.value} style={{color: resumo.totalHoje > 0 ? '#fbbf24' : 'var(--text-muted)'}}>
                  {formatarMoeda(resumo.totalHoje)}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modal de Resumo */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Categorias">
         <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            <div style={detailItemStyle}><span>📄 Boletos</span> <strong>{formatarMoeda(resumo.detalhes.boletos)}</strong></div>
            <div style={detailItemStyle}><span>💳 Cartões</span> <strong>{formatarMoeda(resumo.detalhes.cartoes)}</strong></div>
            <div style={detailItemStyle}><span>🏦 Empréstimos</span> <strong>{formatarMoeda(resumo.detalhes.emprestimos)}</strong></div>
         </div>
      </Modal>
    </>
  );
}

const detailItemStyle = { display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' };
