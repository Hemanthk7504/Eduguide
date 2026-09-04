import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Loader2, Sparkles, Building2, Award, GitBranch } from "lucide-react";
import { downloadReport, listReports } from "../api/misc";
import { AppShell } from "../components/AppShell";
import { ListSkeleton } from "../components/Skeletons";

function formatReportSummary(summary: any): string {
  if (!summary) return "Admission Guidance Plan";
  if (typeof summary === "string") return summary;
  if (typeof summary === "object") {
    const parts: string[] = [];
    if (summary.college_count) parts.push(`${summary.college_count} Colleges`);
    if (summary.scholarship_count) parts.push(`${summary.scholarship_count} Scholarships`);
    if (summary.branch_count) parts.push(`${summary.branch_count} Branches`);
    if (parts.length > 0) {
      return `Personalized Report · ${parts.join(" · ")}`;
    }
  }
  return "Admission Plan Report";
}

export default function Reports() {
  const { data, isLoading } = useQuery({ queryKey: ["reports"], queryFn: listReports });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function handleDownload(id: string) {
    setDownloadingId(id);
    try {
      const blob = await downloadReport(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eduguide-report-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
            <FileText className="h-3.5 w-3.5" />
            <span>Official Counseling Documentation</span>
          </div>
          <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">
            Your Generated Admission Reports
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
            Download your comprehensive PDF admission roadmaps with college recommendations, entrance cutoffs, and eligible scholarship schemes.
          </p>
        </div>

        <div className="space-y-3">
          {isLoading && <ListSkeleton />}

          {!isLoading && (!data || data.length === 0) && (
            <div className="card p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-base font-semibold">No reports generated yet</h3>
              <p className="mt-1 text-xs text-[var(--color-ink-faint)] max-w-md mx-auto">
                Generate an official PDF report directly from your personalized dashboard to export your recommendations and branch roadmaps.
              </p>
              <Link to="/dashboard" className="btn-primary mt-4 inline-flex items-center gap-2 text-xs">
                <Sparkles className="h-3.5 w-3.5" />
                Go to Dashboard & Generate PDF
              </Link>
            </div>
          )}

          {data?.map((r) => {
            const summaryObj = typeof r.summary === "object" ? r.summary : null;
            return (
              <div
                key={r.id}
                className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-colors hover:border-[var(--color-brand)]/40 shadow-xs"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--color-agent-red)]/15 text-[var(--color-agent-red)]">
                    <FileText className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--color-ink)] truncate">
                      {formatReportSummary(r.summary)}
                    </h3>

                    {r.created_at && (
                      <p className="mt-0.5 text-xs text-[var(--color-ink-faint)] font-mono">
                        Generated on {new Date(r.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}

                    {/* Summary badges if available */}
                    {summaryObj && (
                      <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                        {summaryObj.college_count != null && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 font-medium text-blue-600 dark:text-blue-400">
                            <Building2 className="h-3 w-3" />
                            {summaryObj.college_count} Colleges
                          </span>
                        )}
                        {summaryObj.scholarship_count != null && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
                            <Award className="h-3 w-3" />
                            {summaryObj.scholarship_count} Scholarships
                          </span>
                        )}
                        {summaryObj.branch_count != null && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 font-medium text-purple-600 dark:text-purple-400">
                            <GitBranch className="h-3 w-3" />
                            {summaryObj.branch_count} Branches
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(r.id)}
                  disabled={downloadingId === r.id}
                  className="btn-secondary sm:shrink-0 inline-flex items-center justify-center gap-2 text-xs font-semibold py-2 px-4"
                >
                  {downloadingId === r.id ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Downloading PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5 text-[var(--color-brand)]" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
