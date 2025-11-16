
'use client';

import { useState, useEffect } from 'react';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance();
    u.lang = 'es-ES';
    
    const onEnd = () => setIsSpeaking(false);
    u.addEventListener('end', onEnd);

    setUtterance(u);

    return () => {
      u.removeEventListener('end', onEnd);
      synth.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (!utterance || window.speechSynthesis.speaking) return;
    
    utterance.text = text;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { isSpeaking, speak, stop };
};
