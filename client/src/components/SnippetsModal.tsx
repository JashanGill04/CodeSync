"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  initialCode?: string;
  language?: string;
};

type Snippet = {
  _id: string;
  title: string;
  language: string;
  code: string;
};

export default function SnippetsModal({ open, onClose, initialCode = "", language = "" }: Props) {
  const { data: session, status } = useSession();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);

  const [newSnippet, setNewSnippet] = useState({
    title: "",
    language,
    code: initialCode,
  });

  // Load snippets when modal opens
 useEffect(() => {
  if (open && session?.user) {
    setLoading(true);


 
    const fetchSnippets = async () => {
      try {
        const res = await fetch("/api/snippets"); // Adjust if needed
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json(); 
        setSnippets(data);
      } catch (err) {
        console.error("Failed to fetch snippets", err);
            }
          finally{
            setLoading(false);
          };
    };

    fetchSnippets();
  }

  setNewSnippet((prev) => ({
    ...prev,
    code: initialCode,
    language: language,
  }));
}, [open, session, initialCode, language]);


  const handleSave = async () => {
    if (!newSnippet.title.trim() || !newSnippet.code.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSnippet),
      });

      const saved = await res.json();
      setSnippets((prev) => [saved, ...prev]);
      setNewSnippet({ title: "", language, code: "" });
    } catch (err) {
      console.error("Failed to save snippet", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSnippet = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/snippets/${id}`, { method: "DELETE" });
      setSnippets((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete snippet", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-white/10">
        <DialogHeader>
          <DialogTitle className="text-violet-100 text-lg">💾 Your Saved Snippets</DialogTitle>
        </DialogHeader>

        {status !== "authenticated" ? (
          <p className="text-red-400 mt-4 text-sm">🔐 You must be logged in to manage snippets.</p>
        ) : (
          <>
            <div className="space-y-3">
              <Input
                placeholder="Snippet Title"
                value={newSnippet.title}
                onChange={(e) => setNewSnippet((prev) => ({ ...prev, title: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
              <Input
                placeholder="Language (e.g. javascript)"
                value={newSnippet.language}
                onChange={(e) => setNewSnippet((prev) => ({ ...prev, language: e.target.value }))}
                className="bg-white/10 border-white/20 text-white"
              />
              <Textarea
                placeholder="Paste your code here..."
                value={newSnippet.code}
                onChange={(e) => setNewSnippet((prev) => ({ ...prev, code: e.target.value }))}
                className="bg-white/10 border-white/20 text-white h-40 resize-none overflow-y-auto"
              />
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-500 text-white"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Snippet
              </Button>
            </div>

            <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto">
              {loading && <p className="text-gray-400">Loading snippets...</p>}
              {!loading && snippets.length === 0 && <p className="text-gray-400">No snippets yet.</p>}

              {snippets.map((s) => (
                <div key={s._id} className="p-3 border border-white/10 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <strong className="text-violet-300">{s.title}</strong>
                      <span className="ml-2 text-xs text-gray-400">({s.language})</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteSnippet(s._id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                  <div className="max-h-40 overflow-y-auto bg-white/5 p-2 rounded text-sm text-gray-300 whitespace-pre-wrap">
                    <pre>{s.code}</pre>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
