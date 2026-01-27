import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, ArrowRight, Map, Search, Filter, Sparkles, User, Mic } from 'lucide-react';
import { generateSpeech } from './geminiService';

interface GuidedTourProps {
  onComplete: () => void;
}

const TOUR_STEPS = [
  {
    targetId: 'map-view',
    title: 'Інтерактивна мапа',
    text: 'Це — серце нашого додатку. Тут ви можете бачити всі доступні організації. Використовуйте жести для навігації та натискайте на маркери, щоб дізнатися більше.',
    icon: <Map size={24} />
  },
  {
    targetId: 'mobile-toolbar-search',
    title: 'Розумний пошук',
    text: 'Введіть ключові слова, щоб швидко знайти потрібну організацію за назвою або адресою.',
    icon: <Search size={24} />
  },
  {
    targetId: 'mobile-toolbar-filter',
    title: 'Гнучкі фільтри',
    text: 'Натисніть тут, щоб відкрити фільтри та обрати категорії допомоги, які вас цікавлять.',
    icon: <Filter size={24} />
  },
    {
    targetId: 'chat-fab',
    title: 'Пані Думка, ваш ШІ-помічник',
    text: 'Це — пані Думка, ваш персональний асистент. Натисніть на цю кнопку, щоб відкрити чат і задати будь-яке питання. Ви можете навіть говорити з нею голосом!',
    icon: <Sparkles size={24} />
  },
  {
    targetId: 'creator-login-button',
    title: 'Вхід для партнерів',
    text: 'Якщо ви є представником організації або хочете додати нову, ви можете увійти тут, щоб отримати розширені можливості.',
    icon: <User size={24} />
  }
];

export const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      stopAudio();
      audioContextRef.current?.close();
    };
  }, []);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch(e) {}
      sourceNodeRef.current = null;
    }
  };

  const playCurrentStepAudio = async () => {
    stopAudio();
    if (isMuted) return;
    setIsLoadingAudio(true);
    try {
      const textToSpeak = TOUR_STEPS[currentStep].text;
      const audioData = await generateSpeech(textToSpeak);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      const buffer = await decodeAudioData(audioData, audioContextRef.current);
      if (isMuted) { setIsLoadingAudio(false); return; }
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
      sourceNodeRef.current = source;
    } catch (e: any) {
      console.error("Audio error", e);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const decodeAudioData = async (data: ArrayBuffer, ctx: AudioContext): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  useEffect(() => {
    playCurrentStepAudio();
  }, [currentStep]);

  useEffect(() => {
    if (isMuted) {
      stopAudio();
    } else {
      playCurrentStepAudio();
    }
  }, [isMuted]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = TOUR_STEPS[currentStep];
  const targetElement = document.getElementById(step.targetId);
  const rect = targetElement?.getBoundingClientRect();

  const getTooltipPosition = () => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    return {
      top: `${rect.bottom + 10}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: 'translateX(-50%)',
    };
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-black/50 backdrop-blur-sm">
       {rect && <div className="fixed inset-0" style={{ clipPath: `path('M0,0H${window.innerWidth}V${window.innerHeight}H0V0z M${rect.left},${rect.top}H${rect.right}V${rect.bottom}H${rect.left}V${rect.top}z')` }}></div>}
      <div
        className="absolute bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 max-w-sm w-full transition-all duration-300"
        style={getTooltipPosition()}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300 rounded-full flex items-center justify-center">
            {step.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{step.text}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className={isLoadingAudio ? 'animate-pulse' : ''} />}
            </button>
             <div className="text-xs text-slate-400">{currentStep + 1} / {TOUR_STEPS.length}</div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={onComplete} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
              Пропустити
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 flex items-center gap-2">
              {currentStep === TOUR_STEPS.length - 1 ? 'Завершити' : 'Далі'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
