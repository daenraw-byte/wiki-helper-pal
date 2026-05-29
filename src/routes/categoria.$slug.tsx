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

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Categoría</p>
      <h1 className="font-display text-4xl md:text-5xl">{category?.name ?? "…"}</h1>
      {category?.description && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {category.description}
        </p>
      )}

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
    </div>
  );
}
