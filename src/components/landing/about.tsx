'use client';

import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import React from 'react';

// Componente de video memoizado para evitar re-renderizaciones
const MemoizedVideo = React.memo(({ src }: { src: string }) => (
  <div className="relative w-full h-full flex-grow overflow-hidden rounded-t-lg">
    <iframe
      className="absolute top-1/2 left-1/2 w-full h-[177.77%] transform -translate-x-1/2 -translate-y-1/2 scale-[1.5]"
      src={src}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
));
MemoizedVideo.displayName = 'MemoizedVideo';

const teamMembers: {
  name: string;
  role: string;
  image: string;
}[] = [
  {
    name: 'Andrés Berríos',
    role: 'Creador',
    image: '/images/andres.jpg',
  },
  {
    name: 'Fernanda Peducase',
    role: 'Creadora',
    image: '/images/fernanda.jpg',
  },
  {
    name: 'Esperanza',
    role: 'Creadora',
    image: '/images/esperanza.jpg',
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
              <div className="relative w-full aspect-square">
                 <Image
                    src={member.image}
                    alt={`Foto de ${member.name}`}
                    fill
                    className="object-cover"
                 />
              </div>
              <div className="p-6 flex-shrink-0">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
