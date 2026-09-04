import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  UserCog,
  LogOut,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Shield,
  FileCheck,
  Globe2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { listProfiles } from "../api/profiles";

export function UserProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch active student profile for badge info
  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: listProfiles,
    enabled: !!user,
  });

  const activeProfile = profiles && profiles.length > 0 ? profiles[profiles.length - 1] : null;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!user) return null;

  const initial = (user.full_name || user.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Gmail-style circular profile avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="EduGuide Account Menu"
        aria-expanded={isOpen}
        className="group relative flex h-9 w-9 items-center justify-center rounded-full p-0.5 transition-all duration-200 hover:ring-4 hover:ring-[var(--color-brand)]/20 focus:outline-none focus:ring-4 focus:ring-[var(--color-brand)]/30"
        title={`EduGuide Account\n${user.full_name}\n${user.email}`}
      >
        {/* Colorful gradient avatar ring */}
        <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-[var(--color-brand)] via-[var(--color-violet)] to-[var(--color-agent-teal)] text-sm font-semibold text-white shadow-sm ring-2 ring-[var(--color-bg)]">
          {initial}
        </span>
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-bg)] bg-emerald-500" />
      </button>

      {/* Gmail-style floating account popover card */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-84 sm:w-92 overflow-hidden rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] shadow-2xl ring-1 ring-black/10 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Top Wallpaper Header */}
          <div className="relative h-24 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3">
            {/* Subtle decorative mesh overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px] opacity-20" />
            <div className="relative flex items-center justify-between text-xs font-medium text-white/90">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-0.5 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-amber-300" />
                EduGuide Account
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] tracking-wide uppercase">
                {user.role === "admin" ? "Admin" : "Student"}
              </span>
            </div>
          </div>

          {/* User Profile Details (Overlapping Wallpaper) */}
          <div className="relative px-6 pb-5 pt-0 text-center">
            {/* Large Centered Avatar */}
            <div className="mx-auto -mt-11 mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--color-bg-raised)] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-2xl font-bold text-white shadow-lg">
              {initial}
            </div>

            <h3 className="text-base font-semibold tracking-tight text-[var(--color-ink)]">
              {user.full_name}
            </h3>
            <p className="mt-0.5 text-xs text-[var(--color-ink-faint)] font-mono">{user.email}</p>

            {/* Active Student Profile Summary Pill */}
            {activeProfile && (
              <div className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-3 py-1 text-xs text-[var(--color-ink-dim)]">
                <GraduationCap className="h-3.5 w-3.5 shrink-0 text-[var(--color-brand)]" />
                <span className="truncate">
                  {activeProfile.state || activeProfile.country || "India"}
                  {activeProfile.entrance_rank ? ` · Rank #${activeProfile.entrance_rank.toLocaleString()}` : ""}
                  {activeProfile.target_degree ? ` · ${activeProfile.target_degree}` : ""}
                </span>
              </div>
            )}

            {/* Google-style "Manage Profile & Settings" pill button */}
            <div className="mt-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate(activeProfile ? `/profile-settings/${activeProfile.id}` : "/profile-settings");
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-bg)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] shadow-xs transition-all hover:bg-[var(--color-surface-2)] hover:border-[var(--color-brand)]/40 hover:text-[var(--color-brand)]"
              >
                <UserCog className="h-4 w-4" />
                <span>Profile Settings & Preferences</span>
              </button>
            </div>

            {/* Quick Navigation Shortcuts */}
            <div className="mt-4 space-y-1 text-left">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admissions/india");
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-orange-500/15 text-orange-500">
                    🇮🇳
                  </span>
                  India Admissions Directory
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admissions/international");
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-blue-500/15 text-blue-500">
                    <Globe2 className="h-3.5 w-3.5" />
                  </span>
                  International Admissions (Study Abroad)
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/reports");
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-500/15 text-emerald-500">
                    <FileCheck className="h-3.5 w-3.5" />
                  </span>
                  My Downloaded Counseling Reports
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              </button>

              {user.role === "admin" && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/admin");
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-purple-500/15 text-purple-500">
                      <Shield className="h-3.5 w-3.5" />
                    </span>
                    Admin Console
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-[var(--color-border-soft)]" />

            {/* Bottom Sign Out */}
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-[var(--color-agent-red)] hover:bg-[var(--color-agent-red)]/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out of EduGuide</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
