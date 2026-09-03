import { apiClient } from "./client";
import type { StudentProfileCreate, StudentProfileOut, StudentProfileUpdate } from "../types/api";

export async function createProfile(payload: StudentProfileCreate): Promise<StudentProfileOut> {
  const { data } = await apiClient.post<StudentProfileOut>("/profiles", payload);
  return data;
}

export async function listProfiles(): Promise<StudentProfileOut[]> {
  const { data } = await apiClient.get<StudentProfileOut[]>("/profiles");
  return data;
}

export async function getProfile(profileId: string): Promise<StudentProfileOut> {
  const { data } = await apiClient.get<StudentProfileOut>(`/profiles/${profileId}`);
  return data;
}

export async function updateProfile(
  profileId: string,
  payload: StudentProfileUpdate
): Promise<StudentProfileOut> {
  const { data } = await apiClient.put<StudentProfileOut>(`/profiles/${profileId}`, payload);
  return data;
}

export async function validateProfile(profileId: string): Promise<StudentProfileOut> {
  const { data } = await apiClient.post<StudentProfileOut>(`/profiles/${profileId}/validate`);
  return data;
}

export async function deleteProfile(profileId: string): Promise<void> {
  await apiClient.delete(`/profiles/${profileId}`);
}
