'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '../ui/badge';
import type { Bundle } from '@/lib/types';
import { Button } from '../ui/button';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

type BundleDisplayProps = {
  bundle: Bundle;
};

function QuizComponent({ quiz }: { quiz: Bundle['quiz'] }) {
  const [answers, setAnswers] = useState<(number | undefined)[]>(
    Array(quiz.questions.length).fill(undefined)
  );
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (qIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  const getResultClasses = (qIndex: number, optionIndex: number) => {
    if (!showResults) return '';
    const isCorrect = quiz.questions[qIndex].correctIndex === optionIndex;
    const isSelected = answers[qIndex] === optionIndex;

    if (isCorrect) return 'bg-green-500/20 border-green-500';
    if (isSelected && !isCorrect) return 'bg-red-500/20 border-red-500';
    return '';
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{quiz.title}</h3>
      {quiz.time_suggestion_minutes && (
        <Badge variant="secondary">Tiempo sugerido: {quiz.time_suggestion_minutes} min</Badge>
      )}
      <div className="space-y-8">
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex}>
            <p className="font-medium mb-4">{qIndex + 1}. {q.q}</p>
            <RadioGroup onValueChange={(val) => handleAnswerChange(qIndex, Number(val))} disabled={showResults}>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className={cn("flex items-center space-x-2 p-2 rounded-md border transition-colors", getResultClasses(qIndex, oIndex))}>
                  <RadioGroupItem value={String(oIndex)} id={`q${qIndex}o${oIndex}`} />
                  <Label htmlFor={`q${qIndex}o${oIndex}`}>{opt}</Label>
                </div>
              ))}
            </RadioGroup>
            {showResults && answers[qIndex] !== quiz.questions[qIndex].correctIndex && (
                 <div className="mt-2 text-sm p-2 rounded-md bg-muted">
                    <p><span className="font-bold">Explicación:</span> {q.explain}</p>
                </div>
            )}
          </div>
        ))}
      </div>
       <div className="flex gap-4 mt-6">
        <Button onClick={() => setShowResults(true)} disabled={showResults}>Revisar Respuestas</Button>
        <Button variant="outline" onClick={() => { setShowResults(false); setAnswers(Array(quiz.questions.length).fill(undefined)); }}>Intentar de Nuevo</Button>
      </div>
    </div>
  );
}


export function BundleDisplay({ bundle }: BundleDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu Paquete de Estudio Personalizado</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plan">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plan">Plan de Estudio</TabsTrigger>
            <TabsTrigger value="quiz">Examen</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          </TabsList>
          <TabsContent value="plan" className="pt-4">
            <Accordion type="single" collapsible className="w-full">
              {bundle.plan.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc space-y-2 pl-6">
                      {item.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          <TabsContent value="quiz" className="pt-4">
            <QuizComponent quiz={bundle.quiz} />
          </TabsContent>
          <TabsContent value="flashcards" className="pt-4">
            <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent>
                {bundle.flashcards.map((flashcard, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="group h-64 [perspective:1000px]">
                        <div className="relative h-full w-full rounded-lg shadow-md transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                           <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-card p-6 [backface-visibility:hidden]">
                               <p className="text-muted-foreground text-sm">Término</p>
                               <p className="text-xl font-semibold text-center">{flashcard.term}</p>
                               {flashcard.difficulty && <Badge variant="outline" className="mt-4">{flashcard.difficulty}</Badge>}
                           </div>
                           <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-secondary p-6 text-secondary-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
                               <p className="text-sm">Definición</p>
                               <p className="text-center">{flashcard.definition}</p>
                           </div>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
