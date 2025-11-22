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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { GoogleIcon } from './icons';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export function AuthForm({ mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const authFn =
        mode === 'login'
          ? signInWithEmailAndPassword
          : createUserWithEmailAndPassword;
      await authFn(auth, values.email, values.password);
      router.push('/study');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description:
          error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password'
            ? 'Credenciales incorrectas. Por favor, inténtalo de nuevo.'
            : error.code === 'auth/email-already-in-use'
            ? 'Este correo ya está registrado. Por favor, inicia sesión.'
            : 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
      });
    } finally {
        setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      await signInWithPopup(auth, provider);
      router.push('/study');
    } catch (error: any) {
        console.error("Google Sign-In Popup Error:", error);
        let description = 'No se pudo completar el inicio de sesión con Google.';
        if (error.code === 'auth/popup-closed-by-user') {
            description = 'Has cerrado la ventana de inicio de sesión. Inténtalo de nuevo.';
        } else if (error.code === 'auth/cancelled-popup-request') {
            description = 'Se ha cancelado la solicitud. Por favor, solo ten una ventana de inicio de sesión abierta.';
        } else if (error.code === 'auth/invalid-continue-uri') {
            description = 'La configuración de dominios no es correcta. Contacta a soporte.';
        } else if (error.code === 'auth/api-key-not-valid') {
            description = 'La clave de API de Firebase no es válida. Revisa la configuración.';
        } else if (error.code === 'auth/configuration-not-found') {
            description = 'La configuración de Firebase no se encontró. Revisa la inicialización.';
        }
        
        toast({
            variant: 'destructive',
            title: 'Error con Google',
            description: description,
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <GoogleIcon className="mr-2 h-4 w-4" />
        Continuar con Google
      </Button>
      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          O CONTINUAR CON
        </span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="tu@email.com"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
