// games/PalavraGame.jsx — jogo "Complete a Palavra" (alfabeto)
// mostra uma palavra com uma letra faltando e a criança escolhe a letra correta
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

const WORDS = [
  { word: 'BOLA',  missing: 1, options: ['O','A','E','I'] },  // B_LA
  { word: 'GATO',  missing: 0, options: ['G','D','C','P'] },  // _ATO
  { word: 'CASA',  missing: 2, options: ['S','T','P','L'] },  // CA_A
  { word: 'PATO',  missing: 3, options: ['O','A','E','I'] },  // PAT_
  { word: 'MACA',  missing: 1, options: ['A','E','I','O'] },  // M_CA
  { word: 'LOBO',  missing: 2, options: ['B','D','P','T'] },  // LO_O
  { word: 'FLOR',  missing: 0, options: ['F','S','T','P'] },  // _LOR
  { word: 'NAVIO', missing: 2, options: ['V','B','F','M'] },  // NA_IO
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function sample(arr, n) { return shuffle(arr).slice(0, n); }

function PalavraGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => sample(WORDS, TOTAL));

  return (
    <GameShell title="Complete a Palavra ✏️"
      instruction="Qual letra está faltando na palavra?" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];
        const letters = r.word.split('');        // divide a palavra em letras
        const answer  = letters[r.missing];      // letra correta que está faltando

        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Qual letra falta? 🔍</p>

            {/* exibe a palavra com a lacuna */}
            <div className={styles.wordDisplay}>
              {letters.map((l, i) => (
                <div
                  key={i}
                  className={`${styles.letterBox} ${i === r.missing ? styles.letterBlank : ''}`}
                >
                  {i === r.missing ? '_' : l} {/* mostra _ na posição faltante */}
                </div>
              ))}
            </div>

            {/* opções de letras */}
            <div className={styles.lettersGrid}>
              {shuffle(r.options).map((opt, i) => (
                <button
                  key={i}
                  className={styles.letterBtn}
                  onClick={() => opt === answer ? onCorrect() : onWrong()}
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

export default PalavraGame;
