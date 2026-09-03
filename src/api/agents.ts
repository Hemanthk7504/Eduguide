import { apiClient } from "./client";
import type {
  AgentName,
  BranchOut,
  BranchSuggestion,
  CareerGuidance,
  CollegeOut,
  CollegeRecommendation,
  CoordinatorRunResponse,
  CutoffRecordOut,
  RagQueryResponse,
  ScholarshipMatch,
  ScholarshipOut,
} from "../types/api";

// ---- Coordinator ----
export async function runCoordinator(
  profileId: string,
  agents?: AgentName[]
): Promise<CoordinatorRunResponse> {
  const { data } = await apiClient.post<CoordinatorRunResponse>("/coordinator/run", {
    profile_id: profileId,
    ...(agents ? { agents } : {}),
  });
  return data;
}

// ---- RAG ----
export async function queryRag(
  query: string,
  top_k?: number,
  category_filter?: string
): Promise<RagQueryResponse> {
  const { data } = await apiClient.post<RagQueryResponse>("/rag/query", {
    query,
    top_k,
    category_filter,
  });
  return data;
}

// ---- College Agent ----
export async function listColleges(city?: string): Promise<CollegeOut[]> {
  const { data } = await apiClient.get<CollegeOut[]>("/colleges", { params: { city } });
  return data;
}

export async function getCollege(id: string): Promise<CollegeOut> {
  const { data } = await apiClient.get<CollegeOut>(`/colleges/${id}`);
  return data;
}

export async function getCollegeCutoffs(id: string): Promise<CutoffRecordOut[]> {
  const { data } = await apiClient.get<CutoffRecordOut[]>(`/colleges/${id}/cutoffs`);
  return data;
}

export async function getCollegeRecommendations(profileId: string): Promise<CollegeRecommendation[]> {
  const { data } = await apiClient.post<CollegeRecommendation[]>(
    `/colleges/recommendations/${profileId}`
  );
  return data;
}

export async function createCollege(payload: Partial<CollegeOut>): Promise<CollegeOut> {
  const { data } = await apiClient.post<CollegeOut>("/colleges", payload);
  return data;
}

export async function createCutoff(
  collegeId: string,
  payload: Partial<CutoffRecordOut>
): Promise<CutoffRecordOut> {
  const { data } = await apiClient.post<CutoffRecordOut>(`/colleges/${collegeId}/cutoffs`, payload);
  return data;
}

// ---- Scholarship Agent ----
export async function listScholarships(): Promise<ScholarshipOut[]> {
  const { data } = await apiClient.get<ScholarshipOut[]>("/scholarships");
  return data;
}

export async function getScholarship(id: string): Promise<ScholarshipOut> {
  const { data } = await apiClient.get<ScholarshipOut>(`/scholarships/${id}`);
  return data;
}

export async function getScholarshipMatches(profileId: string): Promise<ScholarshipMatch[]> {
  const { data } = await apiClient.post<ScholarshipMatch[]>(`/scholarships/matches/${profileId}`);
  return data;
}

export async function createScholarship(payload: Partial<ScholarshipOut>): Promise<ScholarshipOut> {
  const { data } = await apiClient.post<ScholarshipOut>("/scholarships", payload);
  return data;
}

// ---- Branch Agent ----
export async function listBranches(): Promise<BranchOut[]> {
  const { data } = await apiClient.get<BranchOut[]>("/branches");
  return data;
}

export async function getBranchSuggestions(profileId: string): Promise<BranchSuggestion[]> {
  const { data } = await apiClient.post<BranchSuggestion[]>(`/branches/suggestions/${profileId}`);
  return data;
}

export async function createBranch(payload: Partial<BranchOut>): Promise<BranchOut> {
  const { data } = await apiClient.post<BranchOut>("/branches", payload);
  return data;
}

// ---- Career Guidance Agent ----
export async function getCareerRoadmap(
  profileId: string,
  branchOverride?: string
): Promise<CareerGuidance> {
  const { data } = await apiClient.post<CareerGuidance>(`/career/roadmap/${profileId}`, null, {
    params: branchOverride ? { branch_override: branchOverride } : undefined,
  });
  return data;
}
