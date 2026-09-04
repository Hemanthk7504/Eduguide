// ---- Auth ----
export type Role = "student" | "admin";

export interface UserOut {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  is_verified?: boolean;
}

export interface UserRegisterResponse {
  id: string;
  full_name: string;
  email: string;
  is_verified: boolean;
  message: string;
  verification_link?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface VerifyEmailResponse {
  message: string;
  is_verified: boolean;
  access_token: string;
  token_type: string;
  user: UserOut;
}

export interface CheckVerificationResponse {
  is_verified: boolean;
  access_token?: string;
  token_type?: string;
  user?: UserOut;
}

// ---- Student Profile ----
export type ExamType =
  | "TG EAPCET"
  | "AP EAPCET"
  | "JEE Main"
  | "JEE Advanced"
  | "NEET"
  | "BITSAT"
  | "KCET"
  | "MHT-CET"
  | "WBJEE"
  | "KEAM"
  | "TNEA"
  | "SAT"
  | "ACT"
  | "GRE"
  | "IELTS"
  | "TOEFL"
  | "OTHER";

export type Category =
  | "OC"
  | "BC-A"
  | "BC-B"
  | "BC-C"
  | "BC-D"
  | "BC-E"
  | "SC"
  | "ST"
  | "EWS"
  | "General"
  | "International";

export interface StudentProfileCreate {
  full_name: string;
  marks_percentage?: number;
  entrance_rank?: number;
  exam_score?: number;
  exam_type?: ExamType | string;
  country?: string;
  state?: string;
  target_degree?: string;
  category?: Category | string;
  gender?: string;
  preferred_branch?: string;
  budget_max?: number;
  preferred_city?: string;
  hostel_required: boolean;
  annual_income?: number;
  interests: string[];
}

export type StudentProfileUpdate = Partial<StudentProfileCreate>;

export interface NormalizedData {
  [key: string]: unknown;
  validation_warnings?: string[];
}

export interface StudentProfileOut extends StudentProfileCreate {
  id: string;
  user_id: string;
  is_validated: boolean;
  normalized_data: NormalizedData;
}

// ---- Shared agent output shapes ----
export type Tier = "Safe" | "Match" | "Reach" | "Dream";

export interface PlacementStats {
  avg_package?: number;
  highest_package?: number;
  placement_pct?: number;
}

export interface CollegeRecommendation {
  college_id: string;
  college_name: string;
  city: string;
  branch: string;
  category: string;
  closing_rank: number;
  opening_rank: number | null;
  fee_per_year: number | null;
  has_hostel: boolean;
  naac_grade: string | null;
  placement_stats: PlacementStats;
  tier: Tier;
  admission_probability_pct: number | null;
}

export interface ScholarshipMatch {
  scholarship_id: string;
  name: string;
  provider_type: "govt" | "private";
  amount: number | null;
  coverage: string | null;
  deadline: string | null;
  application_link: string | null;
  match_reason: string;
}

export type GrowthTrend = "rising" | "stable" | "declining" | null;

export interface BranchSuggestion {
  branch_id: string;
  branch_name: string;
  fit_score: number;
  market_demand_score: number;
  avg_starting_package: number | null;
  growth_trend: GrowthTrend;
  related_skills: string[];
  higher_studies_options: string[];
  description: string | null;
}

export interface CareerGuidance {
  branch: string;
  interests_considered: string[];
  roadmap: string;
  sources_used: string[];
}

export interface CoordinatorRunResponse {
  profile_id: string;
  college_recommendations: CollegeRecommendation[];
  scholarship_matches: ScholarshipMatch[];
  branch_suggestions: BranchSuggestion[];
  career_guidance: CareerGuidance;
  reasoning: string;
  aggregated_score_notes: string;
}

export type AgentName = "college" | "scholarship" | "branch" | "career";

// ---- RAG ----
export interface RagChunk {
  text: string;
  metadata: Record<string, unknown>;
  relevance_score: number;
}

export interface RagQueryResponse {
  query: string;
  answer: string;
  retrieved_chunks: RagChunk[];
}

// ---- College Agent ----
export interface CollegeOut {
  id: string;
  name: string;
  city: string;
  state: string;
  affiliation: string;
  naac_grade: string | null;
  fee_per_year: number | null;
  has_hostel: boolean;
  website: string | null;
  branches_offered: string[];
  placement_stats: PlacementStats;
}

export interface CutoffRecordOut {
  id: string;
  college_id: string;
  branch: string;
  category: string;
  closing_rank: number;
  opening_rank: number | null;
  year: number;
}

// ---- Scholarship Agent ----
export interface ScholarshipOut {
  id: string;
  name: string;
  provider_type: "govt" | "private";
  amount: number | null;
  coverage: string | null;
  deadline: string | null;
  application_link: string | null;
  eligibility?: string;
}

// ---- Branch Agent ----
export interface BranchOut {
  id: string;
  branch_name: string;
  description: string | null;
  market_demand_score: number;
  avg_starting_package: number | null;
  growth_trend: GrowthTrend;
  related_skills: string[];
  higher_studies_options: string[];
}

// ---- Chatbot ----
export interface ChatMessageOut {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatSendResponse {
  session_id: string;
  reply: string;
  sources: string[];
}

// ---- Knowledge base ----
export interface KbIngestResponse {
  document_id: string;
  chunks_ingested: number;
}

export interface KbDocument {
  id: string;
  title: string;
  category: string;
  source?: string;
  chunks_ingested: number;
  created_at: string;
}

// ---- Dashboard ----
export interface DashboardResponse {
  profile: Record<string, unknown>;
  college_recommendations: CollegeRecommendation[];
  admission_probability: { college_name: string; branch: string; probability_pct: number | null }[];
  scholarships: ScholarshipMatch[];
  branch_guidance: { suggestions: BranchSuggestion[] };
  career_guidance: CareerGuidance | Record<string, unknown>;
  chat_history_count: number;
  last_report_url: string | null;
}

// ---- Reports ----
export interface Report {
  id: string;
  file_path: string;
  summary: string;
  profile_id?: string;
  created_at?: string;
}

// ---- Notifications ----
export type NotificationChannel = "in_app" | "email" | "sms";

export interface NotificationOut {
  id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  is_read: boolean;
  created_at: string;
}
