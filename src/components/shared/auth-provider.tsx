'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';
import { User } from '@/lib/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch the full public profile
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (data) {
          setAuth(data as User);
        } else {
          setAuth(null);
        }
      } else {
        setAuth(null);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data) {
          setAuth(data as User);
        } else {
          setAuth(null);
        }
      } else {
        setAuth(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth]);

  return <>{children}</>;
}
