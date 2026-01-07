export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt?: string;
  // Onboarding data
  name?: string;
  age?: number;
  bio?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
