import { useSearchParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { ChatPanel } from "../components/ChatPanel";

export default function Chat() {
  const [params] = useSearchParams();
  const profileId = params.get("profileId") ?? undefined;

  return (
    <AppShell>
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
        <div className="mb-4">
          <h1 className="font-display text-2xl font-semibold">Chat with EduGuide</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
            Ask about cutoffs, scholarships, or branches — answers cite their sources.
          </p>
        </div>
        <div className="card min-h-0 flex-1 p-4">
          <ChatPanel profileId={profileId} />
        </div>
      </div>
    </AppShell>
  );
}
