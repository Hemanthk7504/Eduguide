import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Loader2,
  MapPin,
  Wallet,
  BedDouble,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Building2,
  GraduationCap as ScholarshipIcon,
  Compass,
  Briefcase,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDashboard } from "../api/misc";
import { generateReport } from "../api/misc";
import { AppShell } from "../components/AppShell";
import { AgentRail } from "../components/AgentRail";
import { TierBadge } from "../components/TierBadge";
import { ProbabilityBar } from "../components/ProbabilityBar";
import { DashboardSkeleton } from "../components/Skeletons";
import { ChatDrawer } from "../components/ChatDrawer";
import { Markdown } from "../components/Markdown";
import type { Tier } from "../types/api";

const TIER_ORDER: Tier[] = ["Dream", "Reach", "Match", "Safe"];

export default function Dashboard() {
  const { profileId } = useParams<{ profileId: string }>();
  const queryClient = useQueryClient();
  const [reportMsg, setReportMsg] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", profileId],
    queryFn: () => getDashboard(profileId!),
    enabled: !!profileId,
  });

  const reportMutation = useMutation({
    mutationFn: () => generateReport(profileId!),
    onSuccess: (report) => {
      setReportMsg(`Report ready — ${report.summary}`);
      queryClient.invalidateQueries({ queryKey: ["dashboard", profileId] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: () => setReportMsg("Couldn't generate the report. Please try again."),
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">Your admission plan</h1>
            <p className="text-sm text-[var(--color-ink-dim)]">
              Built from live cutoffs, scholarships, and market data.
            </p>
          </div>
          <button
            onClick={() => reportMutation.mutate()}
            disabled={reportMutation.isPending}
            className="btn-primary"
          >
            {reportMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Generate PDF report
          </button>
        </div>

        {reportMsg && (
          <div className="mb-6 rounded-xl bg-[var(--color-agent-green)]/10 px-4 py-3 text-sm text-[var(--color-agent-green)] ring-1 ring-inset ring-[var(--color-agent-green)]/30">
            {reportMsg}
          </div>
        )}

        {isLoading && (
          <div className="mb-6">
            <AgentRail pulse activeKeys={["student_input", "profile_analyzer", "coordinator", "rag_pipeline", "llm"]} />
            <DashboardSkeleton />
          </div>
        )}

        {isError && (
          <div className="card p-6 text-sm text-[var(--color-agent-red)]">
            Couldn't load your dashboard. Refresh, or check that the profile still exists.
          </div>
        )}

        {data && (
          <div className="space-y-8">
            <ProfileSummary profile={data.profile} chatHistoryCount={data.chat_history_count} />

            <Section
              icon={Building2}
              color="var(--color-agent-teal)"
              title="College recommendations"
              subtitle="Grouped by how competitive each option is for your profile"
            >
              <CollegeRecommendations recommendations={data.college_recommendations} />
            </Section>

            {data.admission_probability?.length > 0 && (
              <Section
                icon={Sparkles}
                color="var(--color-brand)"
                title="Admission probability"
                subtitle="Estimated chance of admission by college"
              >
                <AdmissionProbabilityChart rows={data.admission_probability} />
              </Section>
            )}

            <Section
              icon={ScholarshipIcon}
              color="var(--color-agent-orange)"
              title="Scholarship matches"
              subtitle="Based on your category, income, and academic profile"
            >
              <ScholarshipList scholarships={data.scholarships} />
            </Section>

            <Section
              icon={Compass}
              color="var(--color-agent-green)"
              title="Branch guidance"
              subtitle="Fit score against market demand and outcomes"
            >
              <BranchGuidance suggestions={data.branch_guidance?.suggestions ?? []} />
            </Section>

            <Section
              icon={Briefcase}
              color="var(--color-agent-red)"
              title="Career roadmap"
              subtitle="Where this path can lead"
            >
              <CareerRoadmap guidance={data.career_guidance as any} />
            </Section>
          </div>
        )}
      </div>
      <ChatDrawer profileId={profileId} />
    </AppShell>
  );
}

function ProfileSummary({
  profile,
  chatHistoryCount,
}: {
  profile: Record<string, any>;
  chatHistoryCount: number;
}) {
  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold">{profile.full_name ?? "Your profile"}</h2>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--color-ink-dim)]">
            {profile.exam_type && (
              <span>
                {profile.exam_type}
                {profile.entrance_rank ? ` · Rank ${profile.entrance_rank}` : ""}
              </span>
            )}
            {profile.marks_percentage != null && <span>{profile.marks_percentage}% marks</span>}
            {profile.category && <span>Category: {profile.category}</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--color-ink-faint)]">
            {profile.preferred_city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {profile.preferred_city}
              </span>
            )}
            {profile.budget_max != null && (
              <span className="inline-flex items-center gap-1">
                <Wallet className="h-3.5 w-3.5" /> Budget ₹{Number(profile.budget_max).toLocaleString("en-IN")}
              </span>
            )}
            {profile.hostel_required != null && (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" /> {profile.hostel_required ? "Hostel needed" : "No hostel"}
              </span>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-[var(--color-ink-faint)]">
          {chatHistoryCount} chat message{chatHistoryCount === 1 ? "" : "s"} so far
        </div>
      </div>
      {Array.isArray(profile.interests) && profile.interests.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.interests.map((tag: string) => (
            <span
              key={tag}
              className="badge bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] ring-1 ring-inset ring-[var(--color-border)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  color,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  color: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-[var(--color-ink-faint)]">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function CollegeRecommendations({ recommendations }: { recommendations: any[] }) {
  if (!recommendations?.length) {
    return <EmptyState message="No college matches yet — refine your profile to see recommendations." />;
  }
  return (
    <div className="space-y-6">
      {TIER_ORDER.filter((tier) => recommendations.some((r) => r.tier === tier)).map((tier) => (
        <div key={tier}>
          <div className="mb-2 flex items-center gap-2">
            <TierBadge tier={tier} />
            <span className="text-xs text-[var(--color-ink-faint)]">
              {recommendations.filter((r) => r.tier === tier).length} college
              {recommendations.filter((r) => r.tier === tier).length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recommendations
              .filter((r) => r.tier === tier)
              .map((r) => (
                <div key={`${r.college_id}-${r.branch}`} className="card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium leading-snug">{r.college_name}</h4>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-ink-faint)]">
                    {r.branch} · {r.city}
                  </p>
                  <div className="mt-3 space-y-1.5 text-xs text-[var(--color-ink-dim)]">
                    <div className="flex justify-between">
                      <span>Closing rank</span>
                      <span className="font-mono text-[var(--color-ink)]">{r.closing_rank}</span>
                    </div>
                    {r.fee_per_year != null && (
                      <div className="flex justify-between">
                        <span>Fee / year</span>
                        <span className="font-mono text-[var(--color-ink)]">
                          ₹{Number(r.fee_per_year).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    {r.naac_grade && (
                      <div className="flex justify-between">
                        <span>NAAC</span>
                        <span className="text-[var(--color-ink)]">{r.naac_grade}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 border-t border-[var(--color-border-soft)] pt-3">
                    <ProbabilityBar value={r.admission_probability_pct} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdmissionProbabilityChart({
  rows,
}: {
  rows: { college_name: string; branch: string; probability_pct: number | null }[];
}) {
  const chartData = rows
    .filter((r) => r.probability_pct != null)
    .slice(0, 8)
    .map((r) => ({
      name: r.college_name.length > 18 ? r.college_name.slice(0, 18) + "…" : r.college_name,
      probability: r.probability_pct,
    }));

  if (!chartData.length) return <EmptyState message="Probability estimates aren't available yet." />;

  return (
    <div className="card p-4">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--color-ink-faint)", fontSize: 11 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fill: "var(--color-ink-faint)", fontSize: 11 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
              fontSize: 12,
            }}
            cursor={{ fill: "rgba(79,70,229,0.08)" }}
          />
          <Bar dataKey="probability" fill="var(--color-brand)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ScholarshipList({ scholarships }: { scholarships: any[] }) {
  if (!scholarships?.length) return <EmptyState message="No scholarship matches found for this profile." />;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {scholarships.map((s) => (
        <div key={s.scholarship_id} className="card p-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium leading-snug">{s.name}</h4>
            <span
              className={`badge shrink-0 ${
                s.provider_type === "govt"
                  ? "bg-[var(--color-agent-green)]/15 text-[var(--color-agent-green)]"
                  : "bg-[var(--color-agent-orange)]/15 text-[var(--color-agent-orange)]"
              }`}
            >
              {s.provider_type === "govt" ? "Government" : "Private"}
            </span>
          </div>
          {s.amount != null && (
            <p className="mt-1 font-mono text-sm text-[var(--color-ink)]">
              ₹{Number(s.amount).toLocaleString("en-IN")}
            </p>
          )}
          {s.coverage && <p className="mt-1 text-xs text-[var(--color-ink-faint)]">{s.coverage}</p>}
          <p className="mt-2 text-xs text-[var(--color-ink-dim)]">{s.match_reason}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            {s.deadline && <span className="text-[var(--color-ink-faint)]">Deadline: {s.deadline}</span>}
            {s.application_link && (
              <a
                href={s.application_link}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
              >
                Apply →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function BranchGuidance({ suggestions }: { suggestions: any[] }) {
  if (!suggestions?.length) return <EmptyState message="No branch suggestions yet." />;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {suggestions.map((b) => (
        <div key={b.branch_id} className="card p-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium leading-snug">{b.branch_name}</h4>
            <TrendIcon trend={b.growth_trend} />
          </div>
          {b.description && <p className="mt-1 text-xs text-[var(--color-ink-faint)]">{b.description}</p>}
          <div className="mt-3 space-y-2">
            <ScoreBar label="Fit for you" value={b.fit_score} color="var(--color-brand)" />
            <ScoreBar label="Market demand" value={b.market_demand_score} color="var(--color-agent-teal)" />
          </div>
          {b.avg_starting_package != null && (
            <p className="mt-3 text-xs text-[var(--color-ink-dim)]">
              Avg. starting package: ₹{Number(b.avg_starting_package).toLocaleString("en-IN")}
            </p>
          )}
          {b.related_skills?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {b.related_skills.slice(0, 4).map((sk: string) => (
                <span
                  key={sk}
                  className="badge bg-[var(--color-surface-2)] text-[var(--color-ink-faint)] ring-1 ring-inset ring-[var(--color-border)]"
                >
                  {sk}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.max(0, Math.min(100, value <= 1 ? value * 100 : value));
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-[var(--color-ink-faint)]">
        <span>{label}</span>
        <span className="font-mono">{pct.toFixed(0)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string | null }) {
  if (trend === "rising")
    return <TrendingUp className="h-4 w-4 shrink-0 text-[var(--color-agent-green)]" />;
  if (trend === "declining")
    return <TrendingDown className="h-4 w-4 shrink-0 text-[var(--color-agent-red)]" />;
  return <Minus className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />;
}

function CareerRoadmap({ guidance }: { guidance: any }) {
  if (!guidance || !guidance.roadmap) return <EmptyState message="Career roadmap will appear once generated." />;
  return (
    <div className="card p-5">
      <p className="text-xs text-[var(--color-ink-faint)]">
        {guidance.branch}
        {guidance.interests_considered?.length ? ` · Considering: ${guidance.interests_considered.join(", ")}` : ""}
      </p>
      <div className="mt-3">
        <Markdown content={guidance.roadmap} />
      </div>
      {guidance.sources_used?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--color-border-soft)] pt-3">
          {guidance.sources_used.map((s: string, i: number) => (
            <span
              key={i}
              className="badge bg-[var(--color-surface-2)] text-[var(--color-ink-faint)] ring-1 ring-inset ring-[var(--color-border)]"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="card p-6 text-center text-sm text-[var(--color-ink-faint)]">{message}</div>
  );
}
