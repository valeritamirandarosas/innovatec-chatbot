
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Crown, Loader2 } from 'lucide-react';
import type { InnovatecUser } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type LeaderboardEntry = Pick<InnovatecUser, 'alias' | 'score'>;

export function LeaderboardDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { toast } = useToast();

  const fetchLeaderboard = async () => {
    if (leaderboard.length > 0) return;
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('score', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      
      const data: LeaderboardEntry[] = querySnapshot.docs.map(doc => {
          const userData = doc.data() as InnovatecUser;
          return {
              alias: userData.alias || 'Anónimo',
              score: userData.score || 0
          }
      });

      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard from client:', error);
       toast({
        variant: 'destructive',
        title: 'Error al cargar el ranking',
        description: 'No se pudo conectar a la base de datos para obtener el ranking.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen);
        if (isOpen) {
          fetchLeaderboard();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Crown className="mr-2 h-4 w-4" />
          Ranking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tabla de Líderes</DialogTitle>
          <DialogDescription>
            Los 20 mejores estudiantes de Innovatec. ¡Sigue así!
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Alias</TableHead>
                  <TableHead className="text-right">Puntaje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{user.alias}</TableCell>
                    <TableCell className="text-right">{user.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
