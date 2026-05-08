// pages/ColoringPage.jsx — módulo de colorir com canvas + paleta de cores
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useSound }   from '../hooks/useSound';
import { useVoice }   from '../hooks/useVoice';
import { COLORING_DRAWINGS } from '../data/coloringDrawings';
import styles from './ColoringPage.module.css';

// paleta de cores estilo Bobbie Goods — pastéis vibrantes
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

  const canvasRef   = useRef(null);  // canvas de pintura
  const overlayRef  = useRef(null);  // canvas com linhas do desenho
  const isDrawing   = useRef(false);
  const lastPos     = useRef(null);

  const [color,     setColor]     = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(16);
  const [isEraser,  setIsEraser]  = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [showSave,  setShowSave]  = useState(false);

  // encontra o desenho pelo ID
  const drawing = COLORING_DRAWINGS.find(d => d.id === id);

  // fala boas-vindas ao abrir o desenho
  useEffect(() => {
    if (drawing) {
      setTimeout(() => speak(`Vamos colorir ${drawing.name}! Escolha uma cor e divirta-se!`), 600);
    }
  }, [drawing]);

  // carrega a imagem no canvas overlay
  useEffect(() => {
    if (!drawing?.imageUrl) return;
    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const size = Math.min(window.innerWidth - 32, 500);
      canvas.width  = overlay.width  = size;
      canvas.height = overlay.height = size;

      // fundo branco no canvas de coloração
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      // linhas do desenho no overlay
      const octx = overlay.getContext('2d');
      octx.drawImage(img, 0, 0, size, size);
    };

    img.src = drawing.imageUrl;
  }, [drawing]);

  // obtém posição do toque/mouse relativa ao canvas
  const getPos = useCallback((e, canvas) => {
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
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

  const startDraw = useCallback((e) => {
    e.preventDefault();
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const pos    = getPos(e, canvas);
    lastPos.current = pos;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (isEraser ? brushSize * 1.5 : brushSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#FFFFFF' : color;
    ctx.fill();
  }, [color, brushSize, isEraser, getPos]);

  const draw = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const pos    = getPos(e, canvas);
    const last   = lastPos.current;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    ctx.lineWidth   = isEraser ? brushSize * 1.5 : brushSize;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
    lastPos.current = pos;
  }, [color, brushSize, isEraser, getPos]);

  const endDraw = useCallback(() => {
    isDrawing.current = false;
    lastPos.current   = null;
  }, []);

  const clearCanvas = () => {
    playClick();
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveArtwork = () => {
    playCorrect();
    const canvas  = canvasRef.current;
    const overlay = overlayRef.current;

    // combina coloração + linhas num canvas final
    const final = document.createElement('canvas');
    final.width  = canvas.width;
    final.height = canvas.height;
    const fctx   = final.getContext('2d');
    fctx.drawImage(canvas,  0, 0);
    fctx.drawImage(overlay, 0, 0);

    const dataUrl  = final.toDataURL('image/png');
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
    updateProgress('cores', 3, 1); // conta como progresso de cores
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

      {/* canvas empilhados */}
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        <canvas ref={overlayRef} className={`${styles.canvas} ${styles.canvasOverlay}`} />
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
        <button className={`${styles.toolBtn} ${isEraser ? styles.toolActive : ''}`}
          onClick={() => { setIsEraser(e => !e); playClick(); }} title="Borracha">
          🧹
        </button>
        <button className={styles.toolBtn} onClick={clearCanvas} title="Limpar tudo">
          🗑️
        </button>
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
