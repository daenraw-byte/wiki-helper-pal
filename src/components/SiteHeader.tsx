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
