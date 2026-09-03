import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Loader2 } from "lucide-react";
import { downloadReport, listReports } from "../api/misc";
import { AppShell } from "../components/AppShell";
import { ListSkeleton } from "../components/Skeletons";

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
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-semibold">Your reports</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
          Every PDF report generated from your dashboard, ready to download.
        </p>

        <div className="mt-6 space-y-3">
          {isLoading && <ListSkeleton />}
          {!isLoading && (!data || data.length === 0) && (
            <div className="card p-8 text-center text-sm text-[var(--color-ink-faint)]">
              No reports yet. Generate one from your dashboard.
            </div>
          )}
          {data?.map((r) => (
            <div key={r.id} className="card flex items-center gap-4 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-agent-red)]/15 text-[var(--color-agent-red)]">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.summary || "Admission plan report"}</p>
                {r.created_at && (
                  <p className="text-xs text-[var(--color-ink-faint)]">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDownload(r.id)}
                disabled={downloadingId === r.id}
                className="btn-secondary shrink-0"
              >
                {downloadingId === r.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
