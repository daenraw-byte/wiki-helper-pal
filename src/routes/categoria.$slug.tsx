import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/categoria/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();

  const { data: category } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: articles } = useQuery({
    queryKey: ["articles", "by-category", slug],
    queryFn: async () => {
      if (!category) return [];
      const { data, error } = await supabase
        .from("articles")
        .select("id, slug, title, summary, updated_at")
        .eq("category_id", category.id)
        .order("title");
      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  const isPersonajesCategory = slug === "personajes";

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-10">
      <div className="rounded-3xl bg-card/95 backdrop-blur-sm shadow-xl border border-border/60 px-8 md:px-12 py-14">
        <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Categoría</p>
        <h1 className="font-display text-4xl md:text-5xl">{category?.name ?? "…"}</h1>
        {category?.description && !isPersonajesCategory && (
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}

        {isPersonajesCategory ? (
          <div className="mt-12 grid grid-cols-2 gap-8">
            <Link
              to="/articulo/$slug"
              params={{ slug: "solana" }}
              className="group flex flex-col items-center"
            >
              <div className="w-48 h-48 bg-muted rounded-lg border border-border/60 flex items-center justify-center group-hover:border-accent/60 transition-colors">
                <span className="text-muted-foreground text-sm">Foto</span>
              </div>
              <h2 className="mt-4 font-display text-xl group-hover:text-accent transition-colors">Solana</h2>
            </Link>
            <Link
              to="/articulo/$slug"
              params={{ slug: "lumina" }}
              className="group flex flex-col items-center"
            >
              <div className="w-48 h-48 bg-muted rounded-lg border border-border/60 flex items-center justify-center group-hover:border-accent/60 transition-colors">
                <span className="text-muted-foreground text-sm">Foto</span>
              </div>
              <h2 className="mt-4 font-display text-xl group-hover:text-accent transition-colors">Lumina</h2>
            </Link>
          </div>
        ) : (
          <div className="mt-12 divide-y divide-border border-t border-b border-border">
            {(articles ?? []).map((a) => (
              <Link
                key={a.id}
                to="/articulo/$slug"
                params={{ slug: a.slug }}
                className="block py-6 group hover:bg-secondary/50 px-2 -mx-2 rounded transition"
              >
                <h2 className="font-display text-xl group-hover:text-accent transition-colors">{a.title}</h2>
                {a.summary && <p className="text-sm text-muted-foreground mt-1">{a.summary}</p>}
              </Link>
            ))}
            {articles?.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Aún no hay entradas en esta categoría.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

