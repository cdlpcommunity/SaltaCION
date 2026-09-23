import { useState, useEffect, useCallback } from 'react';
import { supabase, usernameToFakeEmail, extractUsername, type AuthUser } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession()
      .then(({ data }) => {
        if (!mounted) return;
        if (data.session?.user) {
          const email = data.session.user.email ?? '';
          setUser({ id: data.session.user.id, username: extractUsername(email) });
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email ?? '';
        setUser({ id: session.user.id, username: extractUsername(email) });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (username: string, password: string) => {
    try {
      const email = usernameToFakeEmail(username);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: formatAuthError(error.message) };
      if (data.user) {
        setUser({ id: data.user.id, username });
      }
      return { error: null };
    } catch {
      return { error: 'No se pudo conectar con el servicio. Comprueba tu conexión e inténtalo de nuevo.' };
    }
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    try {
      const email = usernameToFakeEmail(username);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: formatAuthError(error.message) };
      if (data.user) {
        setUser({ id: data.user.id, username });
      }
      return { error: null };
    } catch {
      return { error: 'No se pudo conectar con el servicio. Comprueba tu conexión e inténtalo de nuevo.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return { user, loading, signUp, signIn, signOut };
}

function formatAuthError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('invalid login credentials')) return 'El usuario o la contraseña no son correctos.';
  if (normalized.includes('user already registered')) return 'Ese nombre de usuario ya está registrado.';
  if (normalized.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (normalized.includes('email not confirmed')) return 'La cuenta todavía no está confirmada.';
  if (normalized.includes('failed to fetch') || normalized.includes('network')) {
    return 'No se pudo conectar con el servicio. Comprueba tu conexión e inténtalo de nuevo.';
  }
  return message;
}
