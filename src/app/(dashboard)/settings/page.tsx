"use client";

import { useState, useEffect, useRef } from "react";
import { PageTransition } from "@/components/dashboard/page-transition";
import { Palette, RotateCcw, Download, Upload, Loader2, Key, Plus, Trash2, Copy, Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getAccents, setAccents, defaultAccents, type SectionAccent } from "@/components/theme/accent-provider";
import { exportVault } from "@/actions/export";
import { importVault } from "@/actions/import";
import { generateApiKey, listApiKeys, revokeApiKey } from "@/actions/api-keys";

const sections: { id: SectionAccent; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "resources", label: "Resources" },
  { id: "prompts", label: "Prompts" },
  { id: "notes", label: "Notes" },
  { id: "projects", label: "Projects" },
  { id: "radar", label: "OS Radar" },
  { id: "graph", label: "Graph" },
  { id: "chat", label: "AI Chat" },
  { id: "tags", label: "Tags" },
  { id: "search", label: "Search" },
  { id: "settings", label: "Settings" },
];

function isValidHex(c: string) {
  return /^#[0-9a-f]{6}$/i.test(c);
}

interface ApiKeyItem {
  id: string;
  name: string;
  lastUsedAt: Date | null;
  createdAt: Date;
}

export default function SettingsPage() {
  const [accents, setAccentsState] = useState<Record<SectionAccent, string>>(defaultAccents);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [keyName, setKeyName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showNewKey, setShowNewKey] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAccentsState(getAccents());
    loadApiKeys();
  }, []);

  async function loadApiKeys() {
    const keys = await listApiKeys();
    setApiKeys(keys);
  }

  function updateAccent(id: SectionAccent, value: string) {
    if (!isValidHex(value)) return;
    setAccentsState((prev) => ({ ...prev, [id]: value }));
  }

  function saveAccents() {
    setAccents(accents);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function resetAccents() {
    setAccentsState(defaultAccents);
    setAccents(defaultAccents);
  }

  async function handleExport() {
    setExporting(true);
    const res = await exportVault();
    setExporting(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    const blob = new Blob([res.data!], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dev-second-brain-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Vault exported successfully");
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const res = await importVault(text);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Imported ${res.count} items`);
      }
    } catch {
      toast.error("Failed to read file");
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleGenerateKey() {
    if (!keyName.trim()) return;
    setGenerating(true);
    try {
      const res = await generateApiKey(keyName.trim());
      setNewKey(res.rawKey);
      setShowNewKey(true);
      setKeyName("");
      await loadApiKeys();
      toast.success("API key generated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate key");
    }
    setGenerating(false);
  }

  async function handleRevoke(id: string) {
    setRevokingId(id);
    try {
      await revokeApiKey(id);
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success("API key revoked");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to revoke key");
    }
    setRevokingId(null);
  }

  function copyKey() {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function dismissKey() {
    setNewKey(null);
    setCopied(false);
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto" data-accent="settings">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#FAFAFA]">Settings</h1>
            <p className="text-sm text-[#A1A1AA]">Customize accent colors, manage API keys, and more</p>
          </div>
        </div>

        {/* API Keys */}
        <h2 className="text-sm font-semibold text-[#E4E4E7] mb-3">API Keys</h2>
        <div className="rounded-xl border border-border/20 p-5 space-y-4 mb-8">
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            Generate API keys to access your vault programmatically. Use the <code className="text-[#F4F4F5] bg-muted px-1 rounded text-xs">Authorization: Bearer &lt;key&gt;</code> header.
          </p>

          {newKey && (
            <div className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/5 p-4 space-y-3">
              <p className="text-xs font-medium text-[#22C55E]">Key generated — copy it now. You won't see it again.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-card border border-border/20 rounded-lg px-3 py-2 font-mono text-[#F4F4F5] truncate">
                  {showNewKey ? newKey : "••••••••••••••••••••••••••••"}
                </code>
                <button
                  onClick={() => setShowNewKey(!showNewKey)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 text-[#71717A] hover:text-foreground transition-colors"
                >
                  {showNewKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={copyKey}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 text-[#71717A] hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-[#22C55E]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={dismissKey}
                  className="flex h-8 items-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Existing keys */}
          {apiKeys.length > 0 && (
            <div className="divide-y divide-border/20">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm text-[#F4F4F5]">{key.name}</p>
                    <p className="text-xs text-[#71717A]">
                      Created {new Date(key.createdAt).toLocaleDateString()}
                      {key.lastUsedAt ? ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString()}` : " · Never used"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevoke(key.id)}
                    disabled={revokingId === key.id}
                    className="flex h-7 items-center gap-1 rounded-md border border-border/40 px-2 text-xs text-[#71717A] hover:text-red-400 hover:border-red-400/30 transition-colors disabled:opacity-50"
                  >
                    {revokingId === key.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <input
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g. CLI automation"
              className="flex-1 h-9 rounded-lg border border-border/20 bg-card px-3 text-sm text-foreground placeholder:text-[#71717A] focus:outline-none focus:border-border/60 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleGenerateKey()}
            />
            <button
              onClick={handleGenerateKey}
              disabled={generating || !keyName.trim()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Generate
            </button>
          </div>
        </div>

        {/* Accent Colors */}
        <h2 className="text-sm font-semibold text-[#E4E4E7] mb-3">Accent Colors</h2>
        <div className="rounded-xl border border-border/20 overflow-hidden mb-8">
          <div className="divide-y divide-border/20">
            {sections.map(({ id, label }) => (
              <div key={id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-6 w-6 rounded-full border border-border/40"
                    style={{ backgroundColor: accents[id] }}
                  />
                  <span className="text-sm text-[#D4D4D8]">{label}</span>
                </div>
                <input
                  type="color"
                  value={accents[id]}
                  onChange={(e) => updateAccent(id, e.target.value)}
                  className="h-8 w-16 rounded border border-border/40 bg-transparent cursor-pointer p-0.5"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-10">
          <button
            onClick={saveAccents}
            className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {saved ? "Saved!" : "Save Changes"}
          </button>
          <button
            onClick={resetAccents}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Defaults
          </button>
        </div>

        {/* Import / Export */}
        <h2 className="text-sm font-semibold text-[#E4E4E7] mb-3">Import / Export</h2>
        <div className="rounded-xl border border-border/20 p-5 space-y-4 mb-10">
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            Export your entire vault as JSON for backup, or import a previously exported backup.
            Imported items will be added to your existing data (no duplicates check).
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              {exporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              Export
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={importing}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-4 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              Import
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
