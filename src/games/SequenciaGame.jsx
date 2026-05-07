// games/SequenciaGame.jsx — jogo "Complete a Sequência" (categoria: lógica)
// a criança vê uma sequência de emojis/formas e escolhe qual vem a seguir
import React, { useState, useEffect } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

// banco de sequências: cada item tem padrão e resposta correta
const SEQUENCES = [
  { pattern: ['🔴','🔵','🔴','🔵','🔴'], answer: '🔵', options: ['🟡','🔵','🟢','🔴'] },
  { pattern: ['⭐','⭐','🌙','⭐','⭐'], answer: '🌙', options: ['☀️','🌙','⭐','🌟'] },
  { pattern: ['🐶','🐱','🐶','🐱','🐶'], answer: '🐱', options: ['🐭','🐱','🐶','🐹'] },
  { pattern: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'], answer: '6️⃣', options: ['6️⃣','7️⃣','8️⃣','0️⃣'] },
  { pattern: ['🍎','🍊','🍋','🍎','🍊'], answer: '🍋', options: ['🍇','🍋','🍓','🍑'] },
  { pattern: ['🔺','🔷','🔺','🔷','🔺'], answer: '🔷', options: ['🔶','🔷','🔺','🔻'] },
  { pattern: ['🐘','🐘','🐭','🐘','🐘'], answer: '🐭', options: ['🐭','🐸','🐘','🦁'] },
  { pattern: ['🌞','🌧️','🌞','🌧️','🌞'], answer: '🌧️', options: ['⛅','🌧️','🌞','❄️'] },
];

// embaralha um array (algoritmo Fisher-Yates)
function shuffle(arr) {
  const a = [...arr]; // copia para não mutar o original
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // índice aleatório
    [a[i], a[j]] = [a[j], a[i]];                  // troca os elementos
  }
  return a;
}

// seleciona N itens aleatórios de um array
function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

function SequenciaGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6; // total de rodadas

  // seleciona sequências aleatórias ao montar o componente
  const [rounds] = useState(() => sample(SEQUENCES, TOTAL));

  return (
    <GameShell
      title="Complete a Sequência 🔢"
      categoria={categoria}
      totalRounds={TOTAL}
      onEnd={onEnd}
      onBack={onBack}
    >
      {({ round, onCorrect, onWrong }) => {
        const seq = rounds[round - 1]; // pega a sequência da rodada atual

        return (
          <div className={styles.gameArea}>
            {/* instrução para a criança */}
            <p className={styles.instruction}>O que vem depois? 🤔</p>

            {/* exibe o padrão da sequência */}
            <div className={styles.sequence}>
              {seq.pattern.map((item, i) => (
                <span key={i} className={styles.seqItem}>{item}</span>
              ))}
              {/* ponto de interrogação indicando o item que falta */}
              <span className={`${styles.seqItem} ${styles.seqBlank}`}>?</span>
            </div>

            {/* opções de resposta */}
            <div className={styles.optionsGrid}>
              {shuffle(seq.options).map((opt, i) => (
                <button
                  key={i}
                  className={styles.optionBtn}
                  onClick={() => opt === seq.answer ? onCorrect() : onWrong()}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }}
    </GameShell>
  );
}

export default SequenciaGame;
