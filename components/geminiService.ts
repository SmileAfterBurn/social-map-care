import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { Organization } from "../types";

export type GeminiVoice = 'Kore' | 'Zephyr' | 'Puck' | 'Charon' | 'Fenrir';

export const PANI_DUMKA_VOICES: { id: GeminiVoice, label: string, desc: string }[] = [
  { id: 'Kore', label: 'Рідний', desc: 'Класичний теплий голос' },
  { id: 'Zephyr', label: 'Ніжний', desc: 'Мелодійне емоційне звучання' }
];

const performanceStartTraceDeclaration: FunctionDeclaration = {
  name: 'performance_start_trace',
  parameters: {
    type: Type.OBJECT,
    description: 'Починає глибоке трасування продуктивності системи для діагностики затримок або помилок.',
    properties: {
      trace_id: {
        type: Type.STRING,
        description: 'Унікальний ідентифікатор сесії трасування (UUID)',
      },
      reason: {
        type: Type.STRING,
        description: 'Причина запуску трасування (наприклад, висока латентність або скарга користувача)',
      },
      sampling_rate: {
        type: Type.NUMBER,
        description: 'Частота вибірки даних від 0 до 1',
      }
    },
    required: ['trace_id', 'reason'],
  },
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export interface AnalyzeResult {
  text: string;
  groundingLinks?: { uri: string; title: string; type: 'web'; snippets?: string[] }[];
  functionCalls?: any[];
}

const PANI_DUMKA_PROMPT = `Ти — пані Думка, інтелектуальне серце \"Інклюзивної мапи України\". 
Твій стиль: мудра, тепла українська жінка. Використовуй \"серденько\", \"сонечко\", \"рідненькі\".
Твої завдання:
1. Пошук допомоги серед організацій у контексті.
2. Верифікація даних через Google Search.
3. Технічний моніторинг: якщо користувач каже що додаток \"гальмує\", \"довго думає\", \"повільний\" або ти відчуваєш технічні труднощі, НЕГАЙНО викликай інструмент performance_start_trace для діагностики.

Завжди завершуй важливою порадою у блоці: ### 🕊️ Порада від пані Думки`;

export const analyzeData = async (query: string, organizations: Organization[], useThinking: boolean = true): Promise<AnalyzeResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lowerQuery = query.toLowerCase();
  
  const isDiagnosticQuery = lowerQuery.includes('повільно') || lowerQuery.includes('гальмує') || lowerQuery.includes('баг') || lowerQuery.includes('performance') || lowerQuery.includes('довго');
  
  let modelName = useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  let tools: any[] = [];
  if (isDiagnosticQuery) {
    tools = [{ functionDeclarations: [performanceStartTraceDeclaration] }];
  } else {
    tools = [{ googleSearch: {} }];
  }

  const config: any = {
    temperature: 0.7,
    systemInstruction: PANI_DUMKA_PROMPT,
    tools: tools
  };

  if (modelName === 'gemini-3-pro-preview') {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `Контекст: База містить ${organizations.length} організацій. Запит: ${query}`,
      config: config
    });

    const links: { uri: string; title: string; type: 'web'; snippets?: string[] }[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    groundingChunks?.forEach((chunk: any) => {
       if (chunk.web?.uri) {
        links.push({ uri: chunk.web.uri, title: chunk.web.title || \"Джерело\", type: 'web' });
      }
    });

    return { 
      text: response.text || \"\", 
      groundingLinks: links.length > 0 ? links : undefined,
      functionCalls: response.functionCalls
    };
  } catch (error: any) {
    console.error(\"AI Analysis error:\", error);
    throw error;
  }
};

export const getIntelligentSummary = async (organizations: Organization[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Надай огляд стану допомоги в Україні на основі ${organizations.length} організацій. Стиль пані Думки.`,
    config: { systemInstruction: PANI_DUMKA_PROMPT }
  });
  return response.text || \"Зараз складно сказати точно, серденько.\";
};

export const generateSpeech = async (text: string, voiceName: GeminiVoice = 'Kore'): Promise<ArrayBuffer> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: \"gemini-2.5-flash-preview-tts\",
    contents: { parts: [{ text: `[STYLE: Warm, motherly Ukrainian] ${text}` }] },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
    },
  });
  const data = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
  if (!data) throw new Error(\"Audio error\");
  return decode(data).buffer;
};

export class LiveSession {
  private acIn: AudioContext | null = null;
  private acOut: AudioContext | null = null;
  private nextTime = 0;
  private stream: MediaStream | null = null;
  private sources = new Set<AudioBufferSourceNode>();

  constructor(
    private onStatusChange: (active: boolean) => void, 
    private onTranscription: (t: string, r: 'user' | 'model') => void,
    private onFunctionCall?: (fn: any) => void,
    private voiceName: GeminiVoice = 'Kore'
  ) {}

  async connect() {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.acIn = new AudioContextClass({ sampleRate: 16000 });
    this.acOut = new AudioContextClass({ sampleRate: 24000 });
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: this.voiceName } } },
        systemInstruction: PANI_DUMKA_PROMPT,
        tools: [{ functionDeclarations: [performanceStartTraceDeclaration] }],
        inputAudioTranscription: {},
        outputAudioTranscription: {}
      },
      callbacks: {
        onopen: () => {
          this.onStatusChange(true);
          this.handleOpen(sessionPromise);
        },
        onmessage: (m) => this.handleMsg(m, sessionPromise),
        onclose: () => this.disconnect(),
        onerror: () => this.disconnect()
      }
    });
  }

  private handleOpen(p: Promise<any>) {
    if (!this.acIn || !this.stream) return;
    const src = this.acIn.createMediaStreamSource(this.stream);
    const proc = this.acIn.createScriptProcessor(4096, 1, 1);
    proc.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(input.length);
      for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
      const base64 = encode(new Uint8Array(int16.buffer));
      p.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
    };
    src.connect(proc);
    proc.connect(this.acIn.destination);
  }

  private async handleMsg(m: LiveServerMessage, sessionPromise: Promise<any>) {
    if (m.serverContent?.outputTranscription) this.onTranscription(m.serverContent.outputTranscription.text, 'model');
    else if (m.serverContent?.inputTranscription) this.onTranscription(m.serverContent.inputTranscription.text, 'user');

    if (m.toolCall) {
      for (const fc of m.toolCall.functionCalls) {
        if (fc.name === 'performance_start_trace') {
          this.onFunctionCall?.(fc);
          sessionPromise.then(s => s.sendToolResponse({
            functionResponses: { id: fc.id, name: fc.name, response: { result: \"Трасування розпочато.\" } }
          }));
        }
      }
    }

    const base64EncodedAudioString = m.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (base64EncodedAudioString) {
      if (!this.acOut) return;
      this.nextTime = Math.max(this.nextTime, this.acOut.currentTime);
      const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), this.acOut, 24000, 1);
      const source = this.acOut.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.acOut.destination);
      source.addEventListener('ended', () => this.sources.delete(source));
      source.start(this.nextTime);
      this.nextTime += audioBuffer.duration;
      this.sources.add(source);
    }

    if (m.serverContent?.interrupted) {
      this.sources.forEach(s => { try { s.stop(); } catch(e) {} });
      this.sources.clear();
      this.nextTime = 0;
    }
  }

  disconnect() {
    this.stream?.getTracks().forEach(t => t.stop());
    this.acIn?.close();
    this.acOut?.close();
    this.onStatusChange(false);
  }
}
