// hooks/useVoice.js — hook para leitura de instruções via ElevenLabs
// usa a voz Amanda Kelly (PT-BR) para ler as instruções das atividades

const ELEVENLABS_API_KEY = 'sk_9dc38e6a4a4da365eb6fcb9397e93f6f9d0ea9281056da32';
const VOICE_ID           = 'oi8rgjIfLgJRsQ6rbZh3'; // Amanda Kelly — PT-BR

// cache de áudios já gerados para não repetir chamadas à API
const audioCache = {};

export function useVoice() {

  // lê um texto em voz alta via ElevenLabs
  const speak = async (text) => {
    if (!text) return; // ignora texto vazio

    stop(); // para qualquer áudio em andamento

    try {
      // verifica se já tem no cache
      if (audioCache[text]) {
        audioCache[text].currentTime = 0;
        await audioCache[text].play();
        return;
      }

      // chama a API do ElevenLabs
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: 'POST',
          headers: {
            'Accept':       'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key':   ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2', // suporta PT-BR
            voice_settings: {
              stability:         0.5,
              similarity_boost:  0.75,
              style:             0.3,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        speakFallback(text); // fallback gratuito
        return;
      }

      // converte em áudio e toca
      const audioBlob = await response.blob();
      const audioUrl  = URL.createObjectURL(audioBlob);
      const audio     = new Audio(audioUrl);
      audioCache[text] = audio; // salva no cache
      await audio.play();

    } catch (err) {
      console.warn('ElevenLabs erro, usando fallback:', err.message);
      speakFallback(text);
    }
  };

  // para qualquer áudio em reprodução
  const stop = () => {
    Object.values(audioCache).forEach(audio => {
      try { audio.pause(); audio.currentTime = 0; } catch (_) {}
    });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return { speak, stop };
}

// fallback gratuito usando Web Speech API do navegador
function speakFallback(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u  = new SpeechSynthesisUtterance(text);
  u.lang   = 'pt-BR'; // português Brasil
  u.rate   = 0.85;    // velocidade mais lenta para crianças
  u.pitch  = 1.1;     // tom levemente mais agudo e amigável
  u.volume = 1.0;
  window.speechSynthesis.speak(u);
}
