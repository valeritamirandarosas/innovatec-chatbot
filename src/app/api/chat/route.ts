
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { getSystemInstruction } from '@/lib/prompts';
import type { Message, InnovatecTutor } from '@/lib/types';
import { z } from 'zod';

// Define el esquema de entrada para la validación
const RequestSchema = z.object({
  character: z.any(),
  mode: z.string(),
  subject: z.string(),
  grade: z.number(),
  model: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = RequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify({ error: 'Invalid request body', details: validation.error.format() }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { character, mode, subject, grade, model, history: simpleHistory }: {
      character: InnovatecTutor;
      mode: string;
      subject: string;
      grade: number;
      model: string;
      history: { role: 'user' | 'assistant'; content: string }[];
    } = validation.data;

    // Configura Genkit y Google AI plugin
    const ai = genkit({
      plugins: [googleAI()],
      logSink: 'stdout',
      enableTelemetry: false,
    });
    
    // Construye el historial en el formato que espera Genkit
    const history: Message[] = simpleHistory.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: [{ text: msg.content }]
    }));
    
    const lastMessage = simpleHistory[simpleHistory.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error("Invalid history: The last message must be from the user.");
    }
    
    const systemInstruction = getSystemInstruction(character, mode, subject, grade);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          const { stream: responseStream } = await ai.generateStream({
            model: `googleai/${model}`,
            system: systemInstruction,
            history: history,
            prompt: lastMessage.content,
            config: {
              safetySettings: [
                  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
              ],
            },
          });

          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));

        } catch (error: any) {
          console.error("Error during AI generation:", error);
          const errorPayload = {
            error: 'Failed to generate AI response.',
            details: error.message || 'Unknown error',
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorPayload)}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("Error in POST /api/chat:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
