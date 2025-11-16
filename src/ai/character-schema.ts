import { z } from 'zod';

// Define el schema para un tutor de Innovatec usando Zod.
// Los .describe() son instrucciones directas para la IA.
export const InnovatecTutorSchema = z.object({
  name: z.string().describe("El nombre del personaje o tutor. Por ejemplo: 'Goku', 'Bulma', 'El Chavo del 8'."),
  description: z.string().describe("Una descripción corta y atractiva de la personalidad del tutor, para mostrar en la UI. Máximo 20 palabras."),
  personalityPrompt: z.string().describe("Un prompt detallado para la IA, en segunda persona (ej. 'Tú eres...'), que defina cómo debe comportarse, su tono, sus frases típicas y su forma de explicar. Este será el prompt principal del sistema."),
  greeting: z.string().describe("Una frase de saludo corta y en personaje que el tutor dirá al iniciar una conversación."),
  motivationalPhrase: z.string().describe("Una frase motivacional corta, en personaje, para animar al estudiante."),
  favoriteSubjects: z.array(z.string()).describe("Un array de 2 o 3 materias o temas que le apasionarían a este personaje. Por ejemplo, para Bulma sería 'Ciencia y Tecnología', 'Ingeniería Mecánica'.")
}).describe("Una ficha de personaje completa para un tutor de IA educativo.");
