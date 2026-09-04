import { type ReactNode } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Globe2,
  MessageCircle,
  FileText,
  Bell,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { listNotifications } from "../api/misc";
import { ThemeToggle } from "./ThemeToggle";
import { UserProfileMenu } from "./UserProfileMenu";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admissions/india", label: "India Admissions", icon: Building2 },
  { to: "/admissions/international", label: "International Admissions", icon: Globe2 },
  { to: "/chat", label: "AI Guidance Chat", icon: MessageCircle },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(),
    staleTime: 30000,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Clean Desktop Sidebar without broken icon glitch */}
      <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-[var(--color-border-soft)] bg-[var(--color-bg-raised)]/70 backdrop-blur-md">
        {/* Brand Header */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2.5 px-5 py-5 text-left transition-opacity hover:opacity-90"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[var(--color-brand)] via-indigo-600 to-[var(--color-violet)] shadow-md shadow-[var(--color-brand)]/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <div>
            <span className="block font-display text-lg font-bold tracking-tight">EduGuide AI</span>
            <span className="block text-[10px] font-medium text-[var(--color-ink-faint)] tracking-wider uppercase">
              Admissions Portal
            </span>
          </div>
        </button>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5 px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--color-brand)]/15 text-[var(--color-brand)] font-semibold ring-1 ring-inset ring-[var(--color-brand)]/30"
                    : "text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
              {item.to === "/notifications" && unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-[var(--color-brand)] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--color-agent-purple)]/15 text-[var(--color-agent-purple)] font-semibold ring-1 ring-inset ring-[var(--color-agent-purple)]/30"
                    : "text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                }`
              }
            >
              <ShieldCheck className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              <span>Admin Console</span>
            </NavLink>
          )}
        </nav>

        {/* Admissions Quick Hub Card in Sidebar */}
        <div className="p-3 m-3 rounded-2xl border border-[var(--color-border-soft)] bg-gradient-to-br from-[var(--color-surface-2)]/60 to-transparent">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ink)]">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Dual Admissions Hub</span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--color-ink-faint)] leading-relaxed">
            Switch between Indian State CETs and Global Study Abroad rankings anytime.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <button
              onClick={() => navigate("/admissions/india")}
              className={`flex-1 rounded-lg px-2 py-1 text-[10px] font-semibold transition-all ${
                location.pathname.includes("/india")
                  ? "bg-orange-500 text-white shadow-xs"
                  : "bg-[var(--color-bg)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              🇮🇳 India
            </button>
            <button
              onClick={() => navigate("/admissions/international")}
              className={`flex-1 rounded-lg px-2 py-1 text-[10px] font-semibold transition-all ${
                location.pathname.includes("/international")
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-[var(--color-bg)] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              🌍 Abroad
            </button>
          </div>
        </div>

        {/* Sidebar Bottom Profile Card */}
        <div className="border-t border-[var(--color-border-soft)] p-3">
          <div className="flex items-center justify-between rounded-xl px-2 py-1.5 hover:bg-[var(--color-surface-2)] transition-colors">
            <div className="min-w-0 pr-2">
              <p className="truncate text-xs font-semibold text-[var(--color-ink)]">{user?.full_name}</p>
              <p className="truncate text-[11px] text-[var(--color-ink-faint)] font-mono">{user?.email}</p>
            </div>
            <UserProfileMenu />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Universal Top Header Bar (Desktop & Mobile) with Gmail-Style Right-Side Profile Button */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--color-border-soft)] bg-[var(--color-bg)]/80 px-4 md:px-8 backdrop-blur-md">
          {/* Mobile Logo / Desktop Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 md:hidden"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)]">
                <GraduationCap className="h-4 w-4 text-white" />
              </span>
              <span className="font-display text-base font-bold">EduGuide</span>
            </button>

            {/* Quick Switch Pills for India vs International */}
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] p-1 text-xs">
              <NavLink
                to="/admissions/india"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-all ${
                    isActive
                      ? "bg-[var(--color-bg-raised)] text-[var(--color-ink)] shadow-xs font-semibold"
                      : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  }`
                }
              >
                <span>🇮🇳</span>
                <span>India Admissions</span>
              </NavLink>

              <NavLink
                to="/admissions/international"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-all ${
                    isActive
                      ? "bg-[var(--color-bg-raised)] text-[var(--color-ink)] shadow-xs font-semibold"
                      : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  }`
                }
              >
                <span>🌍</span>
                <span>International Admissions</span>
              </NavLink>
            </div>
          </div>

          {/* Right Side Controls: Notifications, Theme, and Gmail-Style Profile Button with Wallpaper */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-full text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors"
              title={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-[var(--color-bg)]"></span>
                </span>
              )}
            </button>

            <ThemeToggle />

            <div className="h-5 w-px bg-[var(--color-border-soft)] mx-0.5" />

            {/* Gmail-Style Profile Button & Floating Account Menu */}
            <UserProfileMenu />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
