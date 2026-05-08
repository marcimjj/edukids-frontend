// games/MaiorGame.jsx — jogo "Qual é maior?" (matemática)
// a criança compara dois números e escolhe o maior
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

function generateRounds(total) {
  const rounds = [];
  for (let i = 0; i < total; i++) {
    const a = Math.floor(Math.random() * 9) + 1; // número de 1 a 9
    let b;
    do { b = Math.floor(Math.random() * 9) + 1; } while (b === a); // diferente de a
    rounds.push({ a, b, answer: Math.max(a, b) }); // resposta é o maior
  }
  return rounds;
}

function MaiorGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => generateRounds(TOTAL));

  return (
    <GameShell title="Qual é Maior? ⚖️"
      instruction="Compare os números e escolha o maior!" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];
        const shuffled = Math.random() > 0.5 ? [r.a, r.b] : [r.b, r.a]; // posição aleatória

        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Qual número é MAIOR? 🏆</p>
            <div className={styles.compareRow}>
              {shuffled.map((num, i) => (
                <button
                  key={i}
                  className={styles.numberBox}
                  style={{ cursor: 'pointer', border: '3px solid #EEE', transition: 'all 0.2s' }}
                  onClick={() => num === r.answer ? onCorrect() : onWrong()}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );
      }}
    </GameShell>
  );
}

export default MaiorGame;
