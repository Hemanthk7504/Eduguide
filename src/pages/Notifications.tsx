import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  FileText,
  GraduationCap,
  TrendingUp,
  Trash2,
  ArrowRight,
  Inbox,
  Filter,
} from "lucide-react";
import { listNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from "../api/misc";
import type { NotificationOut } from "../types/api";
import { AppShell } from "../components/AppShell";
import { ListSkeleton } from "../components/Skeletons";

type CategoryTab = "all" | "unread" | "deadlines" | "recommendations" | "reports" | "scholarships";

interface NotificationMeta {
  category: "deadlines" | "recommendations" | "reports" | "scholarships" | "general";
  categoryLabel: string;
  badgeClass: string;
  icon: typeof Bell;
  actionLabel?: string;
  actionPath?: string;
}

function classifyNotification(n: NotificationOut): NotificationMeta {
  const text = `${n.title} ${n.message}`.toLowerCase();

  if (text.includes("deadline") || text.includes("counseling") || text.includes("option entry") || text.includes("verification")) {
    return {
      category: "deadlines",
      categoryLabel: "Counseling & Deadlines",
      badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      icon: Clock,
      actionLabel: "Explore Admissions",
      actionPath: "/admissions/india",
    };
  }

  if (text.includes("dossier") || text.includes("report") || text.includes("pdf")) {
    return {
      category: "reports",
      categoryLabel: "Official Dossier",
      badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
      icon: FileText,
      actionLabel: "View Reports",
      actionPath: "/reports",
    };
  }

  if (text.includes("scholarship") || text.includes("fee") || text.includes("reimbursement") || text.includes("nsp")) {
    return {
      category: "scholarships",
      categoryLabel: "Scholarship & Aid",
      badgeClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
      icon: GraduationCap,
      actionLabel: "Check Scholarships",
      actionPath: "/dashboard",
    };
  }

  if (text.includes("recommendation") || text.includes("cutoff") || text.includes("rank") || text.includes("calibrated")) {
    return {
      category: "recommendations",
      categoryLabel: "AI Recommendation",
      badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      icon: TrendingUp,
      actionLabel: "View Top Colleges",
      actionPath: "/dashboard",
    };
  }

  return {
    category: "general",
    categoryLabel: "Update",
    badgeClass: "bg-[var(--color-brand)]/15 text-[var(--color-brand)] border-[var(--color-brand)]/30",
    icon: Bell,
    actionLabel: "Go to Dashboard",
    actionPath: "/dashboard",
  };
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === "unread") return !n.is_read;
      if (activeTab === "all") return true;
      const meta = classifyNotification(n);
      return meta.category === activeTab;
    });
  }, [notifications, activeTab]);

  const tabs: { id: CategoryTab; label: string; count?: number }[] = [
    { id: "all", label: "All", count: notifications.length },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "deadlines", label: "Deadlines & Counseling" },
    { id: "recommendations", label: "Recommendations" },
    { id: "reports", label: "Reports" },
    { id: "scholarships", label: "Scholarships" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border-soft)] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl font-bold tracking-tight">Notifications & Alerts</h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[var(--color-brand)] px-2.5 py-0.5 text-xs font-semibold text-white shadow-xs">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
              Updates about your admissions recommendations, counseling schedules, and dossier reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={unreadCount === 0 || markAllReadMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3.5 py-2 text-xs font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <CheckCheck className="h-4 w-4 text-[var(--color-brand)]" />
              <span>Mark all as read</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[var(--color-brand)] text-white shadow-xs"
                    : "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive ? "bg-white/25 text-white" : "bg-[var(--color-surface-3)] text-[var(--color-ink)]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification Cards List */}
        <div className="space-y-3">
          {isLoading && <ListSkeleton />}

          {!isLoading && filteredNotifications.length === 0 && (
            <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] p-12 text-center shadow-xs">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]">
                <Inbox className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-[var(--color-ink)]">
                {activeTab === "unread" ? "You're all caught up!" : "No notifications in this category"}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--color-ink-dim)] max-w-sm mx-auto">
                {activeTab === "unread"
                  ? "All alerts and notifications have been read. When counseling rounds or recommendations update, they'll appear here."
                  : "Try selecting 'All' to view your general announcements, counseling schedules, and report alerts."}
              </p>
              {activeTab !== "all" && (
                <button
                  onClick={() => setActiveTab("all")}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-brand)] hover:underline"
                >
                  <Filter className="h-3.5 w-3.5" />
                  View all notifications
                </button>
              )}
            </div>
          )}

          {filteredNotifications.map((n) => {
            const meta = classifyNotification(n);
            const IconComponent = meta.icon;
            const timeAgo = formatRelativeTime(n.created_at);

            return (
              <div
                key={n.id}
                className={`group relative flex flex-col sm:flex-row items-start justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                  !n.is_read
                    ? "border-[var(--color-brand)]/40 bg-[var(--color-brand)]/5 dark:bg-[var(--color-brand)]/10 shadow-xs ring-1 ring-[var(--color-brand)]/20"
                    : "border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] hover:border-[var(--color-border)] hover:shadow-xs"
                }`}
              >
                {/* Unread Glowing Dot */}
                {!n.is_read && (
                  <span className="absolute top-4 right-4 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand)]"></span>
                  </span>
                )}

                {/* Left: Icon & Content */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
                      !n.is_read ? meta.badgeClass : "border-[var(--color-border-soft)] bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.badgeClass}`}
                      >
                        {meta.categoryLabel}
                      </span>
                      {timeAgo && (
                        <span className="text-[11px] font-medium text-[var(--color-ink-faint)]">
                          • {timeAgo}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm ${
                        !n.is_read
                          ? "font-semibold text-[var(--color-ink)]"
                          : "font-medium text-[var(--color-ink)]"
                      }`}
                    >
                      {n.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--color-ink-dim)] leading-relaxed">
                      {n.message}
                    </p>

                    {/* Quick Direct Link / Action */}
                    {meta.actionPath && (
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => navigate(meta.actionPath!)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand)] hover:underline"
                        >
                          <span>{meta.actionLabel}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions (Mark Read & Dismiss) */}
                <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                  {!n.is_read && (
                    <button
                      onClick={() => markReadMutation.mutate(n.id)}
                      disabled={markReadMutation.isPending}
                      title="Mark as read"
                      aria-label="Mark as read"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg)] text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-agent-green)] transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteMutation.mutate(n.id)}
                    disabled={deleteMutation.isPending}
                    title="Dismiss alert"
                    aria-label="Dismiss alert"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--color-border-soft)] bg-[var(--color-bg)] text-[var(--color-ink-faint)] hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
