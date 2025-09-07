import { useState } from 'react';
import { authApi } from '../services';
import { useAuth as useAuthContext } from '../context';
import { LoginFormData, VerificationFormData } from '../types';
import { getErrorMessage } from '../utils';

export const useAuthFlow = () => {
  const { login } = useAuthContext();
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEphemeralAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.getEphemeralAccount();
      setTempToken(response.token);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: LoginFormData) => {
    if (!tempToken) {
      setError('No temporary token available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await authApi.register(formData, tempToken);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (formData: VerificationFormData) => {
    if (!tempToken) {
      setError('No temporary token available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.verify(formData, tempToken);
      await login(response.token);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const resetFlow = () => {
    setTempToken(null);
    setError(null);
    setLoading(false);
  };

  return {
    tempToken,
    loading,
    error,
    getEphemeralAccount,
    register,
    verify,
    clearError,
    resetFlow,
  };
};