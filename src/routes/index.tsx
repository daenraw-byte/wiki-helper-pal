import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aetheria — Wiki del mundo" },
      {
        name: "description",
        content:
          "El compendio abierto del mundo de Aetheria: lugares, personajes, magia elemental, historia y razas. Escrito por sus viajeros.",
      },
      { property: "og:title", content: "Aetheria — Wiki del mundo" },
      { property: "og:description", content: "Compendio abierto de un mundo de fantasía." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: articles } = useQuery({
    queryKey: ["articles", "recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, slug, title, summary, updated_at, category_id, categories(name, slug)")
        .order("updated_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-6">
              Compendio del mundo · Edición abierta
            </p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-tight">
              El mundo de <em className="italic text-accent">Aetheria</em>,
              <br />contado por quienes lo viven.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Cinco continentes flotantes, siete academias de magia elemental, una decena de
              razas ancestrales. Una wiki que crece cada vez que un viajero se sienta a escribir.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <p className="font-display text-sm text-muted-foreground">
              «El mundo no se descubre. Se nombra.»
            </p>
            <p className="text-xs text-muted-foreground mt-1">— Inscripción en la Torre de Vael</p>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section id="categorias" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-3xl">Categorías</h2>
          <p className="text-sm text-muted-foreground">Recorre el mundo por temas</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border border border-border rounded-md overflow-hidden">
          {(categories ?? []).map((c) => (
            <Link
              key={c.id}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="bg-background hover:bg-secondary transition p-6 group"
            >
              <p className="font-display text-xl mb-1 group-hover:text-accent transition-colors">
                {c.name}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
            </Link>
          ))}
          {categories?.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground col-span-full bg-background">
              Aún no hay categorías.
            </p>
          )}
        </div>
      </section>

      {/* ARTÍCULOS RECIENTES */}
      <section id="articulos" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-3xl">Entradas recientes</h2>
          <Link to="/nuevo" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
            Escribir una entrada <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-border border-t border-b border-border">
          {(articles ?? []).map((a) => (
            <Link
              key={a.id}
              to="/articulo/$slug"
              params={{ slug: a.slug }}
              className="group grid md:grid-cols-12 gap-4 py-6 hover:bg-secondary/50 transition px-2 -mx-2 rounded"
            >
              <div className="md:col-span-2 text-xs uppercase tracking-wider text-muted-foreground">
                {(a as any).categories?.name ?? "Sin categoría"}
              </div>
              <div className="md:col-span-8">
                <h3 className="font-display text-xl group-hover:text-accent transition-colors">
                  {a.title}
                </h3>
                {a.summary && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.summary}</p>
                )}
              </div>
              <div className="md:col-span-2 md:text-right text-xs text-muted-foreground">
                {new Date(a.updated_at).toLocaleDateString("es", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </Link>
          ))}
          {articles?.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Aún no se ha escrito ninguna entrada. <Link to="/nuevo" className="text-accent underline">Sé el primero.</Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
