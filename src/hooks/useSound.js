// hooks/useSound.js — hook para gerenciar sons de feedback dos jogos
import { useCallback } from 'react';

// gera um som sintético usando Web Audio API (sem arquivos externos)
function playTone(frequency, duration, type = 'sine', gain = 0.3) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)(); // cria contexto de áudio
    const oscillator = ctx.createOscillator(); // cria gerador de onda
    const gainNode   = ctx.createGain();       // cria controlador de volume

    oscillator.connect(gainNode);              // conecta oscilador ao volume
    gainNode.connect(ctx.destination);         // conecta volume à saída de áudio

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime); // define frequência
    oscillator.type = type;                    // tipo de onda (sine, square, etc)
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);             // volume inicial
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); // fade out

    oscillator.start(ctx.currentTime);                      // inicia o som
    oscillator.stop(ctx.currentTime + duration);            // para após duração
  } catch (e) {
    // silencia erros de áudio (nem todos dispositivos suportam)
  }
}

// hook que expõe funções de som para os jogos
export function useSound() {

  // som de acerto — dois tons ascendentes alegres
  const playCorrect = useCallback(() => {
    playTone(523, 0.15, 'sine', 0.3);  // Dó
    setTimeout(() => playTone(659, 0.2, 'sine', 0.3), 120); // Mi
    setTimeout(() => playTone(784, 0.3, 'sine', 0.3), 240); // Sol
  }, []);

  // som de erro — tom descendente suave
  const playWrong = useCallback(() => {
    playTone(330, 0.1, 'sine', 0.2);   // Mi
    setTimeout(() => playTone(262, 0.25, 'sine', 0.2), 100); // Dó grave
  }, []);

  // som de conquista / nível completo — fanfarra curta
  const playWin = useCallback(() => {
    const notes = [523, 659, 784, 1047]; // Dó Mi Sol Dó alto
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.35), i * 150); // toca em sequência
    });
  }, []);

  // som de clique em botão — tick suave
  const playClick = useCallback(() => {
    playTone(800, 0.05, 'sine', 0.15); // tom agudo curto
  }, []);

  // som de estrela conquistada — shimmer
  const playStar = useCallback(() => {
    playTone(1000, 0.08, 'sine', 0.2);
    setTimeout(() => playTone(1200, 0.08, 'sine', 0.2), 80);
    setTimeout(() => playTone(1400, 0.12, 'sine', 0.2), 160);
  }, []);

  return { playCorrect, playWrong, playWin, playClick, playStar };
}
