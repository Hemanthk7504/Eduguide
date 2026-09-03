import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellRing, Check, Mail, MessageSquare } from "lucide-react";
import { listNotifications, markNotificationRead } from "../api/misc";
import { AppShell } from "../components/AppShell";
import { ListSkeleton } from "../components/Skeletons";

const CHANNEL_ICON = { in_app: Bell, email: Mail, sms: MessageSquare } as const;

export default function Notifications() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", unreadOnly],
    queryFn: () => listNotifications(unreadOnly),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">Notifications</h1>
            <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
              Updates about your recommendations, deadlines, and reports.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--color-ink-dim)]">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-brand)]"
            />
            Unread only
          </label>
        </div>

        <div className="mt-6 space-y-2">
          {isLoading && <ListSkeleton />}
          {!isLoading && (!data || data.length === 0) && (
            <div className="card p-8 text-center text-sm text-[var(--color-ink-faint)]">
              You're all caught up.
            </div>
          )}
          {data?.map((n) => {
            const Icon = CHANNEL_ICON[n.channel] ?? Bell;
            return (
              <div
                key={n.id}
                className={`card flex items-start gap-3 p-4 ${!n.is_read ? "ring-1 ring-inset ring-[var(--color-brand)]/30" : ""}`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                    n.is_read
                      ? "bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]"
                      : "bg-[var(--color-brand)]/15 text-[var(--color-brand)]"
                  }`}
                >
                  {n.is_read ? <Icon className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    <span className="shrink-0 text-[11px] text-[var(--color-ink-faint)]">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--color-ink-dim)]">{n.message}</p>
                </div>
                {!n.is_read && (
                  <button
                    onClick={() => markRead.mutate(n.id)}
                    aria-label="Mark as read"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-agent-green)]"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
