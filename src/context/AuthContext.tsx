'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { User, Tenant } from '@/lib/types';
import { mockTenants, mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  currentUser: User | null;
  currentTenant: Tenant | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  // Switch the active user (simulates login — will be replaced with real auth later)
  switchUser: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentTenant: null,
  isAdmin: false,
  isAuthenticated: false,
  switchUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to the first user for demo purposes.
  // When real auth is added, this will start as null and be set after login.
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0] ?? null);

  const currentTenant = currentUser
    ? mockTenants.find(t => t.id === currentUser.tenantId) ?? null
    : null;

  const switchUser = useCallback((userId: string) => {
    const user = mockUsers.find(u => u.id === userId) ?? null;
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    // When real auth is wired up, this would redirect to a login page
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTenant,
        isAdmin: currentUser?.role === 'admin',
        isAuthenticated: currentUser !== null,
        switchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
