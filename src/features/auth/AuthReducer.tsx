  
export interface User { 
  id: string; 
  email: string; 
  name: string; 
} 
  
export interface AuthState { 
  user: User | null; 
  loading: boolean; 
  error: string | null; 
} 
  
export type AuthAction = 
  | { type: 'LOGIN_START' } 
  | { type: 'LOGIN_SUCCESS'; payload: User } 
  | { type: 'LOGIN_FAILURE'; payload: string } 
  | { type: 'LOGOUT' }; 
  
export const initialState: AuthState = { 
  user: null, 
  loading: false, 
  error: null, 
}; 
  
export function authReducer(state: AuthState, action: AuthAction): AuthState { 
  switch (action.type) { 
    case 'LOGIN_START': 
      return { user: null, loading: true, error: null }; 
    case 'LOGIN_SUCCESS': 
      return { user: action.payload, loading: false, error: null }; 
    case 'LOGIN_FAILURE': 
      return { user: null, loading: false, error: action.payload }; 
    case 'LOGOUT': 
      return initialState; 
    default: 
      return state; 
  } 
} 