import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { username: username || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("¡Bienvenido a Aetheria!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Sesión iniciada");
      }
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Ha ocurrido un error");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (res.error) toast.error(res.error.message);
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Cronistas de Aetheria</p>
        <h1 className="font-display text-4xl mt-3">
          {mode === "signin" ? "Volver a entrar" : "Únete al compendio"}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {mode === "signin"
            ? "Continúa escribiendo el mundo donde lo dejaste."
            : "Crea tu cuenta para escribir y editar entradas."}
        </p>
      </div>

      <button
        onClick={onGoogle}
        className="w-full border border-border rounded-md py-2.5 text-sm font-medium hover:bg-secondary transition flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C41.5 35.4 44 30 44 24c0-1.3-.1-2.4-.4-3.5z"/>
        </svg>
        Continuar con Google
      </button>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">o</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">
              Nombre de autor
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="vael_cronista"
              className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">
            Correo
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">
            Contraseña
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Cargando…" : mode === "signin" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-muted-foreground">
        {mode === "signin" ? "¿Sin cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-accent hover:underline"
        >
          {mode === "signin" ? "Crea una" : "Entra"}
        </button>
      </p>
    </div>
  );
}
