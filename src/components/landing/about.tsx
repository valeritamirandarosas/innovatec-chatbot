
'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PlayCircle } from 'lucide-react';

const videoPlaceholder = PlaceHolderImages.find(p => p.id === 'video-thumbnail');
const teamMembers = [
  {
    name: 'Andrés Berríos',
    role: 'Creador',
    image: null, // Se reemplaza por el video
    videoUrl: 'https://www.youtube.com/embed/OiYKfTeUwW0?autoplay=1&loop=1&mute=1&playsinline=1&rel=0&playlist=OiYKfTeUwW0&controls=0&showinfo=0'
  },
  {
    name: 'Carlos Rivas',
    role: 'Ingeniero de IA',
    quote: 'La inteligencia artificial es la nueva tiza del siglo XXI.',
    image: PlaceHolderImages.find(p => p.id === 'team-member-2'),
  },
  {
    name: 'Sofía Mendoza',
    role: 'Diseñadora de Experiencia',
    quote: 'Creamos caminos de aprendizaje que inspiran curiosidad.',
    image: PlaceHolderImages.find(p => p.id === 'team-member-3'),
  },
];

export function About() {
  return (
    <section id="about" className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Quiénes Somos
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Un equipo apasionado por fusionar la tecnología y la educación para
          crear experiencias de aprendizaje inolvidables.
        </p>
      </div>

      <div className="aspect-video w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-2xl">
        <iframe
          className="w-full h-full object-cover"
          src="https://www.youtube.com/embed/3du1e6dtr90?autoplay=1&loop=1&mute=1&playsinline=1&rel=0&playlist=3du1e6dtr90&controls=0&showinfo=0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {teamMembers.map((member, index) => (
          <Card key={index} className="text-center overflow-hidden">
            <CardContent className="p-0 flex flex-col h-full">
              {member.videoUrl ? (
                <div className="relative w-full h-48 overflow-hidden">
                  <iframe
                    className="absolute top-1/2 left-1/2 w-[177.77%] h-full min-h-[100%] min-w-[177.77vh] transform -translate-x-1/2 -translate-y-1/2 scale-[0.8]"
                    src={member.videoUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : member.image && (
                <div className="flex justify-center pt-6">
                   <Image
                      src={member.image.imageUrl}
                      alt={`Foto de ${member.name}`}
                      data-ai-hint={member.image.imageHint}
                      width={120}
                      height={120}
                      className="mx-auto mb-4 rounded-full"
                   />
                </div>
              )}
              <div className="p-6 flex-grow">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                {member.quote && (
                    <p className="mt-2 text-muted-foreground italic">
                        &ldquo;{member.quote}&rdquo;
                    </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
