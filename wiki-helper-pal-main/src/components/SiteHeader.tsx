import { Link } from "@tanstack/react-router";
import { useSession } from "@/lib/use-session";
import { supabase } from "@/integrations/supabase/client";
import { Plus, LogOut } from "lucide-react";

export function SiteHeader() {
  const { user } = useSession();

  return (
    <header className="border-b border-border/70 bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-xl tracking-tight">Aetheria</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground border-l border-border pl-2">
            Wiki
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-sm">
          <Link
            to="/"
            className="px-4 py-1.5 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 shadow-sm transition-colors"
            activeOptions={{ exact: true }}
            activeProps={{ className: "px-4 py-1.5 rounded-full bg-background border border-foreground/60 text-foreground shadow-sm transition-colors" }}
          >
            Inicio
          </Link>
          <a
            href="/#categorias"
            className="px-4 py-1.5 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 shadow-sm transition-colors"
          >
            Categorías
          </a>
          <div className="relative group">
            <button
              type="button"
              className="px-4 py-1.5 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 shadow-sm transition-colors inline-flex items-center gap-1"
            >
              Mundo
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-60">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-opacity z-50">
              <div className="min-w-[180px] rounded-xl border border-border bg-background shadow-lg p-1.5">
                <a
                  href="/categoria/territorios"
                  className="block px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Territorios
                </a>
              </div>
            </div>
          </div>
          <a
            href="/categoria/personajes"
            className="px-4 py-1.5 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 shadow-sm transition-colors"
          >
            Personajes
          </a>
          <a
            href="/#articulos"
            className="px-4 py-1.5 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 shadow-sm transition-colors"
          >
            Artículos
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/nuevo"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-foreground text-background hover:opacity-90 transition"
              >
                <Plus size={14} /> Nuevo
              </Link>
              <Link to="/perfil" className="text-sm hover:text-accent transition-colors">
                Mi perfil
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                aria-label="Cerrar sesión"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium px-3 py-1.5 rounded-md border border-foreground/80 hover:bg-foreground hover:text-background transition"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
