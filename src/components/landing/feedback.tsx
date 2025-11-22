'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/firebase/client-provider';

const feedbackSchema = z.object({
  email: z.string().email({ message: 'Email no válido.' }).optional().or(z.literal('')),
  category: z.string({ required_error: 'Por favor, elige una categoría.' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
});

export function Feedback() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    setLoading(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        ...values,
        uid: user?.uid,
        createdAt: serverTimestamp(),
        status: 'new',
      });

      toast({
        title: '¡Gracias por tus comentarios!',
        description: 'Hemos recibido tu mensaje y lo revisaremos pronto.',
      });
      form.reset();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: 'destructive',
        title: 'Error al enviar',
        description: 'No se pudo enviar tu mensaje. Inténtalo de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="feedback" className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Envíanos tu Feedback
        </h2>
        <p className="mt-4 text-muted-foreground">
          Tu opinión nos ayuda a mejorar.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="tu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="idea">Sugerencia / Idea</SelectItem>
                    <SelectItem value="bug">Reportar un Error</SelectItem>
                    <SelectItem value="content">
                      Problema con el Contenido
                    </SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensaje</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cuéntanos qué piensas..."
                    className="resize-none"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-center">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Mensaje
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
