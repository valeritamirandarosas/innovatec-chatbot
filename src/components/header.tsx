'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { UserButton } from './user-button';
import { useAuth } from '@/firebase/client-provider';
import { Button } from './ui/button';

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            TeacherBot
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {!loading && (
              <>
                {user ? (
                  <UserButton />
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Registrarse</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
