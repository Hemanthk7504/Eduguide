import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Mail,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
} from "lucide-react";
import { register as registerUser, checkVerification, resendVerification } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { AuthLayout } from "../components/AuthLayout";

const schema = z.object({
  full_name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<"form" | "verification_pending" | "verified">("form");
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const pollIntervalRef = useRef<any>(null);

  const {
    register: field,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const passwordValue = watch("password", "");

  // If navigated from login with pending verification
  useEffect(() => {
    if (location.state?.email) {
      setRegisteredEmail(location.state.email);
      setStep("verification_pending");
    }
  }, [location.state]);

  // Handle signup form submit
  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await registerUser(values);
      setRegisteredEmail(values.email);
      setStep("verification_pending");
    } catch (err: any) {
      setServerError(err?.response?.data?.detail ?? "Couldn't create your account. Please try again.");
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
          // User verified! Auto-login
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStep("verified");
          setToken(res.access_token);

          // Redirect to onboarding after quick celebratory animation
          setTimeout(() => {
            navigate("/onboarding");
          }, 1800);
        }
      } catch {
        // Silently continue polling
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
      setCooldown(30);
    } catch (err: any) {
      setResendStatus(err?.response?.data?.detail || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  }

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!passwordValue) return 0;
    let score = 0;
    if (passwordValue.length >= 8) score += 1;
    if (/[A-Z]/.test(passwordValue) || /[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    return score;
  };
  const strength = getPasswordStrength();

  // ----------------------------------------------------
  // STATE 2: Verification Pending (Waiting for confirmation)
  // ----------------------------------------------------
  if (step === "verification_pending") {
    return (
      <AuthLayout showShowcase={false}>
        <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
          
          {/* Animated Mail Icon with Radar Rings */}
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
            <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--color-brand)] to-[var(--color-violet)] text-white shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/20">
              <Mail className="h-8 w-8" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-[var(--color-brand)] dark:text-indigo-300">
              <Sparkles className="h-3 w-3" />
              <span>Email Sent</span>
            </div>
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-ink)]">
              Check your email
            </h1>
            <p className="mt-2 text-sm text-[var(--color-ink-dim)] leading-relaxed">
              We just sent an activation link to:
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] px-3.5 py-1.5 text-xs font-mono font-semibold text-[var(--color-ink)] shadow-2xs">
              <Mail className="h-3.5 w-3.5 text-[var(--color-brand)]" />
              <span>{registeredEmail}</span>
            </div>
          </div>

          {/* Real-time Listening Status Box */}
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-2)]/60 p-4.5 text-left backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--color-brand)] dark:text-indigo-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Waiting for confirmation...</span>
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-ink-dim)] leading-relaxed">
              Click the <strong>Verify</strong> link in your email. This page will <strong>automatically refresh and log you in</strong> on the spot!
            </p>
          </div>

          {/* Resend & Action Buttons */}
          <div className="space-y-3 pt-1">
            <button
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5"
            >
              {resending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-brand)]" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              <span>
                {cooldown > 0 ? `Resend email in ${cooldown}s` : "Resend verification email"}
              </span>
            </button>

            {resendStatus && (
              <p className="text-xs font-medium text-[var(--color-brand)] animate-in fade-in">
                {resendStatus}
              </p>
            )}


          </div>

          <div className="border-t border-[var(--color-border-soft)] pt-4">
            <button
              onClick={() => {
                setStep("form");
                setServerError(null);
              }}
              className="text-xs font-medium text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
            >
              ← Entered the wrong email? Start over
            </button>
          </div>

        </div>
      </AuthLayout>
    );
  }

  // ----------------------------------------------------
  // STATE 3: Verified! Auto-logging in
  // ----------------------------------------------------
  if (step === "verified") {
    return (
      <AuthLayout showShowcase={false}>
        <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
          
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-500/20">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-ink)]">
              Email Verified!
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">
              Your account has been activated successfully. Welcome to EduGuide AI!
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Logging you in directly for the first time...</span>
          </div>

          <button
            onClick={() => navigate("/onboarding")}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99]"
          >
            <span>Proceed to Onboarding</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

        </div>
      </AuthLayout>
    );
  }

  // ----------------------------------------------------
  // STATE 1: Registration Form
  // ----------------------------------------------------
  return (
    <AuthLayout>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[var(--color-brand)]/15 to-violet-500/15 px-2.5 py-1 text-xs font-semibold text-[var(--color-brand)] dark:text-indigo-300">
            <Sparkles className="h-3 w-3" />
            <span>Get Started · Free Access</span>
          </div>
          <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-ink)]">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">
            Join thousands of students finding their dream colleges & scholarships.
          </p>
        </div>

        {/* Google One-Tap Action */}
        <div>
          <GoogleSignInButton
            text="Sign up with Google"
            onSuccess={(token) => {
              setToken(token);
              navigate("/onboarding");
            }}
            onVerificationRequired={(email) => {
              setRegisteredEmail(email);
              setStep("verification_pending");
            }}
            onError={(msg) => setServerError(msg)}
          />
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border-soft)]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-[var(--color-surface)] px-3 text-[var(--color-ink-faint)] font-medium">
              Or register with email
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Full Name Field */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
              Full Name
            </label>
            <div className={`input-group ${errors.full_name ? "has-error" : ""}`}>
              <User className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
              <input
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                {...field("full_name")}
              />
            </div>
            {errors.full_name && (
              <p className="mt-1 text-xs font-medium text-[var(--color-agent-red)] flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
              Email Address
            </label>
            <div className={`input-group ${errors.email ? "has-error" : ""}`}>
              <Mail className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...field("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-[var(--color-agent-red)] flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-ink-dim)]">
              Password
            </label>
            <div className={`input-group ${errors.password ? "has-error" : ""}`}>
              <Lock className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                {...field("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 rounded-md p-0.5 text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Dynamic Password Strength Indicator */}
            {passwordValue && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1.5">
                  <div
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      strength >= 1 ? "bg-amber-500" : "bg-[var(--color-border-soft)]"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      strength >= 2 ? "bg-indigo-500" : "bg-[var(--color-border-soft)]"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      strength >= 3 ? "bg-emerald-500" : "bg-[var(--color-border-soft)]"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[var(--color-ink-faint)]">
                  <span>Strength</span>
                  <span className="font-semibold text-[var(--color-ink-dim)]">
                    {strength === 1 ? "Weak" : strength === 2 ? "Good" : strength === 3 ? "Strong" : ""}
                  </span>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-xs font-medium text-[var(--color-agent-red)] flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Server Error Message */}
          {serverError && (
            <div className="rounded-xl border border-[var(--color-agent-red)]/20 bg-[var(--color-agent-red)]/10 p-3.5 text-xs text-[var(--color-agent-red)] flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{serverError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-[var(--color-brand)] to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/35 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending verification email...</span>
              </>
            ) : (
              <>
                <span>Create Account & Verify</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="pt-2 text-center">
          <p className="text-xs sm:text-sm text-[var(--color-ink-dim)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors underline-offset-4 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
