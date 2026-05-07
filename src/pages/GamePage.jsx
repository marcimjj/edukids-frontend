// pages/GamePage.jsx — roteador de jogos: carrega o componente correto pelo tipo de jogo
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useSound } from '../hooks/useSound';

// importa todos os jogos disponíveis
import SequenciaGame  from '../games/SequenciaGame';   // lógica: complete a sequência
import DifferentGame  from '../games/DifferentGame';   // lógica: qual é o diferente
import TamanhoGame    from '../games/TamanhoGame';     // lógica: ordene por tamanho
import ContarGame     from '../games/ContarGame';      // matemática: contar objetos
import MaiorGame      from '../games/MaiorGame';       // matemática: qual é maior
import SomaGame       from '../games/SomaGame';        // matemática: soma com frutas
import LetraGame      from '../games/LetraGame';       // alfabeto: qual letra é essa
import PalavraGame    from '../games/PalavraGame';     // alfabeto: complete a palavra
import LigaGame       from '../games/LigaGame';        // alfabeto: liga letra à imagem
import CorGame        from '../games/CorGame';         // cores: identifique a cor
import FormaGame      from '../games/FormaGame';       // formas: encaixe de formas
import IgualGame      from '../games/IgualGame';       // formas: encontre o igual

// mapa de tipo de jogo para componente correspondente
const GAME_MAP = {
  'logica-sequencia':   SequenciaGame,
  'logica-diferente':   DifferentGame,
  'logica-tamanho':     TamanhoGame,
  'matematica-contar':  ContarGame,
  'matematica-maior':   MaiorGame,
  'matematica-soma':    SomaGame,
  'alfabeto-letra':     LetraGame,
  'alfabeto-palavra':   PalavraGame,
  'alfabeto-liga':      LigaGame,
  'cores-cor':          CorGame,
  'cores-forma':        FormaGame,
  'cores-igual':        IgualGame,
};

function GamePage() {
  const { tipo } = useParams();     // pega o tipo da URL ex: "logica-sequencia"
  const navigate  = useNavigate();
  const { updateProgress } = useProfile(); // para salvar progresso ao terminar
  const { playWin } = useSound();

  // resolve o componente de jogo pelo tipo
  const GameComponent = GAME_MAP[tipo];

  // callback chamado pelo jogo quando a sessão termina
  const handleGameEnd = (categoria, stars, streak) => {
    playWin(); // toca fanfarra de conclusão
    updateProgress(categoria, stars, streak); // salva progresso no perfil
    setTimeout(() => navigate('/play'), 1500); // volta ao menu após 1.5s
  };

  // jogo não encontrado — tipo de rota inválido
  if (!GameComponent) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>😅 Jogo não encontrado!</h2>
        <button onClick={() => navigate('/play')} style={{ marginTop: 16, padding: '10px 24px' }}>
          Voltar ao menu
        </button>
      </div>
    );
  }

  // extrai a categoria do tipo (ex: "logica-sequencia" → "logica")
  const categoria = tipo.split('-')[0];

  return (
    // renderiza o componente de jogo passando os props necessários
    <GameComponent
      categoria={categoria}    // identificador da categoria para salvar progresso
      onEnd={handleGameEnd}    // callback de fim de jogo
      onBack={() => navigate('/play')} // volta ao menu
    />
  );
}

export default GamePage;
