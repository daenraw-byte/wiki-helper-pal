import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-session";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/articulo/$slug/editar")({
  component: EditArticlePage,
});

function EditArticlePage() {
  const { slug } = Route.useParams();
  const { user } = useSession();
  const navigate = useNavigate();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug, "edit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSummary(article.summary ?? "");
      setContent(article.content ?? "");
      setCategoryId(article.category_id ?? "");
    }
  }, [article]);

  if (isLoading) return <div className="mx-auto max-w-3xl px-6 py-24 text-muted-foreground">Cargando…</div>;
  if (!article) return <div className="mx-auto max-w-3xl px-6 py-24">Entrada no encontrada.</div>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("articles")
        .update({
          title: title.trim(),
          summary: summary.trim() || null,
          content,
          category_id: categoryId || null,
          updated_by: user.id,
        })
        .eq("id", article.id);
      if (error) throw error;
      toast.success("Cambios guardados");
      navigate({ to: "/articulo/$slug", params: { slug } });
    } catch (err: any) {
      toast.error(err.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Editando</p>
      <h1 className="font-display text-3xl mt-3 mb-10">{article.title}</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full font-display text-3xl bg-transparent border-b border-border focus:border-accent outline-none py-2"
        />
        <input
          type="text"
          placeholder="Resumen breve"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full font-display italic text-lg bg-transparent border-b border-border focus:border-accent outline-none py-2 placeholder:text-muted-foreground/50"
        />
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">
            Categoría
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">— Sin categoría —</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">
            Contenido (Markdown)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={24}
            className="w-full font-mono text-sm border border-input bg-background rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-foreground text-background px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/articulo/$slug", params: { slug } })}
            className="border border-border px-5 py-2.5 rounded-md text-sm hover:bg-secondary transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
