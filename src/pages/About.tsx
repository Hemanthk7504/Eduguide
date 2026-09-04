import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Target,
  Compass,
  CheckCircle2,
  HeartHandshake,
  TrendingUp,
  Database,
  Lock,
  ArrowRight,
  Award,
} from "lucide-react";
import { PublicNav } from "../components/PublicNav";
import { PublicFooter } from "../components/PublicFooter";
import { useAuth } from "../hooks/useAuth";

export default function About() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)] selection:bg-[var(--color-brand)] selection:text-white">
      <PublicNav />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-14 pb-20 md:pt-24 md:pb-28">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[var(--color-brand)]/20 to-[var(--color-violet)]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 px-4 py-1.5 text-xs font-medium text-[var(--color-brand-hover)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-violet)]" />
            <span>Democratizing Higher Education in India</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Empowering Every Student With{" "}
            <span className="bg-gradient-to-r from-[var(--color-brand)] via-[var(--color-violet)] to-purple-400 bg-clip-text text-transparent">
              Honest, Data-Backed Counseling
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-ink-dim)] leading-relaxed max-w-3xl mx-auto">
            Higher education decisions shape the next 40 years of a student's life. We replace commission-driven admission agencies with transparent, autonomous multi-agent AI that works purely in the student's best interest.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="btn-primary py-3 px-6 text-sm font-semibold shadow-lg shadow-[var(--color-brand)]/25 inline-flex items-center gap-2"
            >
              <span>{isAuthenticated ? "Go to Dashboard" : "Start Free Assessment"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="btn-secondary py-3 px-6 text-sm font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem & Our Mission */}
      <section className="py-16 bg-[var(--color-surface)] border-y border-[var(--color-border-soft)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
                <Target className="h-4 w-4" />
                <span>The Challenge</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Why Traditional College Counseling is Broken
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-[var(--color-ink-dim)] leading-relaxed">
                <p>
                  Every year, over 3 million Indian students take high-stakes entrance exams like JEE, EAMCET, and NEET. Yet when counseling begins, students and parents face intense anxiety: confusing seat matrices, volatile cutoff shifts, and dozens of confusing quota categories.
                </p>
                <p>
                  Worse yet, traditional admission consultancies operate on commissions—charging families ₹20,000 to ₹50,000 while quietly steering students toward private institutions that pay the highest marketing kickbacks.
                </p>
                <p className="font-medium text-[var(--color-ink)]">
                  EduGuide AI was founded to eliminate this conflict of interest. We built an autonomous counseling engine that evaluates universities purely on merit, ROI, student preference, and authentic placement track records.
                </p>
              </div>
            </div>

            {/* Impact Metric Card Showcase */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-6 border border-[var(--color-border)] space-y-2">
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--color-brand)]">
                  520+
                </div>
                <div className="font-semibold text-sm text-[var(--color-ink)]">Institutes Ingested</div>
                <p className="text-xs text-[var(--color-ink-dim)]">
                  NIRF ranked, AICTE approved, and state autonomous colleges.
                </p>
              </div>

              <div className="card p-6 border border-[var(--color-border)] space-y-2">
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--color-violet)]">
                  10+ Yrs
                </div>
                <div className="font-semibold text-sm text-[var(--color-ink)]">Cutoff Benchmarks</div>
                <p className="text-xs text-[var(--color-ink-dim)]">
                  Historical round 1, round 2, and mop-up closing ranks.
                </p>
              </div>

              <div className="card p-6 border border-[var(--color-border)] space-y-2">
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">
                  ₹4.8 Cr+
                </div>
                <div className="font-semibold text-sm text-[var(--color-ink)]">Scholarships Mapped</div>
                <p className="text-xs text-[var(--color-ink-dim)]">
                  State welfare fee waivers & merit grants unlocked.
                </p>
              </div>

              <div className="card p-6 border border-[var(--color-border)] space-y-2">
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-amber-400">
                  0%
                </div>
                <div className="font-semibold text-sm text-[var(--color-ink)]">Commercial Bias</div>
                <p className="text-xs text-[var(--color-ink-dim)]">
                  Zero sponsored college placements. 100% data integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Our Technology Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-violet)]">
              <Cpu className="h-4 w-4" />
              <span>Multi-Agent System Architecture</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Behind the Intelligence
            </h2>
            <p className="text-sm text-[var(--color-ink-dim)]">
              Our backend leverages modern Agentic AI workflows coordinated via LangGraph and FastAPI, backed by vector retrieval for absolute accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 border border-[var(--color-border-soft)] space-y-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
                1. Knowledge Base & RAG
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-ink-dim)] leading-relaxed">
                We continuously parse and vectorize official state admission government orders, JoSAA/CSAB opening-closing ranks, and NIRF 2024 metric disclosures into ChromaDB. Every recommendation is anchored in factual citations.
              </p>
            </div>

            <div className="card p-6 border border-[var(--color-border-soft)] space-y-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
                2. Autonomous Agents
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-ink-dim)] leading-relaxed">
                Rather than an all-in-one generic prompt, our Coordinator Agent delegates tasks across five isolated micro-agents (Profile Analyzer, College Predictor, Branch Specialist, Scholarship Hunter, and Advisor).
              </p>
            </div>

            <div className="card p-6 border border-[var(--color-border-soft)] space-y-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
                3. Probabilistic Modeling
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-ink-dim)] leading-relaxed">
                Instead of simply matching numbers, our model computes standard deviations of cutoff movements over multi-year cycles to deliver realistic 4-tier bands: Dream, Reach, Match, and Safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 bg-[var(--color-surface)] border-t border-[var(--color-border-soft)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
              <ShieldCheck className="h-4 w-4" />
              <span>Ethical Standards</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Our Core Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 border border-[var(--color-border-soft)] flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-base font-bold text-[var(--color-ink)]">
                  Zero Commercial Sponsorship
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-ink-dim)] leading-relaxed">
                  Colleges cannot pay us to rank higher or appear first in search results. Our recommendations are strictly determined by student profile metrics, cutoff probability, and NIRF benchmarks.
                </p>
              </div>
            </div>

            <div className="card p-6 border border-[var(--color-border-soft)] flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-base font-bold text-[var(--color-ink)]">
                  Affordability & Inclusivity
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-ink-dim)] leading-relaxed">
                  We actively highlight government fee-reimbursement programs (e.g. TS ePASS, Jagananna Vidya Deevena) and private merit scholarships so that financial constraints never prevent talented students from earning their degrees.
                </p>
              </div>
            </div>

            <div className="card p-6 border border-[var(--color-border-soft)] flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Lock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-base font-bold text-[var(--color-ink)]">
                  Student Privacy By Default
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-ink-dim)] leading-relaxed">
                  We do not sell student phone numbers, email addresses, or academic records to aggressive telecallers or marketing brokers. Your counseling profile belongs to you.
                </p>
              </div>
            </div>

            <div className="card p-6 border border-[var(--color-border-soft)] flex gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-base font-bold text-[var(--color-ink)]">
                  Future-Proof Career Focus
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-ink-dim)] leading-relaxed">
                  We don't just look at past prestige—we look forward. Our branch advisor assesses emerging technology shifts (Generative AI, VLSI, Green Energy) to ensure your major remains in high demand through 2030 and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Start Your College Journey with EduGuide AI
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-ink-dim)] max-w-xl mx-auto">
            Take the guesswork out of counseling. Get an instant, data-backed assessment of your admission probabilities today.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="btn-primary py-3.5 px-8 text-sm font-semibold shadow-lg shadow-[var(--color-brand)]/25 inline-flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isAuthenticated ? "Go to Dashboard" : "Create Free Account"}</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
