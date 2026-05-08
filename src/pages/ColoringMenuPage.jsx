// pages/ColoringMenuPage.jsx — galeria de desenhos para colorir
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '../hooks/useSound';
import { useVoice } from '../hooks/useVoice';
import { COLORING_DRAWINGS } from '../data/coloringDrawings'; // manifest embutido
import styles from './ColoringMenuPage.module.css';

function ColoringMenuPage() {
  const navigate = useNavigate();
  const { playClick } = useSound();
  const { speak }     = useVoice();

  const [artworks, setArtworks] = useState([]); // obras já coloridas salvas
  const [tab,      setTab]      = useState('draw'); // 'draw' | 'gallery'

  // carrega obras salvas do localStorage e fala boas-vindas
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('edukids_artworks') || '[]');
      setArtworks(saved);
    } catch (e) {
      setArtworks([]);
    }
    setTimeout(() => speak('Escolha um desenho para colorir!'), 500);
  }, []);

  const goToDrawing = (id) => {
    playClick();
    navigate(`/coloring/${id}`);
  };

  return (
    <div className={styles.container}>
      {/* header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => { playClick(); navigate('/play'); }}>
          ←
        </button>
        <h1 className={styles.title}>🎨 Colorir</h1>
      </header>

      {/* abas */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'draw' ? styles.tabActive : ''}`}
          onClick={() => { playClick(); setTab('draw'); }}
        >
          🖌️ Desenhos ({COLORING_DRAWINGS.length})
        </button>
        <button
          className={`${styles.tab} ${tab === 'gallery' ? styles.tabActive : ''}`}
          onClick={() => { playClick(); setTab('gallery'); }}
        >
          🖼️ Minhas obras ({artworks.length})
        </button>
      </div>

      {/* aba de desenhos */}
      {tab === 'draw' && (
        <div className={styles.grid}>
          {COLORING_DRAWINGS.map(d => (
            <button
              key={d.id}
              className={styles.drawingCard}
              onClick={() => goToDrawing(d.id)}
            >
              <img src={d.imageUrl} alt={d.name} className={styles.drawingImg} />
              <span className={styles.drawingName}>{d.emoji} {d.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* aba de galeria */}
      {tab === 'gallery' && (
        <div className={styles.grid}>
          {artworks.length === 0 ? (
            <div className={styles.empty}>
              <span>🖼️</span>
              <p>Nenhuma obra salva ainda.</p>
              <p style={{ fontSize: '0.8rem', color: '#AAA' }}>
                Colore um desenho e salva para aparecer aqui!
              </p>
            </div>
          ) : (
            artworks.map(art => (
              <div key={art.id} className={styles.artCard}>
                <img src={art.image} alt={art.name} className={styles.artImg} />
                <span className={styles.artName}>{art.emoji} {art.name}</span>
                <span className={styles.artDate}>
                  {new Date(art.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ColoringMenuPage;
