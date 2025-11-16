import { Button } from '../ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="py-20 text-center md:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          <span className="text-primary">Estudiar</span> es como maratonear tu
          serie favorita.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          ¿Alguna vez viste a tu personaje favorito enseñarte reacciones
          químicas? Con Innovatec Chatbot, el aprendizaje es entretenido, rápido
          y personalizado.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/study">Empezar a estudiar</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
