import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  UserCog,
  Globe,
  Trophy,
  Award,
  ListOrdered,
  Layers,
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
  const navigate = useNavigate();
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/profile-settings/${profileId}`)}
              className="btn-secondary flex items-center gap-2"
            >
              <UserCog className="h-4 w-4" />
              Profile Settings
            </button>
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
            <ProfileSummary
              profile={data.profile}
              chatHistoryCount={data.chat_history_count}
              onEditClick={() => navigate(`/profile-settings/${profileId}`)}
            />

            <Section
              icon={Building2}
              color="var(--color-agent-teal)"
              title="College recommendations"
              subtitle="Ranked in sequential order as per admission fit, placement ROI, and top recommendation priority"
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
  onEditClick,
}: {
  profile: Record<string, any>;
  chatHistoryCount: number;
  onEditClick?: () => void;
}) {
  return (
    <div className="card relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-bg-raised)] to-[var(--color-surface-2)]">
      {/* Subtle top accent gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-violet)] to-[var(--color-agent-teal)]" />

      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
              {profile.full_name ?? "Student Profile"}
            </h2>
            <span className="badge bg-[var(--color-agent-green)]/15 text-[var(--color-agent-green)] ring-1 ring-inset ring-[var(--color-agent-green)]/30 font-semibold px-3 py-1">
              Live Profile
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-ink-dim)]">
            {(profile.country || profile.state) && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--color-brand)] ring-1 ring-inset ring-[var(--color-brand)]/30">
                <Globe className="h-3.5 w-3.5" />
                {profile.state ? `${profile.state}, ` : ""}{profile.country || "India"}
                {profile.target_degree ? ` · ${profile.target_degree}` : ""}
              </span>
            )}
            {profile.exam_type && (
              <span className="inline-flex items-center gap-1 font-medium">
                🎯 <strong className="text-[var(--color-ink)]">{profile.exam_type}</strong>
                {profile.entrance_rank ? ` · Rank #${Number(profile.entrance_rank).toLocaleString()}` : ""}
                {profile.exam_score ? ` · Score ${profile.exam_score}` : ""}
              </span>
            )}
            {profile.marks_percentage != null && (
              <span>📊 <strong className="text-[var(--color-ink)]">{profile.marks_percentage}%</strong> qualifying marks</span>
            )}
            {profile.category && (
              <span className="rounded-md bg-[var(--color-surface-2)] px-2 py-0.5 text-xs text-[var(--color-ink)] font-mono">
                Category: {profile.category}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-ink-faint)] pt-1">
            {profile.preferred_branch && (
              <span className="inline-flex items-center gap-1 font-medium text-[var(--color-ink-dim)]">
                <Compass className="h-4 w-4 text-[var(--color-agent-teal)]" /> {profile.preferred_branch}
              </span>
            )}
            {profile.preferred_city && (
              <span className="inline-flex items-center gap-1 text-[var(--color-ink-dim)]">
                <MapPin className="h-4 w-4 text-[var(--color-agent-red)]" /> {profile.preferred_city}
              </span>
            )}
            {profile.budget_max != null && (
              <span className="inline-flex items-center gap-1 text-[var(--color-ink-dim)]">
                <Wallet className="h-4 w-4 text-[var(--color-agent-orange)]" /> Budget: {profile.country === "India" || !profile.country ? "₹" : ""}{Number(profile.budget_max).toLocaleString()}
              </span>
            )}
            {profile.hostel_required != null && (
              <span className="inline-flex items-center gap-1 text-[var(--color-ink-dim)]">
                <BedDouble className="h-4 w-4 text-[var(--color-agent-purple)]" /> {profile.hostel_required ? "Hostel Required" : "Hostel Not Needed"}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {onEditClick && (
            <button
              onClick={onEditClick}
              className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
            >
              <UserCog className="h-3.5 w-3.5" /> Edit Profile
            </button>
          )}
          <span className="text-xs text-[var(--color-ink-faint)]">
            💬 {chatHistoryCount} counseling interaction{chatHistoryCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {Array.isArray(profile.interests) && profile.interests.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--color-border-soft)] pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">Interests:</span>
          {profile.interests.map((tag: string) => (
            <span
              key={tag}
              className="badge bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] ring-1 ring-inset ring-[var(--color-border)] hover:text-[var(--color-ink)]"
            >
              #{tag}
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
      <div className="mb-4 flex items-center gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl shadow-sm"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-lg font-bold leading-tight text-[var(--color-ink)]">{title}</h3>
          {subtitle && <p className="text-xs text-[var(--color-ink-faint)]">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function CollegeRecommendations({ recommendations }: { recommendations: any[] }) {
  const [viewMode, setViewMode] = useState<"sequential" | "tiers">("sequential");

  if (!recommendations?.length) {
    return (
      <div className="card p-8 text-center border-dashed">
        <Building2 className="mx-auto h-8 w-8 text-[var(--color-ink-faint)] mb-2" />
        <p className="text-sm font-medium text-[var(--color-ink-dim)]">No college matches yet</p>
        <p className="text-xs text-[var(--color-ink-faint)] mt-1">Refine your entrance exam rank or preferred branch in Profile Settings to see instant matches.</p>
      </div>
    );
  }

  // Sort sequentially by recommendation_rank (1, 2, 3...)
  const sortedRecs = [...recommendations].sort(
    (a, b) => (a.recommendation_rank || 999) - (b.recommendation_rank || 999)
  );

  return (
    <div className="space-y-5">
      {/* View Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-soft)] pb-3">
        <div className="flex items-center gap-2 text-xs text-[var(--color-ink-dim)]">
          <span className="font-semibold text-[var(--color-ink)]">{recommendations.length} Recommended Institutions</span>
          <span>• Ordered by algorithmic recommendation priority</span>
        </div>

        <div className="flex items-center rounded-xl bg-[var(--color-surface-2)] p-1 text-xs">
          <button
            onClick={() => setViewMode("sequential")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all ${
              viewMode === "sequential"
                ? "bg-[var(--color-bg-raised)] text-[var(--color-ink)] shadow-xs"
                : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
            }`}
          >
            <ListOrdered className="h-3.5 w-3.5 text-[var(--color-brand)]" />
            Top Ranked (1, 2, 3...)
          </button>
          <button
            onClick={() => setViewMode("tiers")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all ${
              viewMode === "tiers"
                ? "bg-[var(--color-bg-raised)] text-[var(--color-ink)] shadow-xs"
                : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-[var(--color-agent-purple)]" />
            Group by Tier
          </button>
        </div>
      </div>

      {/* Sequential Number Order (Default) */}
      {viewMode === "sequential" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedRecs.map((r, index) => {
            const rankNum = r.recommendation_rank || index + 1;
            const isTop1 = rankNum === 1;
            const isTop2 = rankNum === 2;
            const isTop3 = rankNum === 3;

            return (
              <div
                key={`${r.college_id}-${r.branch}`}
                className={`card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between relative overflow-hidden ${
                  isTop1
                    ? "border-amber-400/60 bg-gradient-to-br from-amber-500/5 via-[var(--color-surface)] to-[var(--color-surface-2)] ring-1 ring-amber-400/30"
                    : isTop2
                    ? "border-blue-500/40 bg-gradient-to-br from-blue-500/5 via-[var(--color-surface)] to-[var(--color-surface-2)]"
                    : isTop3
                    ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 via-[var(--color-surface)] to-[var(--color-surface-2)]"
                    : "hover:border-[var(--color-brand)]/40"
                }`}
              >
                <div>
                  {/* Sequential Rank Badge Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs ${
                        isTop1
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/20"
                          : isTop2
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20"
                          : isTop3
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/20"
                          : "bg-[var(--color-surface-2)] text-[var(--color-ink)] border border-[var(--color-border)]"
                      }`}
                    >
                      {isTop1 && <Trophy className="h-3.5 w-3.5" />}
                      {isTop2 && <Sparkles className="h-3.5 w-3.5" />}
                      {isTop3 && <Award className="h-3.5 w-3.5" />}
                      <span>#{rankNum} {isTop1 ? "Top Recommendation" : isTop2 ? "Top Pick" : isTop3 ? "Strong Match" : "Recommendation"}</span>
                    </span>
                    <TierBadge tier={r.tier} />
                  </div>

                  <h4 className="font-display font-semibold text-[var(--color-ink)] text-base leading-snug">
                    {r.college_name}
                  </h4>

                  <p className="mt-1.5 text-xs font-medium text-[var(--color-agent-teal)] flex items-center gap-1">
                    <Compass className="h-3.5 w-3.5" /> {r.branch}
                  </p>
                  <p className="text-xs text-[var(--color-ink-faint)] flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" /> {r.city}
                  </p>

                  <div className="mt-4 space-y-2 rounded-xl bg-[var(--color-surface-2)]/60 p-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--color-ink-faint)]">Closing Cutoff Rank</span>
                      <span className="font-mono font-bold text-[var(--color-ink)]">
                        {r.closing_rank ? `#${Number(r.closing_rank).toLocaleString()}` : "Open"}
                      </span>
                    </div>
                    {r.fee_per_year != null && (
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-ink-faint)]">Annual Fee</span>
                        <span className="font-mono font-medium text-[var(--color-ink)]">
                          ₹{Number(r.fee_per_year).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    {r.placement_stats?.avg_package && (
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-ink-faint)]">Avg Placement</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ₹{r.placement_stats.avg_package} LPA
                        </span>
                      </div>
                    )}
                    {r.naac_grade && (
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--color-ink-faint)]">Accreditation</span>
                        <span className="badge bg-[var(--color-agent-purple)]/15 text-[var(--color-agent-purple)] font-bold text-[10px] px-2 py-0.5">
                          NAAC {r.naac_grade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-[var(--color-border-soft)] pt-3">
                  <div className="mb-1 flex justify-between text-[11px] text-[var(--color-ink-faint)]">
                    <span>Admission Likelihood</span>
                    <span className="font-semibold text-[var(--color-ink)]">{r.admission_probability_pct ?? 75}%</span>
                  </div>
                  <ProbabilityBar value={r.admission_probability_pct} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Group by Tier View */}
      {viewMode === "tiers" && (
        <div className="space-y-6">
          {TIER_ORDER.filter((tier) => recommendations.some((r) => r.tier === tier)).map((tier) => (
            <div key={tier} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <TierBadge tier={tier} />
                  <span className="text-xs font-medium text-[var(--color-ink-faint)]">
                    {recommendations.filter((r) => r.tier === tier).length} college match{recommendations.filter((r) => r.tier === tier).length === 1 ? "" : "es"}
                  </span>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommendations
                  .filter((r) => r.tier === tier)
                  .sort((a, b) => (a.recommendation_rank || 999) - (b.recommendation_rank || 999))
                  .map((r, index) => {
                    const rankNum = r.recommendation_rank || index + 1;
                    return (
                      <div
                        key={`${r.college_id}-${r.branch}`}
                        className="card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-brand)]/40 hover:shadow-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="badge bg-[var(--color-surface-2)] text-[var(--color-ink)] font-bold text-xs px-2.5 py-0.5 border border-[var(--color-border)]">
                              #{rankNum} Recommendation
                            </span>
                          </div>
                          <h4 className="font-display font-semibold text-[var(--color-ink)] leading-snug">
                            {r.college_name}
                          </h4>
                          <p className="mt-1 text-xs font-medium text-[var(--color-agent-teal)] flex items-center gap-1">
                            <Compass className="h-3 w-3" /> {r.branch}
                          </p>
                          <p className="text-xs text-[var(--color-ink-faint)] flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {r.city}
                          </p>

                          <div className="mt-4 space-y-2 rounded-xl bg-[var(--color-surface-2)]/60 p-3 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-[var(--color-ink-faint)]">Cutoff Rank</span>
                              <span className="font-mono font-semibold text-[var(--color-ink)]">
                                {r.closing_rank ? `#${Number(r.closing_rank).toLocaleString()}` : "N/A"}
                              </span>
                            </div>
                            {r.fee_per_year != null && (
                              <div className="flex justify-between items-center">
                                <span className="text-[var(--color-ink-faint)]">Annual Fee</span>
                                <span className="font-mono font-medium text-[var(--color-ink)]">
                                  ₹{Number(r.fee_per_year).toLocaleString("en-IN")}
                                </span>
                              </div>
                            )}
                            {r.naac_grade && (
                              <div className="flex justify-between items-center">
                                <span className="text-[var(--color-ink-faint)]">Accreditation</span>
                                <span className="badge bg-[var(--color-agent-purple)]/15 text-[var(--color-agent-purple)] font-bold text-[10px] px-2 py-0.5">
                                  NAAC {r.naac_grade}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 border-t border-[var(--color-border-soft)] pt-3">
                          <div className="mb-1 flex justify-between text-[11px] text-[var(--color-ink-faint)]">
                            <span>Admission Likelihood</span>
                            <span className="font-semibold text-[var(--color-ink)]">{r.admission_probability_pct ?? 75}%</span>
                          </div>
                          <ProbabilityBar value={r.admission_probability_pct} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdmissionProbabilityChart({
  rows,
}: {
  rows: { college_name: string; branch: string; probability_pct: number | null; recommendation_rank?: number }[];
}) {
  const chartData = rows
    .filter((r) => r.probability_pct != null)
    .slice(0, 8)
    .map((r, i) => {
      const rankNum = r.recommendation_rank || i + 1;
      const rawName = r.college_name.length > 18 ? r.college_name.slice(0, 18) + "…" : r.college_name;
      return {
        name: `#${rankNum} ${rawName}`,
        probability: r.probability_pct,
      };
    });

  if (!chartData.length) return null;

  return (
    <div className="card p-6">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 12, right: 12, left: -18, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--color-ink-faint)", fontSize: 11 }}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={55}
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
  if (!scholarships?.length) {
    return (
      <div className="card p-8 text-center border-dashed">
        <ScholarshipIcon className="mx-auto h-8 w-8 text-[var(--color-ink-faint)] mb-2" />
        <p className="text-sm font-medium text-[var(--color-ink-dim)]">No scholarship matches found</p>
        <p className="text-xs text-[var(--color-ink-faint)] mt-1">Check family income or reservation category in Profile Settings.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {scholarships.map((s) => (
        <div key={s.scholarship_id} className="card p-5 flex flex-col justify-between hover:border-[var(--color-agent-orange)]/40 transition-colors">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-display font-semibold text-[var(--color-ink)] leading-snug">{s.name}</h4>
              <span
                className={`badge shrink-0 font-semibold ${
                  s.provider_type === "govt"
                    ? "bg-[var(--color-agent-green)]/15 text-[var(--color-agent-green)] ring-1 ring-inset ring-[var(--color-agent-green)]/30"
                    : "bg-[var(--color-agent-orange)]/15 text-[var(--color-agent-orange)] ring-1 ring-inset ring-[var(--color-agent-orange)]/30"
                }`}
              >
                {s.provider_type === "govt" ? "Government Scheme" : "Private Foundation"}
              </span>
            </div>
            {s.amount != null && (
              <p className="mt-2 font-mono text-lg font-bold text-[var(--color-agent-green)]">
                ₹{Number(s.amount).toLocaleString("en-IN")} <span className="text-xs font-normal text-[var(--color-ink-faint)]">aid</span>
              </p>
            )}
            {s.coverage && (
              <p className="mt-1 text-xs text-[var(--color-ink-dim)] font-medium">
                🛡️ {s.coverage}
              </p>
            )}
            <p className="mt-2 text-xs text-[var(--color-ink-faint)] bg-[var(--color-surface-2)]/60 rounded-lg p-2.5">
              💡 {s.match_reason}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border-soft)] pt-3 text-xs">
            <span className="text-[var(--color-ink-faint)]">
              {s.deadline ? `⏳ Deadline: ${s.deadline}` : "Open Ongoing"}
            </span>
            {s.application_link && (
              <a
                href={s.application_link}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[var(--color-brand)] hover:underline inline-flex items-center gap-1"
              >
                Apply for Scholarship →
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
