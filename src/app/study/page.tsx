
'use client';

import { useState, useEffect, useCallback } from 'react';
import { SetupPanel } from '@/components/study/setup-panel';
import { StatsPanel } from '@/components/study/stats-panel';
import { ChatPanel, type ChatPanelRef } from '@/components/study/chat-panel';
import { useAuth } from '@/components/auth-context';
import type { Bundle, Character, Mode, InnovatecUser, InnovatecTutor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AtomIcon } from 'lucide-react';
import { BundleDisplay } from '@/components/study/bundle-display';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { CircuitBoardIcon, CogIcon, SqrtIcon } from '@/components/icons';
import { characters } from '@/lib/characters';
import { GRADES, AI_MODELS } from '@/lib/constants';
import React from 'react';
import Image from 'next/image';

// Helper to check dates without considering time
const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

export default function StudyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const chatPanelRef = React.useRef<ChatPanelRef>(null);

  const [innovatecUser, setInnovatecUser] = useState<InnovatecUser | null>(null);
  
  const [profileLoading, setProfileLoading] = useState(true);

  const [character, setCharacter] = useState<Character>('goku');
  const [characterData, setCharacterData] = useState<InnovatecTutor | null>(null);
  const [characterLoading, setCharacterLoading] = useState(false);

  const [mode, setMode] = useState<Mode>('dudas');
  const [subject, setSubject] = useState<string>('');
  const [grade, setGrade] = useState<number>(GRADES[0].value);
  const [aiModel, setAiModel] = useState<string>(AI_MODELS[0].value);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBundle, setGeneratedBundle] = useState<Bundle | null>(null);

  // Load character data statically instead of fetching from API
  useEffect(() => {
    setCharacterLoading(true);
    const data = characters[character];
    if (data) {
        setCharacterData(data);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error cargando personaje',
            description: 'El personaje seleccionado no existe.'
        });
        setCharacterData(null);
    }
    setCharacterLoading(false);
  }, [character, toast]);


  const refreshUserStats = useCallback(async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
          const docData = userDoc.data();
          // Convert Firestore Timestamps to JS Dates for React state
          const userDataWithDates: InnovatecUser = {
              ...(docData as InnovatecUser),
              createdAt: (docData.createdAt as Timestamp)?.toDate(),
              updatedAt: (docData.updatedAt as Timestamp)?.toDate(),
              lastActive: (docData.lastActive as Timestamp)?.toDate(),
          };
          setInnovatecUser(prev => ({
              ...(prev || {}),
              ...userDataWithDates,
          }));
      }
    } catch (error) {
      console.warn("Could not refresh user stats:", error);
    }
  }, [user]);

  const getUserProfile = useCallback(async (uid: string, displayName: string | null, email: string | null) => {
    const userRef = doc(db, 'users', uid);
    try {
      const userDoc = await getDoc(userRef);
      const today = new Date();

      if (!userDoc.exists()) {
        const newUserPayload: Omit<InnovatecUser, 'createdAt' | 'updatedAt' | 'lastActive'> & { createdAt: any, updatedAt: any, lastActive: any } = {
          uid,
          displayName: displayName || 'Estudiante',
          email: email!,
          alias: displayName?.split(' ')[0] || 'Estudiante',
          score: 0,
          streak: 1,
          minutesStudied: 0,
          quizzesPassed: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastActive: serverTimestamp(),
        };
        await setDoc(userRef, newUserPayload);

        const newUserForState: InnovatecUser = {
            ...newUserPayload,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastActive: new Date(),
        };
        setInnovatecUser(newUserForState);

      } else {
        const userData = userDoc.data() as InnovatecUser;
        const updates: any = { lastActive: serverTimestamp(), updatedAt: serverTimestamp() };

        const lastActiveDate = userData.lastActive instanceof Timestamp ? userData.lastActive.toDate() : new Date(userData.lastActive);
        
        if (lastActiveDate && !isSameDay(lastActiveDate, today)) {
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);
          
          if (isSameDay(lastActiveDate, yesterday)) {
            updates.streak = increment(1);
          } else {
            updates.streak = 1; // Reset streak if they missed a day
          }
        } else if (!lastActiveDate || !userData.streak) {
          updates.streak = 1;
        }

        await updateDoc(userRef, updates);
        
        const updatedUserDoc = await getDoc(userRef);
        const updatedData = updatedUserDoc.data() as InnovatecUser;
        const userDataWithDates: InnovatecUser = {
            ...updatedData,
            createdAt: (updatedData.createdAt as Timestamp)?.toDate(),
            updatedAt: (updatedData.updatedAt as Timestamp)?.toDate(),
            lastActive: (updatedData.lastActive as Timestamp)?.toDate(),
        };
        setInnovatecUser(userDataWithDates);
      }
    } catch (error: any) {
      console.warn("Error fetching/creating user profile:", error);
      toast({
        variant: 'destructive',
        title: 'Error de Perfil',
        description: 'No se pudo cargar tu perfil de usuario.'
      });
    } finally {
        setProfileLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (authLoading) {
      return; 
    }
    if (!user) {
      router.push('/login');
      return;
    }
    getUserProfile(user.uid, user.displayName, user.email);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);
  
  useEffect(() => {
    if (user && innovatecUser) {
      const timer = setInterval(async () => {
        try {
          const userRef = doc(db, 'users', user.uid);
          
          const newMinutes = 5;
          const currentStreak = innovatecUser.streak > 0 ? innovatecUser.streak : 1;
          const scoreIncrement = currentStreak * 2 + newMinutes;

          await updateDoc(userRef, {
            minutesStudied: increment(newMinutes),
            score: increment(scoreIncrement),
            updatedAt: serverTimestamp(),
          });
          
          refreshUserStats();

        } catch (e) {
          console.warn("Could not update user stats (background task):", e);
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(timer);
    }
  }, [user, innovatecUser, refreshUserStats]);

  const handleGenerateContent = async () => {
    if (!chatPanelRef.current) return;
  
    let promptText = '';
    const subjectText = subject ? ` sobre ${subject}` : '';
  
    switch (mode) {
      case 'dudas':
        // If there's a subject, use it as the prompt. Otherwise, do nothing and let the user type.
        if (subject) {
          promptText = subject;
        } else {
          toast({
            title: 'Escribe un tema',
            description: 'Por favor, introduce un tema en el campo "Materia" para resolver tu duda.',
          });
          return;
        }
        break;
      case 'plan':
        promptText = `Crea un plan de estudio${subjectText}.`;
        break;
      case 'plan_creativo':
        promptText = `Crea un plan de estudio creativo${subjectText}.`;
        break;
      case 'examen':
        promptText = `Genera un examen${subjectText}.`;
        break;
      case 'flashcards':
        promptText = `Crea algunas flashcards${subjectText}.`;
        break;
      default:
        toast({
          variant: 'destructive',
          title: 'Modo no reconocido',
          description: 'Por favor, selecciona un modo válido.',
        });
        return;
    }
  
    // Call the chat panel function to send the message
    chatPanelRef.current.sendMessage(promptText);
  };
  
  if (authLoading || profileLoading) {
    return <div className="flex h-full min-h-[calc(100vh-10rem)] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <StatsPanel user={innovatecUser} />
            <SetupPanel
              character={character}
              setCharacter={setCharacter}
              mode={mode}
              setMode={setMode}
              subject={subject}
              setSubject={setSubject}
              grade={grade}
              setGrade={setGrade}
              aiModel={aiModel}
              setAiModel={setAiModel}
              onGenerateContent={handleGenerateContent}
              isGenerating={isGenerating || characterLoading}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <ChatPanel
              ref={chatPanelRef}
              character={characterData}
              characterLoading={characterLoading}
              mode={mode}
              subject={subject}
              setSubject={setSubject}
              grade={grade}
              aiModel={aiModel}
            />
            {isGenerating && (
              <div className="flex items-center justify-center rounded-lg border bg-card p-8 text-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <p className="text-muted-foreground">Generando tu paquete de estudio... esto puede tardar un momento.</p>
              </div>
            )}
            {generatedBundle && <BundleDisplay bundle={generatedBundle} />}

            <footer className="py-8 mt-6 border-t border-border">
              <div className="container mx-auto flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d9534f]">
                    <AtomIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f0ad4e]">
                    <CircuitBoardIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#5cb85c]">
                    <CogIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0275d8]">
                    <SqrtIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="text-xl font-bold tracking-wider text-foreground">INNOVATEC-COSABE</p>
                <p className="text-sm text-muted-foreground">&copy; 2025 Innovatec. Todos los derechos reservados.</p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
