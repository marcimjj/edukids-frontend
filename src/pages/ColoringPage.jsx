// pages/ColoringPage.jsx — módulo de colorir com canvas funcional
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useSound }   from '../hooks/useSound';
import { useVoice }   from '../hooks/useVoice';
import { COLORING_DRAWINGS } from '../data/coloringDrawings';
import styles from './ColoringPage.module.css';

// paleta de cores
const PALETTE = [
  '#FF6B6B','#FF922B','#FFD93D','#6BCB77',
  '#4D96FF','#A78BFA','#FF6ECD','#F8C8A0',
  '#8B5E3C','#2D2D2D','#FFFFFF','#B8B8B8',
];

const BRUSH_SIZES = [
  { size: 8,  label: 'P' },
  { size: 16, label: 'M' },
  { size: 28, label: 'G' },
];

function ColoringPage() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const { profile, updateProgress } = useProfile();
  const { playCorrect, playClick }  = useSound();
  const { speak }                   = useVoice();

  const canvasRef  = useRef(null);
  const isDrawing  = useRef(false);
  const lastPos    = useRef(null);
  const imgRef     = useRef(null); // guarda a imagem carregada para redesenhar

  const [color,     setColor]     = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(16);
  const [isEraser,  setIsEraser]  = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [showSave,  setShowSave]  = useState(false);
  const [loaded,    setLoaded]    = useState(false);

  const drawing = COLORING_DRAWINGS.find(d => d.id === id);

  // voz de boas-vindas
  useEffect(() => {
    if (drawing) {
      setTimeout(() => speak(`Vamos colorir ${drawing.name}! Escolha uma cor e divirta-se!`), 600);
    }
  }, []);

  // carrega a imagem e inicializa o canvas
  useEffect(() => {
    if (!drawing?.imageUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // define tamanho do canvas
    const size = Math.min(window.innerWidth - 32, 480);
    canvas.width  = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');

    // fundo branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // carrega a imagem
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img; // guarda referência da imagem
      setLoaded(true);
    };
    img.onerror = () => setLoaded(true); // mesmo com erro, libera a tela
    img.src = drawing.imageUrl;
  }, [drawing]);

  // redesenha as linhas da imagem por cima da coloração
  const redrawLines = useCallback(() => {
    if (!imgRef.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // salva o estado atual do canvas (coloração)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // desenha a imagem em modo "multiply" para preservar a coloração
    ctx.save();
    ctx.globalCompositeOperation = 'multiply'; // mescla as linhas com as cores
    ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, []);

  // obtém posição correta do mouse/toque relativa ao canvas
  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();

    // fator de escala (canvas pode ter tamanho diferente do elemento CSS)
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top)  * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    };
  }, []);

  // pinta um ponto
  const paintPoint = useCallback((ctx, x, y) => {
    const size = isEraser ? brushSize * 2 : brushSize;
    ctx.save();
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? 'rgba(0,0,0,1)' : color;
    ctx.fill();
    ctx.restore();
    // redesenha as linhas por cima
    if (imgRef.current) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(imgRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.restore();
    }
  }, [color, brushSize, isEraser]);

  // pinta uma linha entre dois pontos
  const paintLine = useCallback((ctx, x1, y1, x2, y2) => {
    ctx.save();
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : color;
    ctx.lineWidth   = isEraser ? brushSize * 2 : brushSize;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
    ctx.restore();
    // redesenha linhas por cima
    if (imgRef.current) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(imgRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.restore();
    }
  }, [color, brushSize, isEraser]);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    isDrawing.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    paintPoint(ctx, pos.x, pos.y);
  }, [getPos, paintPoint]);

  const handleMove = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const pos  = getPos(e);
    const last = lastPos.current;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    paintLine(ctx, last.x, last.y, pos.x, pos.y);
    lastPos.current = pos;
  }, [getPos, paintLine]);

  const handleEnd = useCallback(() => {
    isDrawing.current = false;
    lastPos.current   = null;
  }, []);

  // limpa o canvas
  const clearCanvas = () => {
    playClick();
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // redesenha as linhas
    if (imgRef.current) {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  };

  // salva a obra
  const saveArtwork = () => {
    playCorrect();
    const canvas  = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const artworks = JSON.parse(localStorage.getItem('edukids_artworks') || '[]');
    artworks.push({
      id:        `${profile?.id}_${drawing?.id}_${Date.now()}`,
      drawingId: drawing?.id,
      name:      drawing?.name,
      emoji:     drawing?.emoji,
      image:     dataUrl,
      date:      new Date().toISOString(),
      profileId: profile?.id,
    });
    localStorage.setItem('edukids_artworks', JSON.stringify(artworks));
    updateProgress('cores', 3, 1);
    setSaved(true);
    setShowSave(true);
    speak('Parabéns! Sua obra de arte foi salva!');
  };

  if (!drawing) {
    return (
      <div className={styles.loading}>
        <span>🎨</span>
        <p>Desenho não encontrado.</p>
        <button onClick={() => navigate('/coloring')}>← Voltar</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => { playClick(); navigate('/coloring'); }}>←</button>
        <h2 className={styles.title}>{drawing.emoji} {drawing.name}</h2>
        <button className={styles.saveBtn} onClick={saveArtwork} disabled={saved}>
          {saved ? '✅' : '💾'}
        </button>
      </header>

      {/* canvas único com tudo integrado */}
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        {!loaded && (
          <div className={styles.loadingOverlay}>
            <span>🎨</span>
            <p>Carregando desenho...</p>
          </div>
        )}
      </div>

      {/* paleta */}
      <div className={styles.palette}>
        {PALETTE.map(c => (
          <button
            key={c}
            className={`${styles.colorBtn} ${color === c && !isEraser ? styles.colorActive : ''}`}
            style={{ background: c }}
            onClick={() => { setColor(c); setIsEraser(false); playClick(); }}
          />
        ))}
      </div>

      {/* controles */}
      <div className={styles.controls}>
        <div className={styles.brushSizes}>
          {BRUSH_SIZES.map(b => (
            <button
              key={b.size}
              className={`${styles.brushBtn} ${brushSize === b.size && !isEraser ? styles.brushActive : ''}`}
              onClick={() => { setBrushSize(b.size); setIsEraser(false); playClick(); }}
            >
              {b.label}
            </button>
          ))}
        </div>
        <button
          className={`${styles.toolBtn} ${isEraser ? styles.toolActive : ''}`}
          onClick={() => { setIsEraser(e => !e); playClick(); }}
        >
          🧹
        </button>
        <button className={styles.toolBtn} onClick={clearCanvas}>🗑️</button>
      </div>

      {/* cor ativa */}
      <div className={styles.activeColor}>
        <div className={styles.activeColorDot}
          style={{ background: isEraser ? '#FFF' : color, border: '2px solid #CCC' }} />
        <span>{isEraser ? 'Borracha' : 'Cor ativa'}</span>
      </div>

      {/* modal de salvo */}
      {showSave && (
        <div className={styles.overlay} onClick={() => setShowSave(false)}>
          <div className={styles.saveModal} onClick={e => e.stopPropagation()}>
            <span className={styles.saveEmoji}>🎉</span>
            <h3>Obra salva!</h3>
            <p>Sua arte foi guardada no seu perfil!</p>
            <button className={styles.btnPrimary} onClick={() => navigate('/coloring')}>
              Ver mais desenhos →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColoringPage;
