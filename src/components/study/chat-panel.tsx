
'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { SendHorizonal, Volume2, X, Bot, User, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../auth-context';
import type { Mode, InnovatecTutor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useTTS } from '@/hooks/use-tts';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatPanelProps = {
  character: InnovatecTutor | null;
  characterLoading: boolean;
  mode: Mode;
  subject: string;
  setSubject: (subject: string) => void;
  grade: number;
  aiModel: string;
};

export type ChatPanelRef = {
  sendMessage: (message: string) => void;
};

const ChatPanelComponent = forwardRef<ChatPanelRef, ChatPanelProps>(({
  character,
  characterLoading,
  mode,
  subject,
  setSubject,
  grade,
  aiModel,
}, ref) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isSpeaking, speak, stop } = useTTS();

  useEffect(() => {
    if (character?.greeting) {
      setMessages([{ role: 'assistant', content: character.greeting }]);
    } else {
      setMessages([]);
    }
  }, [character]);

  const handleSend = async (messageToSend?: string) => {
    const currentInput = messageToSend || input;
    if (!currentInput.trim() || !user || !character) return;
  
    const newUserMessage: Message = { role: 'user', content: currentInput };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character,
          mode,
          subject: subject || currentInput,
          grade,
          history: [...messages, newUserMessage],
          model: aiModel,
        }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) {
                throw new Error(data.details || data.error);
              }
              if (data.text) {
                fullText += data.text;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { role: 'assistant', content: fullText };
                  return newMessages;
                });
              }
              if (data.done) {
                 // The stream is finished, no special action needed here as the fullText is already updated.
              }
            } catch (e) {
              console.error('Error parsing SSE chunk:', e);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error in chat flow:", error);
      toast({
        variant: 'destructive',
        title: 'Error en el chat',
        description: error.message || 'No se pudo obtener una respuesta. Inténtalo de nuevo.',
      });
      setMessages(prev => prev.slice(0, -2));
      setInput(currentInput);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => {
      handleSend(message);
    }
  }));

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleTTS = (text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  }

  const isUIReady = !characterLoading && character;
  const isChatDisabled = loading || !isUIReady;

  return (
    <Card className="flex h-[70vh] flex-col">
      <CardHeader>
        <CardTitle>
            Chat de Estudio {character && `con ${character.name}`}
        </CardTitle>
        <CardDescription>
          Habla con tu tutor de IA. Si no pones materia, tu primer mensaje será el tema.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {!isUIReady && (
                <div className="text-center text-muted-foreground pt-16 flex flex-col items-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin mb-4" />
                    <p>Cargando personaje...</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                     {character?.imageUrl && <AvatarImage src={character.imageUrl} alt={character.name}/>}
                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {loading && index === messages.length -1 && message.content === '' ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Pensando...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  )}
                   {message.role === 'assistant' && message.content && (
                     <Button variant="ghost" size="icon" className="h-7 w-7 mt-2" onClick={() => handleTTS(message.content!)}>
                       {isSpeaking ? <X className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                     </Button>
                   )}
                </div>
                {message.role === 'user' && user && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback><User size={20}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder={isUIReady ? 'Escribe tu pregunta...' : 'Esperando al personaje...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            disabled={isChatDisabled}
          />
          <Button onClick={() => handleSend()} disabled={isChatDisabled || !input.trim()}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});

ChatPanelComponent.displayName = 'ChatPanel';

export const ChatPanel = ChatPanelComponent;
