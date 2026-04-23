import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { MainApp } from "./components/MainApp";
import { InstallPrompt } from "./components/InstallPrompt";

type AuthState = { email: string; token: string } | null;

export default function App() {
  const [auth, setAuth] = useState<AuthState>(null);

  return (
    <>
      {auth ? (
        <MainApp userEmail={auth.email} token={auth.token} onLogout={() => setAuth(null)} />
      ) : (
        <LoginScreen onLogin={(email, token) => setAuth({ email, token })} />
      )}
      <InstallPrompt />
    </>
  );
}