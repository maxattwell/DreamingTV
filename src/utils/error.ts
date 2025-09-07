import { ApiError } from '../types';

export const createApiError = (message: string, status: number, code?: string): ApiError => ({
  message,
  status,
  code,
});

export const handleApiError = (error: any): ApiError => {
  if (error instanceof Error) {
    return createApiError(error.message, 500);
  }
  
  if (typeof error === 'string') {
    return createApiError(error, 500);
  }
  
  return createApiError('An unknown error occurred', 500);
};

export const getErrorMessage = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

export const isNetworkError = (error: any): boolean => {
  return error?.code === 'NETWORK_ERROR' || error?.message?.includes('fetch');
};