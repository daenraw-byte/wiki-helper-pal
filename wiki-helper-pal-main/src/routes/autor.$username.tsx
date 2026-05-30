import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/autor/$username")({
  component: AuthorPage,
});

function AuthorPage() {
  const { username } = Route.useParams();

  const { data: profile } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: articles } = useQuery({
    queryKey: ["articles", "by-author", username],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from("articles")
        .select("id, slug, title, summary, updated_at")
        .eq("author_id", profile.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile,
  });

  if (!profile) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-muted-foreground">Cargando…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center gap-5">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover border border-border" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center font-display text-2xl">
            {(profile.display_name || profile.username)[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl">{profile.display_name || profile.username}</h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>
      </div>
      {profile.bio && <p className="mt-6 text-muted-foreground leading-relaxed">{profile.bio}</p>}

      <h2 className="font-display text-xl mt-12 mb-4">Entradas escritas</h2>
      <div className="divide-y divide-border border-t border-b border-border">
        {(articles ?? []).map((a) => (
          <Link
            key={a.id}
            to="/articulo/$slug"
            params={{ slug: a.slug }}
            className="block py-4 group hover:bg-secondary/50 px-2 -mx-2 rounded"
          >
            <p className="font-display group-hover:text-accent">{a.title}</p>
          </Link>
        ))}
        {articles?.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Sin entradas aún.</p>
        )}
      </div>
    </div>
  );
}
