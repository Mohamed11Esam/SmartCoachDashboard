import api from '../../lib/axios';
import type { LoginRequest, LoginResponse, ForgotPasswordRequest } from '../../types';

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', data);
  return res.data;
}

export async function forgotPasswordApi(data: ForgotPasswordRequest): Promise<void> {
  await api.post('/auth/forgot-password', data);
}
