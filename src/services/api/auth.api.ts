import { apiClient } from './client';
import { API_ENDPOINTS } from '../../constants';
import { 
  EphemeralAccountResponse, 
  LoginFormData, 
  VerificationFormData, 
  VerificationResponse 
} from '../../types';

export const authApi = {
  async getEphemeralAccount(): Promise<EphemeralAccountResponse> {
    return apiClient.get<EphemeralAccountResponse>(API_ENDPOINTS.NEW_EPHEMERAL_ACCOUNT);
  },

  async register(data: LoginFormData, token: string): Promise<void> {
    return apiClient.post(
      API_ENDPOINTS.REGISTER,
      { email: data.email },
      { Authorization: `Bearer ${token}` }
    );
  },

  async verify(data: VerificationFormData, token: string): Promise<VerificationResponse> {
    return apiClient.post<VerificationResponse>(
      API_ENDPOINTS.VERIFY,
      { code: data.code, email: data.email },
      { Authorization: `Bearer ${token}` }
    );
  },
};