export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginFormData {
  email: string;
}

export interface VerificationFormData {
  code: string;
  email: string;
}

export interface EphemeralAccountResponse {
  token: string;
}

export interface VerificationResponse {
  token: string;
}

export interface AuthError {
  message: string;
  code?: string;
}