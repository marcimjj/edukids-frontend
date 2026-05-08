// pages/PlayMenuPage.jsx — menu principal de categorias de jogos
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useSound } from '../hooks/useSound';
import styles from './PlayMenuPage.module.css';

// definição das 4 categorias de jogos com cor, ícone e rota
const CATEGORIES = [
  {
    id:          'logica',          // identificador único
    label:       'Lógica',          // nome exibido
    description: 'Padrões e sequências', // descrição curta
    icon:        '🧩',             // emoji de ícone
    color:       'var(--color-blue)',    // cor de fundo
    shadow:      '#2563B0',             // cor da sombra do botão
    games: [                            // jogos disponíveis nessa categoria
      { id: 'sequencia',  label: 'Complete a sequência', icon: '🔢' },
      { id: 'diferente',  label: 'Qual é o diferente?',  icon: '🔍' },
      { id: 'tamanho',    label: 'Ordene por tamanho',   icon: '📏' },
    ]
  },
  {
    id:          'matematica',
    label:       'Matemática',
    description: 'Números e contas',
    icon:        '🔢',
    color:       'var(--color-yellow)',
    shadow:      '#C9980A',
    games: [
      { id: 'contar',   label: 'Contar objetos',    icon: '🍎' },
      { id: 'maior',    label: 'Qual é maior?',     icon: '⚖️' },
      { id: 'soma',     label: 'Soma com frutas',   icon: '➕' },
    ]
  },
  {
    id:          'alfabeto',
    label:       'Alfabeto',
    description: 'Letras e palavras',
    icon:        '📖',
    color:       'var(--color-red)',
    shadow:      '#C04040',
    games: [
      { id: 'letra',    label: 'Qual letra é essa?',    icon: '🔤' },
      { id: 'palavra',  label: 'Complete a palavra',    icon: '✏️' },
      { id: 'liga',     label: 'Liga letra à imagem',   icon: '🔗' },
    ]
  },
  {
    id:          'cores',
    label:       'Cores e Formas',
    description: 'Identifique e combine',
    icon:        '🎨',
    color:       'var(--color-green)',
    shadow:      '#3D9B47',
    games: [
      { id: 'cor',      label: 'Identifique a cor',    icon: '🌈' },
      { id: 'forma',    label: 'Encaixe de formas',    icon: '🔷' },
      { id: 'igual',    label: 'Encontre o igual',     icon: '👁️' },
    ]
  },
];

function PlayMenuPage() {
  const navigate = useNavigate();
  const { profile, clearProfile } = useProfile();
  const { playClick } = useSound();

  const [selectedCat, setSelectedCat] = React.useState(null); // categoria expandida

  // navega para o jogo selecionado
  const goToGame = (catId, gameId) => {
    playClick();
    navigate(`/game/${catId}-${gameId}`); // ex: /game/logica-sequencia
  };

  // expande ou fecha a categoria clicada
  const toggleCategory = (catId) => {
    playClick();
    setSelectedCat(prev => prev === catId ? null : catId); // toggle
  };

  // calcula o total de estrelas do perfil atual
  const totalStars = profile
    ? Object.values(profile.progress).reduce((acc, c) => acc + c.stars, 0)
    : 0;

  return (
    <div className={styles.container}>
      {/* header com perfil ativo */}
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => { playClick(); clearProfile(); navigate('/'); }}
        >
          ← Trocar
        </button>

        {/* info do perfil ativo */}
        <div className={styles.profileInfo}>
          <span className={styles.avatar}>{profile?.avatar}</span>
          <span className={styles.profileName}>{profile?.name}</span>
        </div>

        {/* total de estrelas */}
        <div className={styles.starsTotal}>
          <span>⭐</span>
          <span className={styles.starsCount}>{totalStars}</span>
        </div>
      </header>

      {/* saudação */}
      <div className={styles.greeting}>
        <h2>O que vamos aprender hoje?</h2>
      </div>

      {/* lista de categorias */}
      <div className={styles.categories}>
        {CATEGORIES.map(cat => (
          <div key={cat.id} className={styles.catWrapper}>
            {/* botão de categoria */}
            <button
              className={styles.catCard}
              style={{ background: cat.color, boxShadow: `0 6px 0 ${cat.shadow}` }}
              onClick={() => toggleCategory(cat.id)}
            >
              <span className={styles.catIcon}>{cat.icon}</span>
              <div className={styles.catInfo}>
                <span className={styles.catLabel}>{cat.label}</span>
                <span className={styles.catDesc}>{cat.description}</span>
              </div>
              {/* estrelas acumuladas nessa categoria */}
              <div className={styles.catStars}>
                {profile?.progress[cat.id]?.stars > 0 &&
                  `⭐ ${profile.progress[cat.id].stars}`
                }
              </div>
              {/* indicador de expansão */}
              <span className={`${styles.chevron} ${selectedCat === cat.id ? styles.chevronOpen : ''}`}>
                ▼
              </span>
            </button>

            {/* lista de jogos expandida */}
            {selectedCat === cat.id && (
              <div className={styles.gamesList}>
                {cat.games.map(game => (
                  <button
                    key={game.id}
                    className={styles.gameBtn}
                    onClick={() => goToGame(cat.id, game.id)}
                  >
                    <span className={styles.gameIcon}>{game.icon}</span>
                    <span className={styles.gameLabel}>{game.label}</span>
                    <span className={styles.playArrow}>▶</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* botão de ver progresso */}
     <button
  className={styles.coloringBtn}
  onClick={() => { playClick(); navigate('/coloring'); }}
>
  🎨 Colorir
</button>
    </div>
  );
}

export default PlayMenuPage;
