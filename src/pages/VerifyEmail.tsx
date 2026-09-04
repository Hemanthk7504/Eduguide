import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, GraduationCap, ArrowRight, RefreshCw } from "lucide-react";
import { verifyEmail, resendVerification } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

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
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] p-8 shadow-2xl text-center">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-violet)] shadow-md">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>

        {/* State: Loading */}
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[var(--color-brand)]" />
            <h2 className="text-xl font-bold tracking-tight">Verifying your email...</h2>
            <p className="text-sm text-[var(--color-ink-dim)]">
              Please wait while we confirm your account access.
            </p>
          </div>
        )}

        {/* State: Success */}
        {status === "success" && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 ring-8 ring-emerald-500/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
              Email Verified!
            </h2>
            <p className="text-sm text-[var(--color-ink-dim)]">{message}</p>
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Logging you in directly for the first time...
            </div>
            <div className="pt-2">
              <button
                onClick={() => navigate("/onboarding")}
                className="btn-primary w-full inline-flex items-center justify-center gap-2"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* State: Error */}
        {status === "error" && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/15 text-rose-500 ring-8 ring-rose-500/10">
              <XCircle className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-ink)]">
              Verification Failed
            </h2>
            <p className="text-sm text-[var(--color-ink-dim)]">{message}</p>

            {email && (
              <div className="pt-2 space-y-3">
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-xs"
                >
                  {resending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  <span>Resend Verification Email</span>
                </button>
                {resendStatus && (
                  <p className="text-xs text-[var(--color-brand)]">{resendStatus}</p>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-[var(--color-border-soft)]">
              <Link to="/login" className="text-xs font-semibold text-[var(--color-brand)] hover:underline">
                Back to Sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
