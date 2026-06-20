// types/auth.ts

export interface User {
    id: number;        
    fullname: string;  
    email: string;     
    username?: string; 
    bio?: string;       
    image?: string;      
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}