export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg tracking-tight">Aetheria</p>
          <p className="text-xs text-muted-foreground mt-1">
            Una wiki abierta sobre el mundo de Aetheria — escrita por sus viajeros.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Contenido bajo licencia Creative Commons · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
