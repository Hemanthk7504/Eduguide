import {
  User,
  UserSearch,
  Bot,
  Search,
  Cpu,
  Building2,
  GraduationCap,
  Compass,
  Briefcase,
  MessageCircle,
  LayoutDashboard,
  FileText,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface AgentMeta {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string; // CSS var reference
}

export const AGENTS: AgentMeta[] = [
  { key: "student_input", label: "Student Input", icon: User, color: "var(--color-agent-blue)" },
  { key: "profile_analyzer", label: "Profile Analyzer", icon: UserSearch, color: "var(--color-agent-green)" },
  { key: "coordinator", label: "Coordinator", icon: Bot, color: "var(--color-agent-purple)" },
  { key: "rag_pipeline", label: "RAG Pipeline", icon: Search, color: "var(--color-agent-blue)" },
  { key: "llm", label: "LLM", icon: Cpu, color: "var(--color-agent-orange)" },
  { key: "college_agent", label: "College Agent", icon: Building2, color: "var(--color-agent-teal)" },
  { key: "scholarship_agent", label: "Scholarship Agent", icon: GraduationCap, color: "var(--color-agent-orange)" },
  { key: "branch_agent", label: "Branch Agent", icon: Compass, color: "var(--color-agent-green)" },
  { key: "career_guidance", label: "Career Guidance", icon: Briefcase, color: "var(--color-agent-red)" },
  { key: "chatbot", label: "Chatbot", icon: MessageCircle, color: "var(--color-agent-blue)" },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "var(--color-agent-yellow)" },
  { key: "pdf_report", label: "PDF Report", icon: FileText, color: "var(--color-agent-red)" },
  { key: "notifications", label: "Notifications", icon: Bell, color: "var(--color-agent-purple)" },
];

export function agentByKey(key: string): AgentMeta | undefined {
  return AGENTS.find((a) => a.key === key);
}
