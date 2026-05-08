// games/SomaGame.jsx — jogo "Soma com Frutas" (matemática)
// a criança vê dois grupos de emojis e escolhe o total correto
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

function generateRounds(total) {
  const emojis = ['🍎','🍊','🍋','🍇','🍓','🫐','🍉'];
  const rounds = [];
  for (let i = 0; i < total; i++) {
    const emoji = emojis[i % emojis.length];
    const a = Math.floor(Math.random() * 4) + 1; // 1 a 4
    const b = Math.floor(Math.random() * 4) + 1; // 1 a 4
    const answer = a + b;                         // resposta correta
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const w = Math.floor(Math.random() * 8) + 1;
      if (w !== answer) wrongs.add(w);
    }
    rounds.push({
      emoji, a, b, answer,
      options: [answer, ...wrongs].sort(() => Math.random() - 0.5),
    });
  }
  return rounds;
}

function SomaGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => generateRounds(TOTAL));

  return (
    <GameShell title="Soma com Frutas ➕"
      instruction="Some as frutas dos dois grupos e escolha o total!" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];

        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Quantas frutas no total? 🧮</p>

            {/* exibe os dois grupos de frutas com sinal de mais */}
            <div className={styles.compareRow}>
              <div className={styles.emojiGrid} style={{ maxWidth: 120 }}>
                {Array.from({ length: r.a }).map((_, i) => (
                  <span key={i} className={styles.countEmoji}>{r.emoji}</span>
                ))}
              </div>
              <span className={styles.mathSymbol}>+</span>
              <div className={styles.emojiGrid} style={{ maxWidth: 120 }}>
                {Array.from({ length: r.b }).map((_, i) => (
                  <span key={i} className={styles.countEmoji}>{r.emoji}</span>
                ))}
              </div>
              <span className={styles.mathSymbol}>=</span>
              <span className={styles.mathSymbol} style={{ fontSize: '3rem' }}>?</span>
            </div>

            {/* opções numéricas */}
            <div className={styles.numbersGrid}>
              {r.options.map((opt, i) => (
                <button
                  key={i}
                  className={styles.numberBtn}
                  onClick={() => opt === r.answer ? onCorrect() : onWrong()}
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

export default SomaGame;
