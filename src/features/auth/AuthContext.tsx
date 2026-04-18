import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authReducer, initialState } from './AuthReducer';
import type { AuthState, AuthAction } from './AuthReducer';
import { setAuthToken } from '../../api/axios';

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    setAuthToken(state.token ?? null);
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}