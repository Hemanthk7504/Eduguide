import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { verifyEmail, resendVerification } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { AuthLayout } from "../components/AuthLayout";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your email address...");
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token. Please check the link from your email.");
      return;
    }

    let isMounted = true;

    async function handleVerify() {
      try {
        const data = await verifyEmail(token!, email || undefined);
        if (!isMounted) return;

        setStatus("success");
        setMessage(data.message || "Your email has been verified successfully!");

        // Auto-login directly for the first time
        if (data.access_token) {
          setToken(data.access_token);
          // Redirect after 2 seconds
          setTimeout(() => {
            navigate("/onboarding");
          }, 2000);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus("error");
        setMessage(
          err?.response?.data?.detail ||
            "Verification link has expired or is invalid. Please request a new link."
        );
      }
    }

    handleVerify();

    return () => {
      isMounted = false;
    };
  }, [token, email, navigate, setToken]);

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setResendStatus(null);
    try {
      const res = await resendVerification(email);
      setResendStatus(res.message || "Verification email resent! Please check your inbox.");
    } catch (err: any) {
      setResendStatus(err?.response?.data?.detail || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout showShowcase={false}>
      <div className="space-y-6 text-center">
        
        {/* State: Loading */}
        {status === "loading" && (
          <div className="space-y-5 py-4">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--color-brand)] to-[var(--color-violet)] text-white shadow-xl shadow-indigo-500/25">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--color-ink)]">
                Verifying your account
              </h2>
              <p className="mt-1.5 text-sm text-[var(--color-ink-dim)]">
                Please wait while we confirm your email token and activate your profile...
              </p>
            </div>
          </div>
        )}

        {/* State: Success */}
        {status === "success" && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25 ring-4 ring-emerald-500/20">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Account Activated</span>
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-ink)]">
                Email Verified!
              </h2>
              <p className="mt-1.5 text-sm text-[var(--color-ink-dim)] leading-relaxed">
                {message}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Redirecting you to onboarding...</span>
            </div>

            <button
              onClick={() => navigate("/onboarding")}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99]"
            >
              <span>Continue to Onboarding</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}

        {/* State: Error */}
        {status === "error" && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-xl shadow-rose-500/25 ring-4 ring-rose-500/20">
              <XCircle className="h-10 w-10" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-ink)]">
                Verification Failed
              </h2>
              <p className="mt-1.5 text-sm text-[var(--color-ink-dim)] leading-relaxed">
                {message}
              </p>
            </div>

            {email && (
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5"
                >
                  {resending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-brand)]" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  <span>Resend Verification Email</span>
                </button>
                {resendStatus && (
                  <p className="text-xs font-medium text-[var(--color-brand)] animate-in fade-in">
                    {resendStatus}
                  </p>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-[var(--color-border-soft)]">
              <Link
                to="/login"
                className="text-xs font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors underline-offset-4 hover:underline"
              >
                Back to Sign in
              </Link>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}
