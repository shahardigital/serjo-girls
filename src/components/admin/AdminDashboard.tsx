import { useEffect, useState } from "react";
import { LogOut, MessageCircle, Pencil, Phone, Plus, Settings, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import GirlForm from "@/components/admin/GirlForm";
import SiteSettingsPanel from "@/components/admin/SiteSettingsPanel";
import ChangePassword from "@/components/admin/ChangePassword";
import AdminUsersPanel from "@/components/admin/AdminUsersPanel";
import { deleteGirl, fetchAllGirls } from "@/lib/girls";
import { getTagById } from "@/data/tags";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { Girl } from "@/types";

type Tab = "girls" | "settings";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("girls");
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Girl | "new" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Girl | null>(null);

  function load() {
    setLoading(true);
    fetchAllGirls()
      .then(setGirls)
      .catch((e) => setError(e.message ?? "שגיאה בטעינה"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function handleSaved(saved: Girl) {
    setGirls((prev) => {
      const exists = prev.some((g) => g.id === saved.id);
      return exists ? prev.map((g) => (g.id === saved.id ? saved : g)) : [...prev, saved];
    });
    setEditing(null);
  }

  async function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteGirl(target.id);
      setGirls((prev) => prev.filter((g) => g.id !== target.id));
    } catch (e: any) {
      setError(e.message ?? "שגיאה במחיקה");
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "girls", label: "חשפניות", icon: Users },
    { id: "settings", label: "הגדרות אתר", icon: Settings },
  ];

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">ניהול</h1>
        <div className="flex gap-2">
          {tab === "girls" && (
            <Button onClick={() => setEditing("new")}>
              <Plus className="h-4 w-4" />
              הוספת חשפנית
            </Button>
          )}
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            <LogOut className="h-4 w-4" />
            התנתקות
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-1 border-b border-border">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "settings" ? (
        <div className="flex flex-col gap-8">
          <SiteSettingsPanel />
          <ChangePassword />
          <AdminUsersPanel />
        </div>
      ) : (
        <>
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          {loading ? (
            <p className="text-muted-foreground">טוען...</p>
          ) : girls.length === 0 ? (
            <p className="text-muted-foreground">עדיין לא נוספו פרופילים.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-right text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">תמונה</th>
                    <th className="px-4 py-3 font-medium">שם</th>
                    <th className="px-4 py-3 font-medium">תגיות</th>
                    <th className="px-4 py-3 font-medium">סטטוס</th>
                    <th className="px-4 py-3 font-medium">סדר</th>
                    <th className="px-4 py-3 font-medium">פניות</th>
                    <th className="px-4 py-3 font-medium">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {girls.map((girl) => (
                    <tr key={girl.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        {girl.images[0] ? (
                          <img
                            src={girl.images[0]}
                            alt={girl.name}
                            className="h-14 w-11 rounded object-cover"
                          />
                        ) : (
                          <div className="h-14 w-11 rounded bg-secondary" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{girl.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {girl.tags.slice(0, 3).map((t) => (
                            <Badge key={t} variant="outline">
                              {getTagById(t)?.label ?? t}
                            </Badge>
                          ))}
                          {girl.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{girl.tags.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={girl.active ? "success" : "secondary"}>
                          {girl.active ? "פעיל" : "מוסתר"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{girl.order}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1" title="קליקים על וואטסאפ">
                            <MessageCircle className="h-3.5 w-3.5 text-whatsapp" />
                            {girl.whatsappClicks}
                          </span>
                          <span className="flex items-center gap-1" title="קליקים על חיוג">
                            <Phone className="h-3.5 w-3.5 text-primary" />
                            {girl.callClicks}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setEditing(girl)} aria-label="עריכה">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPendingDelete(girl)}
                            aria-label="מחיקה"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "הוספת חשפנית" : "עריכת חשפנית"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <GirlForm
              girl={editing === "new" ? undefined : editing}
              onSaved={handleSaved}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="מחיקת פרופיל"
        description={pendingDelete ? `למחוק לצמיתות את "${pendingDelete.name}"?` : ""}
        confirmLabel="מחיקה"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
