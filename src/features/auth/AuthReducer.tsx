  
export interface User { 
  id: string; 
  email: string; 
  name: string; 
} 
  
export interface AuthState { 
  user: User | null; 
  token: string | null;  
  loading: boolean; 
  error: string | null; 
} 
  
export type AuthAction = 
  | { type: 'LOGIN_START' } 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } } 
  | { type: 'LOGIN_FAILURE'; payload: string } 
  | { type: 'LOGOUT' }; 
  
export const initialState: AuthState = { 
  user: null, 
  token: null,
  loading: false, 
  error: null 
}; 
  
export function authReducer(state: AuthState, action: AuthAction): AuthState { 
  switch (action.type) { 
    case 'LOGIN_START': 
      return { user: null, token: null, loading: true, error: null }; 
    case 'LOGIN_SUCCESS': 
      return { user: action.payload.user, token: action.payload.token, loading: false, error: null }; 
    case 'LOGIN_FAILURE': 
      return { user: null, token: null,   loading: false, error: action.payload }; 
    case 'LOGOUT': 
      return initialState; 
    default: 
      return state; 
  } 
} 