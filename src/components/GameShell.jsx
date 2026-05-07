// components/GameShell.jsx — shell reutilizável que envolve todos os jogos
// agora com voz ElevenLabs lendo a instrução automaticamente a cada rodada
import React, { useState, useCallback, useEffect } from 'react';
import { useSound } from '../hooks/useSound';
import { useVoice } from '../hooks/useVoice';
import styles from './GameShell.module.css';

function GameShell({
  title,          // título do jogo exibido no header
  instruction,    // instrução falada pela Amanda Kelly a cada rodada
  categoria,      // identificador da categoria (para cor do tema)
  totalRounds,    // número total de rodadas
  onEnd,          // callback(categoria, stars, streak) ao terminar
  onBack,         // callback para voltar ao menu
  children,       // função que recebe callbacks e renderiza o conteúdo do jogo
}) {
  const { playCorrect, playWrong } = useSound(); // sons de feedback
  const { speak, stop }            = useVoice(); // voz ElevenLabs

  const [round,      setRound]      = useState(1);    // rodada atual
  const [score,      setScore]      = useState(0);    // pontuação de acertos
  const [streak,     setStreak]     = useState(0);    // sequência atual
  const [bestStreak, setBestStreak] = useState(0);    // melhor sequência
  const [feedback,   setFeedback]   = useState(null); // 'correct' | 'wrong' | null
  const [finished,   setFinished]   = useState(false); // se o jogo acabou

  // mapa de cor por categoria
  const COLORS = {
    logica:     'var(--color-blue)',
    matematica: 'var(--color-yellow)',
    alfabeto:   'var(--color-red)',
    cores:      'var(--color-green)',
  };
  const themeColor = COLORS[categoria] || 'var(--color-blue)';

  // lê a instrução em voz alta quando a rodada muda
  useEffect(() => {
    if (instruction && !finished) {
      // pequeno delay para não sobrepor o som de acerto/erro
      const timer = setTimeout(() => speak(instruction), 600);
      return () => clearTimeout(timer);
    }
  }, [round, instruction, finished]);

  // para a voz ao sair do jogo
  useEffect(() => {
    return () => stop();
  }, []);

  // chamado pelo jogo quando a resposta está correta
  const handleCorrect = useCallback(() => {
    playCorrect();
    setFeedback('correct');
    setScore(s => s + 1);
    setStreak(s => {
      const ns = s + 1;
      setBestStreak(b => Math.max(b, ns));
      return ns;
    });
    setTimeout(() => {
      setFeedback(null);
      if (round >= totalRounds) {
        finishGame(score + 1, bestStreak);
      } else {
        setRound(r => r + 1);
      }
    }, 800);
  }, [round, totalRounds, score, bestStreak]);

  // chamado pelo jogo quando a resposta está errada
  const handleWrong = useCallback(() => {
    playWrong();
    setFeedback('wrong');
    setStreak(0);
    setTimeout(() => {
      setFeedback(null);
      if (round >= totalRounds) {
        finishGame(score, bestStreak);
      } else {
        setRound(r => r + 1);
      }
    }, 800);
  }, [round, totalRounds, score, bestStreak]);

  // finaliza o jogo e calcula estrelas
  const finishGame = (finalScore, finalStreak) => {
    stop(); // para a voz ao terminar
    setFinished(true);
    const pct   = finalScore / totalRounds;
    const stars = pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1;
    setTimeout(() => onEnd(categoria, stars, finalStreak), 500);
  };

  // porcentagem de progresso da barra
  const progress = ((round - 1) / totalRounds) * 100;

  return (
    <div className={styles.container} style={{ '--theme': themeColor }}>

      {/* header do jogo */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => { stop(); onBack(); }}>✕</button>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.roundBadge}>{round}/{totalRounds}</div>
      </header>

      {/* barra de progresso */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {/* botão de ouvir instrução novamente */}
      {instruction && (
        <button
          className={styles.speakBtn}
          onClick={() => speak(instruction)}
          title="Ouvir instrução novamente"
        >
          🔊 Ouvir novamente
        </button>
      )}

      {/* área de conteúdo do jogo */}
      <div className={`${styles.content} ${feedback ? styles[feedback] : ''}`}>
        {/* feedback visual de acerto/erro */}
        {feedback && (
          <div className={styles.feedbackOverlay}>
            <span className={styles.feedbackEmoji}>
              {feedback === 'correct' ? '✅' : '❌'}
            </span>
          </div>
        )}

        {/* renderiza o jogo filho */}
        {!finished && children({
          round,
          onCorrect: handleCorrect,
          onWrong:   handleWrong,
          score,
        })}
      </div>

      {/* pontuação no rodapé */}
      <div className={styles.footer}>
        <span className={styles.scoreLabel}>⭐ {score} acertos</span>
        {streak > 1 && (
          <span className={styles.streakBadge}>🔥 {streak} seguidos!</span>
        )}
      </div>
    </div>
  );
}

export default GameShell;
