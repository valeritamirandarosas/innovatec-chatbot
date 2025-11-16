import { AuthForm } from '@/components/auth-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa a tu cuenta para continuar tu aventura de aprendizaje.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm mode="login" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
