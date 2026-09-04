import { apiClient } from "./client";
import type {
  ChatMessageOut,
  ChatSendResponse,
  DashboardResponse,
  KbDocument,
  KbIngestResponse,
  NotificationChannel,
  NotificationOut,
  Report,
} from "../types/api";

// ---- Chatbot ----
export async function sendChatMessage(payload: {
  session_id?: string;
  profile_id?: string;
  message: string;
}): Promise<ChatSendResponse> {
  const { data } = await apiClient.post<ChatSendResponse>("/chatbot/message", payload);
  return data;
}

export async function getChatHistory(sessionId: string): Promise<ChatMessageOut[]> {
  const { data } = await apiClient.get<ChatMessageOut[]>(`/chatbot/history/${sessionId}`);
  return data;
}

// ---- Knowledge base (admin) ----
export async function ingestText(payload: {
  title: string;
  category: string;
  source?: string;
  text: string;
}): Promise<KbIngestResponse> {
  const { data } = await apiClient.post<KbIngestResponse>("/knowledge-base/ingest-text", payload);
  return data;
}

export async function ingestFile(payload: {
  title: string;
  category: string;
  source?: string;
  file: File;
}): Promise<KbIngestResponse> {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("category", payload.category);
  if (payload.source) form.append("source", payload.source);
  form.append("file", payload.file);
  const { data } = await apiClient.post<KbIngestResponse>("/knowledge-base/ingest-file", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listKbDocuments(): Promise<KbDocument[]> {
  const { data } = await apiClient.get<KbDocument[]>("/knowledge-base/documents");
  return data;
}

export async function listKbCategories(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>("/knowledge-base/categories");
  return data;
}

// ---- Dashboard ----
export async function getDashboard(profileId: string): Promise<DashboardResponse> {
  const { data } = await apiClient.get<DashboardResponse>(`/dashboard/${profileId}`);
  return data;
}

// ---- Reports ----
export async function generateReport(profileId: string): Promise<Report> {
  const { data } = await apiClient.post<Report>("/reports/generate", { profile_id: profileId });
  return data;
}

export async function listReports(): Promise<Report[]> {
  const { data } = await apiClient.get<Report[]>("/reports");
  return data;
}

export async function downloadReport(reportId: string): Promise<Blob> {
  const { data } = await apiClient.get(`/reports/${reportId}/download`, { responseType: "blob" });
  return data;
}

// ---- Notifications ----
export async function createNotification(payload: {
  title: string;
  message: string;
  channel: NotificationChannel;
}): Promise<NotificationOut> {
  const { data } = await apiClient.post<NotificationOut>("/notifications", payload);
  return data;
}

export async function listNotifications(unreadOnly?: boolean): Promise<NotificationOut[]> {
  const { data } = await apiClient.get<NotificationOut[]>("/notifications", {
    params: unreadOnly ? { unread_only: true } : undefined,
  });
  return data;
}

export async function markNotificationRead(id: string): Promise<NotificationOut> {
  const { data } = await apiClient.patch<NotificationOut>(`/notifications/${id}/read`);
  return data;
}

export async function markAllNotificationsRead(): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>("/notifications/read-all");
  return data;
}

export async function deleteNotification(id: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/notifications/${id}`);
  return data;
}

