import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  showShowcase?: boolean;
}

export function AuthLayout({ children, showShowcase = true }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col w-full overflow-hidden bg-[var(--color-bg)] font-sans">
      {/* Background Decorative Mesh & Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Glow 1 - Top Left */}
        <div className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-indigo-600/25 via-violet-600/20 to-transparent blur-[120px] dark:from-indigo-600/30 dark:via-purple-600/20" />
        {/* Glow 2 - Bottom Right */}
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-violet-600/25 via-cyan-500/15 to-transparent blur-[130px] dark:from-violet-600/25 dark:via-blue-600/15" />
        {/* Glow 3 - Center subtle accent */}
        <div className="absolute left-1/2 top-1/3 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[140px]" />

        {/* High-tech Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.25] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-ink-faint) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 flex h-18 w-full items-center justify-between px-6 lg:px-12">
        <Link
          to="/"
          className="group flex items-center gap-3 transition-transform hover:scale-[1.02]"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--color-brand)] via-indigo-600 to-[var(--color-violet)] text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <GraduationCap className="h-5 w-5 transition-transform group-hover:-rotate-6" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-[var(--color-ink)]">
                EduGuide <span className="text-[var(--color-brand)]">AI</span>
              </span>
              <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-brand)] dark:text-indigo-400">
                2.0
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-ink-faint)] leading-none">
              Smart Admissions Navigator
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)]/70 px-3 py-1 text-xs text-[var(--color-ink-dim)] backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>256-bit Encrypted</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {showShowcase ? (
          <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Visual Showcase (Visible on Large Screens) */}
            <div className="hidden lg:col-span-6 xl:col-span-6 lg:flex lg:flex-col lg:justify-center pr-4 xl:pr-10">
              
              {/* Pill Badge */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--color-brand)] dark:text-indigo-300 backdrop-blur-md shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                <span>Next-Gen Autonomous College Matching</span>
              </div>

              {/* Catchy Hero Heading */}
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-5xl leading-[1.15]">
                Turn your exam rank into your{" "}
                <span className="bg-gradient-to-r from-[var(--color-brand)] via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Dream University
                </span>
              </h2>

              <p className="mt-4 text-base text-[var(--color-ink-dim)] leading-relaxed">
                Comprehensive AI intelligence for EAPCET, JEE, NEET, KCET, SAT, IELTS, and 1,200+ institutions across India & top study-abroad destinations.
              </p>

              {/* Showcase Live Preview Cards */}
              <div className="mt-8 space-y-3.5">
                
                {/* Showcase Card 1: College Match */}
                <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)]/70 p-4 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:shadow-indigo-500/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-[var(--color-brand)]">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[var(--color-ink)]">
                            IIT Hyderabad · Computer Science
                          </h4>
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            96.8% Match
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-ink-dim)] mt-0.5">
                          Cutoff prediction based on latest state counselling rounds
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-lg bg-[var(--color-surface-2)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-violet)] border border-[var(--color-border-soft)]">
                      Target Tier
                    </span>
                  </div>
                </div>

                {/* Showcase Card 2: Scholarship */}
                <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface)]/70 p-4 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-violet-500/30 hover:shadow-violet-500/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[var(--color-ink)]">
                            State Merit & Fee Reimbursement
                          </h4>
                          <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                            ₹1,25,000 / yr
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-ink-dim)] mt-0.5">
                          Eligible based on category, district, and annual family income
                        </p>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  </div>
                </div>

                {/* Showcase Metrics Strip */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)]/60 p-3 text-center backdrop-blur-md">
                    <div className="font-display text-lg font-bold text-[var(--color-ink)]">
                      50,000+
                    </div>
                    <div className="text-[11px] text-[var(--color-ink-dim)]">Students Guided</div>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)]/60 p-3 text-center backdrop-blur-md">
                    <div className="font-display text-lg font-bold text-[var(--color-brand)]">
                      1,200+
                    </div>
                    <div className="text-[11px] text-[var(--color-ink-dim)]">Universities</div>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)]/60 p-3 text-center backdrop-blur-md">
                    <div className="font-display text-lg font-bold text-emerald-500">
                      ₹18 Cr+
                    </div>
                    <div className="text-[11px] text-[var(--color-ink-dim)]">Scholarships</div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Sleek Auth Form Container */}
            <div className="col-span-12 w-full lg:col-span-6 xl:col-span-6">
              <div className="mx-auto w-full max-w-[480px]">
                <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/85 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 transition-all">
                  {/* Subtle top card glow line */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-brand)] to-transparent opacity-80" />
                  
                  {children}
                </div>

                {/* Bottom Copyright & Security note */}
                <div className="mt-6 text-center text-xs text-[var(--color-ink-faint)] flex items-center justify-center gap-2">
                  <span>&copy; {new Date().getFullYear()} EduGuide AI Inc.</span>
                  <span>•</span>
                  <Link to="/" className="hover:underline hover:text-[var(--color-ink-dim)]">Privacy</Link>
                  <span>•</span>
                  <Link to="/" className="hover:underline hover:text-[var(--color-ink-dim)]">Terms</Link>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Centered Layout when Showcase is hidden (e.g. Verification Pending, Verified) */
          <div className="flex w-full items-center justify-center py-4">
            <div className="w-full max-w-[480px]">
              <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/85 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 dark:ring-white/5 transition-all">
                {/* Subtle top card glow line */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-brand)] to-transparent opacity-80" />
                
                {children}
              </div>

              {/* Bottom Copyright & Security note */}
              <div className="mt-6 text-center text-xs text-[var(--color-ink-faint)] flex items-center justify-center gap-2">
                <span>&copy; {new Date().getFullYear()} EduGuide AI Inc.</span>
                <span>•</span>
                <Link to="/" className="hover:underline hover:text-[var(--color-ink-dim)]">Privacy</Link>
                <span>•</span>
                <Link to="/" className="hover:underline hover:text-[var(--color-ink-dim)]">Terms</Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
