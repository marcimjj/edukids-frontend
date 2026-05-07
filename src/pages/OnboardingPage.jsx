// pages/OnboardingPage.jsx — tela de boas-vindas e criação do primeiro perfil
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, AVATARS } from '../hooks/useProfile';
import { useSound } from '../hooks/useSound';
import styles from './OnboardingPage.module.css';

function OnboardingPage() {
  const navigate = useNavigate();
  const { createProfile, profiles } = useProfile();
  const { playClick } = useSound();

  const [step,     setStep]     = useState(0);
  const [name,     setName]     = useState('');
  const [avatar,   setAvatar]   = useState(AVATARS[0]);
  const [age,      setAge]      = useState(4);
  const [finished, setFinished] = useState(false);

  // navega para /play quando o perfil for criado no estado
  useEffect(() => {
    if (finished && profiles.length > 0) {
      navigate('/play');
    }
  }, [finished, profiles.length, navigate]);

  const nextStep = () => {
    playClick();
    setStep(s => s + 1);
  };

  const finish = () => {
    playClick();
    createProfile(name.trim() || 'Criança', avatar, age);
    setFinished(true); // useEffect vai detectar e navegar
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className={styles.stepWrap}>
            <div className={styles.bigEmoji}>🎓</div>
            <h1 className={styles.title}>Bem-vindo ao<br />EduKids!</h1>
            <p className={styles.subtitle}>Aprender nunca foi tão divertido!</p>
            <button className={styles.btnPrimary} onClick={nextStep}>
              Vamos começar! 🚀
            </button>
          </div>
        );
      case 1:
        return (
          <div className={styles.stepWrap}>
            <div className={styles.bigEmoji}>✏️</div>
            <h2 className={styles.title}>Qual é o seu nome?</h2>
            <input
              className={styles.input}
              type="text"
              placeholder="Digite seu nome..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <button
              className={styles.btnPrimary}
              onClick={nextStep}
              disabled={!name.trim()}
            >
              Próximo ➡️
            </button>
          </div>
        );
      case 2:
        return (
          <div className={styles.stepWrap}>
            <div className={styles.bigEmoji}>{avatar}</div>
            <h2 className={styles.title}>Escolha seu personagem!</h2>
            <div className={styles.avatarGrid}>
              {AVATARS.map(a => (
                <button
                  key={a}
                  className={`${styles.avatarBtn} ${avatar === a ? styles.avatarSelected : ''}`}
                  onClick={() => { playClick(); setAvatar(a); }}
                >
                  {a}
                </button>
              ))}
            </div>
            <button className={styles.btnPrimary} onClick={nextStep}>
              Esse é eu! ✅
            </button>
          </div>
        );
      case 3:
        return (
          <div className={styles.stepWrap}>
            <div className={styles.bigEmoji}>🎂</div>
            <h2 className={styles.title}>Quantos anos você tem?</h2>
            <div className={styles.ageRow}>
              {[3, 4, 5, 6, 7].map(a => (
                <button
                  key={a}
                  className={`${styles.ageBtn} ${age === a ? styles.ageSelected : ''}`}
                  onClick={() => { playClick(); setAge(a); }}
                >
                  {a}
                </button>
              ))}
            </div>
            <button className={styles.btnPrimary} onClick={finish}>
              Pronto! Vamos jogar! 🎮
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dots}>
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className={`${styles.dot} ${step === i ? styles.dotActive : ''}`}
          />
        ))}
      </div>
      {renderStep()}
    </div>
  );
}

export default OnboardingPage;
