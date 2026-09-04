import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  GraduationCap,
  Globe,
  Sliders,
} from "lucide-react";
import { getProfile, updateProfile, validateProfile, listProfiles } from "../api/profiles";
import { AppShell } from "../components/AppShell";
import { TagInput } from "../components/TagInput";
import { COUNTRIES, ALL_CATEGORIES } from "../lib/countryExams";
import type { StudentProfileUpdate } from "../types/api";

export default function ProfileSettings() {
  const { profileId } = useParams<{ profileId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeId, setActiveId] = useState<string | null>(profileId || null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If no profileId in URL, fetch list of profiles and pick the latest
  const { data: profilesList } = useQuery({
    queryKey: ["profiles"],
    queryFn: listProfiles,
    enabled: !activeId,
  });

  useEffect(() => {
    if (!activeId && profilesList && profilesList.length > 0) {
      setActiveId(profilesList[profilesList.length - 1].id);
    }
  }, [activeId, profilesList]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", activeId],
    queryFn: () => getProfile(activeId!),
    enabled: !!activeId,
  });

  const [form, setForm] = useState<StudentProfileUpdate>({
    full_name: "",
    country: "India",
    state: "Telangana",
    target_degree: "B.Tech / B.E.",
    marks_percentage: undefined,
    entrance_rank: undefined,
    exam_score: undefined,
    exam_type: "TG EAPCET (Telangana EAPCET)",
    category: "OC",
    gender: "",
    preferred_branch: "",
    budget_max: undefined,
    preferred_city: "",
    hostel_required: false,
    annual_income: undefined,
    interests: [],
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        country: profile.country || (profile.normalized_data?.country as string) || "India",
        state: profile.state || (profile.normalized_data?.state as string) || "Telangana",
        target_degree: profile.target_degree || (profile.normalized_data?.target_degree as string) || "B.Tech / B.E.",
        marks_percentage: profile.marks_percentage ?? undefined,
        entrance_rank: profile.entrance_rank ?? undefined,
        exam_score: profile.exam_score ?? undefined,
        exam_type: profile.exam_type || "TG EAPCET (Telangana EAPCET)",
        category: profile.category || "OC",
        gender: profile.gender || "",
        preferred_branch: profile.preferred_branch || "",
        budget_max: profile.budget_max ?? undefined,
        preferred_city: profile.preferred_city || "",
        hostel_required: !!profile.hostel_required,
        annual_income: profile.annual_income ?? undefined,
        interests: profile.interests || [],
      });
    }
  }, [profile]);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.name === (form.country || "India")) || COUNTRIES[0];
  }, [form.country]);

  const availableExams = selectedCountry.exams;
  const availableStates = selectedCountry.states || [];
  const availableDegrees = selectedCountry.degrees;

  function handleCountryChange(countryName: string) {
    const c = COUNTRIES.find((item) => item.name === countryName) || COUNTRIES[0];
    setForm((f) => ({
      ...f,
      country: c.name,
      state: c.states && c.states.length > 0 ? c.states[0] : "",
      target_degree: c.degrees[0],
      exam_type: c.exams[0],
      category: c.name === "India" ? "OC" : "International",
    }));
  }

  function update<K extends keyof StudentProfileUpdate>(key: K, value: StudentProfileUpdate[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!activeId) throw new Error("No profile selected");
      const updated = await updateProfile(activeId, form);
      await validateProfile(activeId);
      return updated;
    },
    onSuccess: () => {
      setSuccessMsg("Profile and preferences updated successfully! Admission plan recalculated.");
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ["profile", activeId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", activeId] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      setTimeout(() => setSuccessMsg(null), 5000);
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail;
      setErrorMsg(typeof detail === "string" ? detail : "Failed to update profile settings.");
    },
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border-soft)] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(activeId ? `/dashboard/${activeId}` : "/dashboard")}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--color-ink-dim)]" />
            </button>
            <div>
              <h1 className="font-display text-2xl font-semibold">Profile Settings</h1>
              <p className="text-sm text-[var(--color-ink-dim)]">
                Manage your academic records, entrance exams, target state/country, and preferences.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(activeId ? `/dashboard/${activeId}` : "/dashboard")}
              className="btn-secondary"
            >
              View Dashboard
            </button>
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !activeId}
              className="btn-primary flex items-center gap-2"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-[var(--color-agent-green)]/10 px-4 py-3 text-sm text-[var(--color-agent-green)] ring-1 ring-inset ring-[var(--color-agent-green)]/30">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-[var(--color-agent-red)]/10 px-4 py-3 text-sm text-[var(--color-agent-red)] ring-1 ring-inset ring-[var(--color-agent-red)]/30">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLoading ? (
          <div className="card p-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--color-brand)]" />
            <p className="mt-3 text-sm text-[var(--color-ink-dim)]">Loading your profile details...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Section 1: Personal & Target Region */}
            <div className="card p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-soft)]">
                <Globe className="h-5 w-5 text-[var(--color-agent-blue)]" />
                <h2 className="font-display text-lg font-semibold">Target Country, State & Degree</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField label="Full Name">
                  <input
                    className="input"
                    value={form.full_name || ""}
                    onChange={(e) => update("full_name", e.target.value)}
                    placeholder="Student Name"
                  />
                </LabeledField>

                <LabeledField label="Target Country">
                  <select
                    className="input"
                    value={form.country || "India"}
                    onChange={(e) => handleCountryChange(e.target.value)}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name} ({c.defaultCurrency})
                      </option>
                    ))}
                  </select>
                </LabeledField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField label={form.country === "India" ? "State / Region" : "Province / State"}>
                  <select
                    className="input"
                    value={form.state || ""}
                    onChange={(e) => update("state", e.target.value)}
                  >
                    {availableStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </LabeledField>

                <LabeledField label="Target Degree Program">
                  <select
                    className="input"
                    value={form.target_degree || ""}
                    onChange={(e) => update("target_degree", e.target.value)}
                  >
                    {availableDegrees.map((deg) => (
                      <option key={deg} value={deg}>
                        {deg}
                      </option>
                    ))}
                  </select>
                </LabeledField>
              </div>
            </div>

            {/* Section 2: Entrance Exams & Academic Performance */}
            <div className="card p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-soft)]">
                <GraduationCap className="h-5 w-5 text-[var(--color-brand)]" />
                <h2 className="font-display text-lg font-semibold">Entrance Exam & Academics</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField label="Entrance Exam">
                  <select
                    className="input"
                    value={form.exam_type || ""}
                    onChange={(e) => update("exam_type", e.target.value)}
                  >
                    <option value="">Select entrance exam</option>
                    {availableExams.map((ex) => (
                      <option key={ex} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>
                </LabeledField>

                {form.country === "India" ? (
                  <LabeledField label="Entrance Rank">
                    <input
                      type="number"
                      min={1}
                      className="input"
                      value={form.entrance_rank ?? ""}
                      onChange={(e) => update("entrance_rank", numOrUndefined(e.target.value))}
                      placeholder="e.g. 5200"
                    />
                  </LabeledField>
                ) : (
                  <LabeledField label="Exam Score / Percentile">
                    <input
                      type="number"
                      step="any"
                      className="input"
                      value={form.exam_score ?? ""}
                      onChange={(e) => update("exam_score", numOrUndefined(e.target.value))}
                      placeholder="e.g. 1450 (SAT) or 320 (GRE)"
                    />
                  </LabeledField>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField label="Qualifying Marks (%)">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    className="input"
                    value={form.marks_percentage ?? ""}
                    onChange={(e) => update("marks_percentage", numOrUndefined(e.target.value))}
                    placeholder="e.g. 94.2"
                  />
                </LabeledField>

                <LabeledField label="Category / Reservation">
                  <select
                    className="input"
                    value={form.category || "OC"}
                    onChange={(e) => update("category", e.target.value)}
                  >
                    {ALL_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </LabeledField>
              </div>
            </div>

            {/* Section 3: Branch, Budget & Campus Preferences */}
            <div className="card p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-soft)]">
                <Sliders className="h-5 w-5 text-[var(--color-agent-teal)]" />
                <h2 className="font-display text-lg font-semibold">Preferences & Financial Budget</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField label="Preferred Engineering / Study Branch">
                  <input
                    className="input"
                    value={form.preferred_branch || ""}
                    onChange={(e) => update("preferred_branch", e.target.value)}
                    placeholder="e.g. Computer Science and Engineering"
                  />
                </LabeledField>

                <LabeledField label="Preferred City / Location">
                  <input
                    className="input"
                    value={form.preferred_city || ""}
                    onChange={(e) => update("preferred_city", e.target.value)}
                    placeholder="e.g. Hyderabad, Bengaluru, Austin"
                  />
                </LabeledField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField
                  label={`Max Annual Fee Budget (${selectedCountry.currencySymbol || "₹"})`}
                >
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={form.budget_max ?? ""}
                    onChange={(e) => update("budget_max", numOrUndefined(e.target.value))}
                    placeholder="e.g. 150000"
                  />
                </LabeledField>

                <LabeledField
                  label={`Family Annual Income (${selectedCountry.currencySymbol || "₹"})`}
                >
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={form.annual_income ?? ""}
                    onChange={(e) => update("annual_income", numOrUndefined(e.target.value))}
                    placeholder="e.g. 500000"
                  />
                </LabeledField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField label="Gender">
                  <select
                    className="input"
                    value={form.gender || ""}
                    onChange={(e) => update("gender", e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </LabeledField>

                <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3.5 py-3 mt-6">
                  <span className="text-sm font-medium text-[var(--color-ink-dim)]">Hostel Accommodation Required</span>
                  <input
                    type="checkbox"
                    checked={!!form.hostel_required}
                    onChange={(e) => update("hostel_required", e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
                  />
                </div>
              </div>

              <LabeledField label="Academic & Career Interests">
                <TagInput
                  value={form.interests || []}
                  onChange={(tags) => update("interests", tags)}
                  placeholder="Type an interest (e.g. Machine Learning, Robotics) and press Enter"
                />
              </LabeledField>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !activeId}
                className="btn-primary flex items-center gap-2 px-6 py-3 text-base"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Save & Update Admission Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function numOrUndefined(val: string): number | undefined {
  if (!val || val.trim() === "") return undefined;
  const n = Number(val);
  return Number.isNaN(n) ? undefined : n;
}
