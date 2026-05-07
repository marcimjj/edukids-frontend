// games/ContarGame.jsx — jogo "Conte os objetos" (matemática)
// a criança conta emojis na tela e escolhe o número correto
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

// gera rodadas com quantidade aleatória de emojis
function generateRounds(total) {
  const emojis = ['🍎','🌟','🐶','🍕','🎈','🦋','🍦','⚽'];
  const rounds = [];
  for (let i = 0; i < total; i++) {
    const emoji  = emojis[i % emojis.length];            // emoji da rodada
    const count  = Math.floor(Math.random() * 7) + 2;    // quantidade: 2 a 8
    // gera 3 opções erradas únicas
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const w = Math.floor(Math.random() * 9) + 1;       // números de 1 a 9
      if (w !== count) wrongs.add(w);                    // somente diferentes da resposta
    }
    const options = [count, ...wrongs].sort(() => Math.random() - 0.5); // embaralha
    rounds.push({ emoji, count, options });
  }
  return rounds;
}

function ContarGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => generateRounds(TOTAL));

  return (
    <GameShell title="Conte os Objetos 🍎" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];

        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Quantos tem aqui? 🤔</p>

            {/* grid de emojis para contar */}
            <div className={styles.emojiGrid}>
              {Array.from({ length: r.count }).map((_, i) => (
                <span key={i} className={styles.countEmoji}>{r.emoji}</span>
              ))}
            </div>

            {/* opções numéricas */}
            <div className={styles.numbersGrid}>
              {r.options.map((opt, i) => (
                <button
                  key={i}
                  className={styles.numberBtn}
                  onClick={() => opt === r.count ? onCorrect() : onWrong()}
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

export default ContarGame;
