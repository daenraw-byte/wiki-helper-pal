import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/use-session";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useSession();

  const { data: profile, refetch } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
      setAvatar(profile.avatar_url ?? "");
    }
  }, [profile]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName, bio, avatar_url: avatar || null })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Perfil actualizado");
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="mx-auto max-w-3xl px-6 py-24 text-muted-foreground">Cargando…</div>;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-xs uppercase tracking-[0.25em] text-accent">Tu perfil</p>
      <h1 className="font-display text-3xl mt-3 mb-2">@{profile.username}</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Así te verán otros cronistas en cada entrada que escribas.
      </p>

      <form onSubmit={onSave} className="space-y-5">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">
            Nombre visible
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">
            Avatar (URL)
          </label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://…"
            className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-muted-foreground uppercase tracking-wider">
            Biografía
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-foreground text-background px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
