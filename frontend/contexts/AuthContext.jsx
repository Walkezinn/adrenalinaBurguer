// Contexto de autenticação
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const token = localStorage.getItem('adrenalina_token');
        const storedUser = localStorage.getItem('adrenalina_user');
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        // Limpa o localStorage corrompido
        localStorage.removeItem('adrenalina_token');
        localStorage.removeItem('adrenalina_user');
      } finally {
        setLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      localStorage.setItem('adrenalina_token', data.token);
      localStorage.setItem('adrenalina_user', JSON.stringify(data.user));
      
      if (data.user.role === 'admin') router.push('/admin/orders');
      else if (data.user.role === 'entregador') router.push('/delivery/dashboard');
      else router.push('/menu');
    } catch (error) {
      console.error('Falha no login', error);
      throw error.response?.data?.message || 'Erro ao fazer login.';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adrenalina_token');
    localStorage.removeItem('adrenalina_user');
    router.push('/auth/login');
  };

  // Proteção de rotas simples
  useEffect(() => {
    if (!loading && !user && (pathname.startsWith('/admin') || pathname.startsWith('/delivery'))) {
      router.push('/auth/login');
    }
    if (!loading && user) {
        if (pathname.startsWith('/admin') && user.role !== 'admin') {
            router.push('/menu'); // ou uma página de acesso negado
        }
        if (pathname.startsWith('/delivery') && user.role !== 'entregador') {
            router.push('/menu'); // ou uma página de acesso negado
        }
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {loading ? <div className="flex justify-center items-center h-screen">Carregando...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);