import { useState } from "react";
import { Loader2 } from "lucide-react";
import { googleAuth } from "../api/auth";

interface GoogleSignInButtonProps {
  text?: string;
  onSuccess: (accessToken: string) => void;
  onVerificationRequired: (email: string) => void;
  onError: (errorMsg: string) => void;
}

async function ensureGoogleLoaded(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if ((window as any).google?.accounts?.oauth2) return true;

  return new Promise((resolve) => {
    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const checkInterval = setInterval(() => {
      if ((window as any).google?.accounts?.oauth2) {
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 100);

    script.addEventListener("load", () => {
      clearInterval(checkInterval);
      resolve(true);
    });

    setTimeout(() => {
      clearInterval(checkInterval);
      resolve(!!(window as any).google?.accounts?.oauth2);
    }, 4000);
  });
}

export function GoogleSignInButton({
  text = "Continue with Google",
  onSuccess,
  onVerificationRequired,
  onError,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  async function handleGoogleOAuthClick() {
    if (!googleClientId) {
      onError("Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in .env.");
      return;
    }

    setLoading(true);

    const isLoaded = await ensureGoogleLoaded();
    if (!isLoaded) {
      setLoading(false);
      onError("Unable to connect to Google Identity Services. Check your internet connection or ad-blocker.");
      return;
    }

    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "email profile openid",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setLoading(false);
            if (tokenResponse.error !== "access_denied") {
              onError(`Google Sign-in failed: ${tokenResponse.error_description || tokenResponse.error}`);
            }
            return;
          }

          try {
            // Retrieve verified user profile directly from Google's OAuth2 userinfo endpoint
            const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const googleProfile = await profileRes.json();

            if (!googleProfile.email) {
              throw new Error("Unable to retrieve email from Google Account.");
            }

            // Authenticate with EduGuide Backend
            const res = await googleAuth({
              email: googleProfile.email,
              full_name: googleProfile.name || googleProfile.email.split("@")[0],
              token: tokenResponse.access_token,
            });

            if (!res.is_verified) {
              // Enforce email verification via SMTP even for Google OAuth
              onVerificationRequired(googleProfile.email);
            } else if (res.access_token) {
              onSuccess(res.access_token);
            }
          } catch (err: any) {
            onError(err?.response?.data?.detail || err.message || "Failed to process Google sign-in.");
          } finally {
            setLoading(false);
          }
        },
      });

      client.requestAccessToken();
    } catch (err: any) {
      setLoading(false);
      onError(`Failed to launch Google OAuth: ${err.message}`);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleGoogleOAuthClick}
      className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-border-soft)] bg-[var(--color-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] shadow-2xs transition-all hover:bg-[var(--color-surface-2)] hover:border-[var(--color-border)] active:scale-[0.99] disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-[var(--color-brand)]" />
      ) : (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      )}
      <span>{text}</span>
    </button>
  );
}
