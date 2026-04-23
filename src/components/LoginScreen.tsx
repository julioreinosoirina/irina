import { useEffect, useState } from "react";
import { ALLOWED_DOMAIN, GOOGLE_CLIENT_ID } from "../config";

declare global {
  interface Window {
    google?: any;
  }
}

export function LoginScreen({ onLogin }: { onLogin: (email: string, token: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        setReady(true);
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  function login() {
    if (!window.google?.accounts?.oauth2) return;
    setLoading(true);
    setError("");
    window.google.accounts.oauth2
      .initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: [
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
        hosted_domain: ALLOWED_DOMAIN,
        callback: async (resp: { access_token?: string; error?: string }) => {
          if (resp.error || !resp.access_token) {
            setLoading(false);
            setError("No se pudo iniciar sesión. Intentá de nuevo.");
            return;
          }
          try {
            const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
              headers: { Authorization: `Bearer ${resp.access_token}` },
            });
            const user = (await userRes.json()) as { email?: string };
            const email = user.email ?? "";
            if (!email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)) {
              setLoading(false);
              setError(`Solo se permiten cuentas del dominio @${ALLOWED_DOMAIN}`);
              return;
            }
            onLogin(email, resp.access_token);
          } catch {
            setLoading(false);
            setError("Error al verificar la cuenta. Intentá de nuevo.");
          }
        },
      })
      .requestAccessToken({ prompt: "select_account" });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #fef3c7 0%, #fde68a 35%, #fff7ed 60%, #fff 100%)" }}>
      <div className="flex flex-col items-center pt-14 pb-8 px-6">
        <div className="mb-5">
          <img src="/logo.png" alt="Instituto Irina" className="w-24 h-24 object-contain drop-shadow-lg" style={{ borderRadius: "24px" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-amber-900 text-center leading-tight">Instituto Irina</h1>
        <p className="text-sm text-amber-700 text-center mt-1">Sistema de Gestión 2026</p>
      </div>
      <div className="flex-1 bg-white rounded-t-3xl shadow-xl px-6 pt-8 pb-10">
        <h2 className="text-base font-bold text-stone-800 mb-6 text-center">Ingresá con tu cuenta institucional</h2>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3">{error}</div>}
        <button
          onClick={login}
          disabled={loading || !ready}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-semibold text-sm border-2 border-stone-200 hover:border-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "#fff", color: "#1c1917" }}
        >
          {loading ? "Iniciando sesión..." : "Continuar con Google"}
        </button>
      </div>
    </div>
  );
}