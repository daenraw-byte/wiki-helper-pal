import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useSession } from "@/lib/use-session";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading } = useSession();

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-muted-foreground">Cargando…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Acceso restringido</p>
        <h1 className="font-display text-3xl mt-3">Inicia sesión para continuar</h1>
        <p className="text-sm text-muted-foreground mt-3">
          Necesitas una cuenta de cronista para escribir o editar entradas.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition"
        >
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  return <Outlet />;
}
