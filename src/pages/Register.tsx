import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GraduationCap,
  Loader2,
  Mail,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { register as registerUser, checkVerification, resendVerification } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { AuthLayout, Field } from "./Login";
import { GoogleSignInButton } from "../components/GoogleSignInButton";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<"form" | "verification_pending" | "verified">("form");
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [devVerifyLink, setDevVerifyLink] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const pollIntervalRef = useRef<any>(null);

  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // If navigated from login with pending verification
  useEffect(() => {
    if (location.state?.email) {
      setRegisteredEmail(location.state.email);
      if (location.state.verifyLink) {
        setDevVerifyLink(location.state.verifyLink);
      }
      setStep("verification_pending");
    }
  }, [location.state]);

  // Handle signup form submit
  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const res = await registerUser(values);
      setRegisteredEmail(values.email);
      if (res.verification_link) {
        setDevVerifyLink(res.verification_link);
      }
      setStep("verification_pending");
    } catch (err: any) {
      setServerError(err?.response?.data?.detail ?? "Couldn't create your account. Try again.");
    }
  }

  // Real-time polling to check if user clicked verify in email
  useEffect(() => {
    if (step !== "verification_pending" || !registeredEmail) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    async function checkStatus() {
      try {
        const res = await checkVerification(registeredEmail);
        if (res.is_verified && res.access_token) {
          // User clicked verify in email! Stop polling and auto-login
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStep("verified");

          // Store auth token so user is logged in directly for the first time
          setToken(res.access_token);

          // Redirect to onboarding after brief celebration animation
          setTimeout(() => {
            navigate("/onboarding");
          }, 1800);
        }
      } catch {
        // Continue polling silently
      }
    }

    // Poll every 2.5 seconds
    pollIntervalRef.current = setInterval(checkStatus, 2500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [step, registeredEmail, navigate, setToken]);

  // Handle cooldown timer for resending
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Handle manual resend
  async function handleResend() {
    if (cooldown > 0 || !registeredEmail) return;
    setResending(true);
    setResendStatus(null);
    try {
      const res = await resendVerification(registeredEmail);
      setResendStatus(res.message || "Verification email resent! Please check your inbox.");
      if (res.verification_link) {
        setDevVerifyLink(res.verification_link);
      }
      setCooldown(30);
    } catch (err: any) {
      setResendStatus(err?.response?.data?.detail || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  }

  // State 2: Verification Pending (Waiting for user to click email link)
  if (step === "verification_pending") {
    return (
      <AuthLayout>
        <div className="space-y-6 text-center animate-in fade-in duration-200">
          {/* Animated Mail Icon */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[var(--color-brand)] to-[var(--color-violet)] text-white shadow-xl shadow-[var(--color-brand)]/20">
            <Mail className="h-9 w-9" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Check your email</h1>
            <p className="mt-2 text-sm text-[var(--color-ink-dim)] leading-relaxed">
              We sent a verification link to <br />
              <strong className="font-semibold text-[var(--color-ink)] font-mono">{registeredEmail}</strong>
            </p>
          </div>

          {/* Real-time waiting indicator */}
          <div className="rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/60 p-4">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[var(--color-brand)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Waiting for confirmation...</span>
            </div>
            <p className="mt-1 text-[11px] text-[var(--color-ink-faint)]">
              Click the <strong>Verify</strong> button in your email. This page will{" "}
              <strong>automatically refresh and log you in</strong> on the spot!
            </p>
          </div>

          {/* Resend & Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-xs font-medium"
            >
              {resending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              <span>
                {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend verification email"}
              </span>
            </button>

            {resendStatus && (
              <p className="text-xs text-[var(--color-brand)] animate-in fade-in">{resendStatus}</p>
            )}

            {/* Test helper link if SMTP credentials are still pending */}
            {devVerifyLink && (
              <div className="pt-2">
                <a
                  href={devVerifyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Open Verification Link (Instant Test)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--color-border-soft)] pt-4">
            <button
              onClick={() => {
                setStep("form");
                setServerError(null);
              }}
              className="text-xs text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
            >
              ← Entered the wrong email? Start over
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // State 3: Verified! Auto-logging in
  if (step === "verified") {
    return (
      <AuthLayout>
        <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 ring-8 ring-emerald-500/10">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
              Email Verified!
            </h1>
            <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
              Your account has been activated successfully.
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Logging you in directly for the first time...</span>
          </div>
          <button
            onClick={() => navigate("/onboarding")}
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </AuthLayout>
    );
  }

  // State 1: Registration Form
  return (
    <AuthLayout>
      <div className="mb-6 flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)]">
          <GraduationCap className="h-5 w-5 text-white" />
        </span>
        <span className="font-display text-xl font-semibold">EduGuide AI</span>
      </div>
      <h1 className="font-display text-2xl font-semibold">Create your account</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-dim)]">
        Enter your details to receive an instant verification link.
      </p>

      {/* Google Sign-up Button */}
      <div className="mt-6">
        <GoogleSignInButton
          text="Sign up with Google"
          onSuccess={(token) => {
            setToken(token);
            navigate("/onboarding");
          }}
          onVerificationRequired={(email, verifyLink) => {
            setRegisteredEmail(email);
            if (verifyLink) setDevVerifyLink(verifyLink);
            setStep("verification_pending");
          }}
          onError={(msg) => setServerError(msg)}
        />
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border-soft)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--color-bg-raised)] px-2 text-[var(--color-ink-faint)]">
            Or register with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Full name" error={errors.full_name?.message}>
          <input className="input" placeholder="Hemanth Kumar" {...field("full_name")} />
        </Field>
        <Field label="Email address" error={errors.email?.message}>
          <input type="email" className="input" placeholder="you@example.com" {...field("email")} />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input pr-10"
              placeholder="At least 8 characters"
              {...field("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        {serverError && (
          <p className="rounded-lg bg-[var(--color-agent-red)]/10 px-3 py-2 text-sm text-[var(--color-agent-red)]">
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending verification email...
            </span>
          ) : (
            <span>Create account & Send Verification Email</span>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-ink-dim)]">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
