
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Character, Mode } from '@/lib/types';
import { CHARACTER_VALUES, MODES, GRADES, AI_MODELS } from '@/lib/constants';

type SetupPanelProps = {
  character: Character;
  setCharacter: (c: Character) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  subject: string;
  setSubject: (s: string) => void;
  grade: number;
  setGrade: (g: number) => void;
  aiModel: string;
  setAiModel: (m: string) => void;
  onGenerateContent: () => void;
  isGenerating: boolean;
};

export function SetupPanel({
  character,
  setCharacter,
  mode,
  setMode,
  subject,
  setSubject,
  grade,
  setGrade,
  aiModel,
  setAiModel,
  onGenerateContent,
  isGenerating,
}: SetupPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Estudio</CardTitle>
        <CardDescription>
          Personaliza tu sesión para empezar a aprender.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="character-select">Personaje</Label>
          <Select
            value={character}
            onValueChange={v => setCharacter(v as Character)}
          >
            <SelectTrigger id="character-select">
              <SelectValue placeholder="Elige un personaje" />
            </SelectTrigger>
            <SelectContent>
              {CHARACTER_VALUES.map(c => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label} - {c.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode-select">Modo</Label>
          <Select value={mode} onValueChange={v => setMode(v as Mode)}>
            <SelectTrigger id="mode-select">
              <SelectValue placeholder="Elige un modo" />
            </SelectTrigger>
            <SelectContent>
              {MODES.map(m => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label} - {m.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade-select">Grado</Label>
          <Select
            value={String(grade)}
            onValueChange={v => setGrade(Number(v))}
          >
            <SelectTrigger id="grade-select">
              <SelectValue placeholder="Elige un grado" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map(g => (
                <SelectItem key={g.value} value={String(g.value)}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject-input">Materia</Label>
          <Input
            id="subject-input"
            placeholder="Ej: Reacciones Químicas"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model-select">Modelo de IA</Label>
          <Select value={aiModel} onValueChange={setAiModel}>
            <SelectTrigger id="model-select">
              <SelectValue placeholder="Elige un modelo" />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map(m => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full"
          onClick={onGenerateContent}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Asistente de Contenido
        </Button>
      </CardContent>
    </Card>
  );
}
