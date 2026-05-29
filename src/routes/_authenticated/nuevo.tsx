import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-session";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/nuevo")({
  component: NewArticlePage,
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function NewArticlePage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setSaving(true);
    try {
      const baseSlug = slugify(title) || "entrada";
      let slug = baseSlug;
      let n = 0;
      while (true) {
        const { data: existing } = await supabase.from("articles").select("id").eq("slug", slug).maybeSingle();
        if (!existing) break;
        n++;
        slug = `${baseSlug}-${n}`;
      }
      const { error } = await supabase.from("articles").insert({
        slug,
        title: title.trim(),
        summary: summary.trim() || null,
        content,
        category_id: categoryId || null,
        author_id: user.id,
        updated_by: user.id,
      });
      if (error) throw error;
      toast.success("Entrada publicada");
      navigate({ to: "/articulo/$slug", params: { slug } });
    } catch (err: any) {
      toast.error(err.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Nueva entrada</p>
      <h1 className="font-display text-3xl mt-3 mb-10">Añade tu pieza al compendio</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <input
          type="text"
          required
          placeholder="Título de la entrada"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full font-display text-3xl bg-transparent border-b border-border focus:border-accent outline-none py-2 placeholder:text-muted-foreground/50"
        />

        <input
          type="text"
          placeholder="Resumen breve (opcional)"
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
            rows={20}
            placeholder="## Origen&#10;&#10;Escribe aquí la historia de esta entrada. Acepta **Markdown**."
            className="w-full font-mono text-sm border border-input bg-background rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring leading-relaxed"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-foreground text-background px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Publicando…" : "Publicar entrada"}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="border border-border px-5 py-2.5 rounded-md text-sm hover:bg-secondary transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
