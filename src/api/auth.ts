import { apiClient } from "./client";
import type {
  LoginResponse,
  UserOut,
  UserRegisterResponse,
  VerifyEmailResponse,
  CheckVerificationResponse,
  GoogleAuthPayload,
  GoogleAuthResponse,
} from "../types/api";

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export async function register(payload: RegisterPayload): Promise<UserRegisterResponse> {
  const { data } = await apiClient.post<UserRegisterResponse>("/auth/register", payload);
  return data;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);
  const { data } = await apiClient.post<LoginResponse>("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}

export async function fetchMe(): Promise<UserOut> {
  const { data } = await apiClient.get<UserOut>("/auth/me");
  return data;
}

export async function verifyEmail(token: string, email?: string): Promise<VerifyEmailResponse> {
  const { data } = await apiClient.post<VerifyEmailResponse>("/auth/verify-email", {
    token,
    email: email || undefined,
  });
  return data;
}

export async function checkVerification(email: string): Promise<CheckVerificationResponse> {
  const { data } = await apiClient.get<CheckVerificationResponse>("/auth/check-verification", {
    params: { email },
  });
  return data;
}

export async function resendVerification(email: string): Promise<{ message: string; verification_link?: string }> {
  const { data } = await apiClient.post<{ message: string; verification_link?: string }>("/auth/resend-verification", {
    email,
  });
  return data;
}

export async function googleAuth(payload: GoogleAuthPayload): Promise<GoogleAuthResponse> {
  const { data } = await apiClient.post<GoogleAuthResponse>("/auth/google", payload);
  return data;
}
