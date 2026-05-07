// pages/OnboardingPage.jsx — tela de boas-vindas e criação do primeiro perfil
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, AVATARS } from '../hooks/useProfile';
import { useSound } from '../hooks/useSound';
import styles from './OnboardingPage.module.css';

function OnboardingPage() {
  const navigate = useNavigate();         // hook de navegação
  const { createProfile } = useProfile(); // função para criar perfil
  const { playClick } = useSound();       // som de clique

  // etapa atual do onboarding (0 = boas-vindas, 1 = nome, 2 = avatar, 3 = idade)
  const [step, setStep] = useState(0);
  const [name,   setName]   = useState('');       // nome da criança
  const [avatar, setAvatar] = useState(AVATARS[0]); // avatar selecionado
  const [age,    setAge]    = useState(4);         // idade (4 ou 5 anos)

  // avança para o próximo passo
  const nextStep = () => {
    playClick(); // feedback sonoro
    setStep(s => s + 1);
  };

  // finaliza o onboarding e cria o perfil
  const finish = () => {
    playClick();
    createProfile(name.trim() || 'Criança', avatar, age); // cria o perfil
    navigate('/play'); // vai para o menu de jogos
  };

  // renderiza o passo atual
  const renderStep = () => {
    switch (step) {
      case 0: // tela de boas-vindas
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

      case 1: // tela de nome
        return (
          <div className={styles.stepWrap}>
            <div className={styles.bigEmoji}>✏️</div>
            <h2 className={styles.title}>Qual é o seu nome?</h2>
            <input
              className={styles.input}
              type="text"
              placeholder="Digite seu nome..."
              value={name}
              onChange={e => setName(e.target.value)} // atualiza estado do nome
              maxLength={20}  // limite de caracteres
              autoFocus       // foco automático no campo
            />
            <button
              className={styles.btnPrimary}
              onClick={nextStep}
              disabled={!name.trim()} // desabilita se vazio
            >
              Próximo ➡️
            </button>
          </div>
        );

      case 2: // tela de escolha de avatar
        return (
          <div className={styles.stepWrap}>
            <div className={styles.bigEmoji}>{avatar}</div>
            <h2 className={styles.title}>Escolha seu personagem!</h2>
            <div className={styles.avatarGrid}>
              {AVATARS.map(a => (
                <button
                  key={a}
                  className={`${styles.avatarBtn} ${avatar === a ? styles.avatarSelected : ''}`}
                  onClick={() => { playClick(); setAvatar(a); }} // seleciona avatar
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

      case 3: // tela de idade
        return (
          <div className={styles.stepWrap}>
            <div className={styles.bigEmoji}>🎂</div>
            <h2 className={styles.title}>Quantos anos você tem?</h2>
            <div className={styles.ageRow}>
              {[3, 4, 5, 6, 7].map(a => (
                <button
                  key={a}
                  className={`${styles.ageBtn} ${age === a ? styles.ageSelected : ''}`}
                  onClick={() => { playClick(); setAge(a); }} // seleciona idade
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
      {/* indicador de progresso dos passos */}
      <div className={styles.dots}>
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className={`${styles.dot} ${step === i ? styles.dotActive : ''}`}
          />
        ))}
      </div>

      {/* conteúdo do passo atual */}
      {renderStep()}
    </div>
  );
}

export default OnboardingPage; // exporta a página
