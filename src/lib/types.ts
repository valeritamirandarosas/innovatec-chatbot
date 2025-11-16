import type { Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import { InnovatecTutorSchema } from '@/ai/character-schema';
import { Content } from 'genkit/generate';

// Exporta el tipo inferido del schema de Zod
export type InnovatecTutor = z.infer<typeof InnovatecTutorSchema> & {
    imageUrl?: string;
};

// Input schema for the chat flow, validated by Zod.
export const ChatInputSchema = z.object({
  character: InnovatecTutorSchema,
  mode: z.string(),
  subject: z.string(),
  grade: z.number(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;


export type Character = 'goku' | 'bulma' | 'chavo' | 'rory' | 'generic';
export type Mode = 'dudas' | 'plan' | 'plan_creativo' | 'examen' | 'flashcards';
export type Grade = 7 | 8 | 9 | 10 | 11 | 12;

// A flexible type that can be a Firestore Timestamp when coming from the DB,
// or a JS Date object when being handled on the client-side state before being sent.
type FirestoreDate = Timestamp | Date;

export interface InnovatecUser {
  uid: string;
  displayName: string;
  email: string;
  alias: string;
  lastActive: FirestoreDate;
  streak: number;
  minutesStudied: number;
  quizzesPassed: number;
  score: number;
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
}

export interface Session {
  uid: string;
  character: Character;
  mode: Mode;
  subject: string;
  createdAt: { toDate: () => Date; };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: { toDate: () => Date; };
}

export type Message = {
    role: 'user' | 'model' | 'system' | 'tool';
    content: Content;
};


type PlanStep = {
    title: string;
    steps: string[];
}

type QuizQuestion = {
    q: string;
    options: string[];
    correctIndex: number;
    explain: string;
}

type Flashcard = {
    term: string;
    definition: string;
    difficulty?: 'fácil' | 'medio' | 'difícil';
}


export type Bundle = {
  id?: string;
  subject: string;
  grade: number;
  character: string; // Cambiado a string para ser más flexible
  createdAt: Date;
  plan: PlanStep[];
  quiz: {
      title: string;
      time_suggestion_minutes?: number;
      questions: QuizQuestion[];
  };
  flashcards: Flashcard[];
};

export interface Feedback {
  id?: string;
  uid?: string;
  email?: string;
  message: string;
  category: string;
  createdAt: { toDate: () => Date; };
  status: 'new' | 'done';
}
