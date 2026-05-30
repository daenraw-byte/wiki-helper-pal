import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { marked } from "marked";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-session";
import { Pencil } from "lucide-react";

export const Route = createFileRoute("/articulo/$slug")({
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { user } = useSession();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(
          "*, categories(name, slug), author:profiles!articles_author_id_fkey(username, display_name, avatar_url), editor:profiles!articles_updated_by_fkey(username, display_name)",
        )
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-muted-foreground">Cargando…</div>;
  }
  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="rounded-3xl bg-card/95 backdrop-blur-sm shadow-xl border border-border/60 px-8 py-14 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Sin contenido</p>
          <h1 className="font-display text-3xl mb-3">Este artículo aún no existe</h1>
          <p className="text-muted-foreground">La entrada «{slug}» todavía no ha sido creada.</p>
          {user && (
            <Link
              to="/nuevo"
              className="inline-block mt-6 px-4 py-2 rounded-full border border-foreground/60 hover:bg-foreground hover:text-background transition"
            >
              Crear ahora
            </Link>
          )}
        </div>
      </div>
    );
  }

  const html = marked.parse(article.content || "*Esta entrada aún no tiene contenido.*", {
    breaks: true,
  }) as string;
  const author = (article as any).author;

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-10">
      <article className="rounded-3xl bg-card/95 backdrop-blur-sm shadow-xl border border-border/60 px-8 md:px-14 py-14">
        <div className="mb-10">
          {(article as any).categories && (
            <Link
              to="/categoria/$slug"
              params={{ slug: (article as any).categories.slug }}
              className="text-xs uppercase tracking-[0.2em] text-accent hover:underline"
            >
              {(article as any).categories.name}
            </Link>
          )}
          <h1 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">{article.title}</h1>
          {article.summary && (
            <p className="font-display italic text-xl text-muted-foreground mt-4 leading-relaxed">
              {article.summary}
            </p>
          )}
          <div className="mt-8 flex items-center justify-between border-t border-b border-border py-4 text-sm text-muted-foreground">
            <div>
              {author ? (
                <>
                  Escrito por{" "}
                  <Link
                    to="/autor/$username"
                    params={{ username: author.username }}
                    className="text-foreground hover:text-accent"
                  >
                    {author.display_name || author.username}
                  </Link>
                </>
              ) : (
                "Autor desconocido"
              )}
              <span className="mx-2">·</span>
              Actualizado el{" "}
              {new Date(article.updated_at).toLocaleDateString("es", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            {user && (
              <Link
                to="/articulo/$slug/editar"
                params={{ slug: article.slug }}
                className="inline-flex items-center gap-1.5 text-accent hover:underline"
              >
                <Pencil size={14} /> Editar
              </Link>
            )}
          </div>
        </div>

        <div className="prose-wiki" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}
