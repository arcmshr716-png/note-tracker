"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      noteUrl: (form.elements.namedItem("noteUrl") as HTMLInputElement).value,
      publishedAt: (form.elements.namedItem("publishedAt") as HTMLInputElement).value,
      likes: (form.elements.namedItem("likes") as HTMLInputElement).value,
      sales: (form.elements.namedItem("sales") as HTMLInputElement).value,
      revenue: (form.elements.namedItem("revenue") as HTMLInputElement).value,
      analysis: (form.elements.namedItem("analysis") as HTMLTextAreaElement).value,
      reflection: (form.elements.namedItem("reflection") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "エラーが発生しました");
        return;
      }
      const article = await res.json();
      router.push(`/articles/${article.id}`);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold">記事追加</h1>
        <p className="text-sm text-gray-400 mt-1">Note記事の情報を入力してください</p>
      </div>
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <ArticleFormFields />
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-gray-900 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
            {saving ? "保存中…" : "保存する"}
          </button>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}

export function ArticleFormFields({ defaults }: {
  defaults?: { title?: string; noteUrl?: string; publishedAt?: string; likes?: number; sales?: number; revenue?: number; analysis?: string; reflection?: string; };
}) {
  return (
    <>
      <Field label="タイトル *" htmlFor="title">
        <input id="title" name="title" type="text" required defaultValue={defaults?.title ?? ""} placeholder="記事のタイトルを入力" className={inputCls} />
      </Field>
      <Field label="Note URL" htmlFor="noteUrl">
        <input id="noteUrl" name="noteUrl" type="url" defaultValue={defaults?.noteUrl ?? ""} placeholder="https://note.com/..." className={inputCls} />
      </Field>
      <Field label="公開日" htmlFor="publishedAt">
        <input id="publishedAt" name="publishedAt" type="date" defaultValue={defaults?.publishedAt ?? ""} className={inputCls} />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="いいね数" htmlFor="likes">
          <input id="likes" name="likes" type="number" min="0" defaultValue={defaults?.likes ?? 0} className={inputCls} />
        </Field>
        <Field label="売上数（件）" htmlFor="sales">
          <input id="sales" name="sales" type="number" min="0" defaultValue={defaults?.sales ?? 0} className={inputCls} />
        </Field>
        <Field label="売上金額（円）" htmlFor="revenue">
          <input id="revenue" name="revenue" type="number" min="0" defaultValue={defaults?.revenue ?? 0} className={inputCls} />
        </Field>
      </div>
      <Field label="分析メモ" htmlFor="analysis">
        <textarea id="analysis" name="analysis" rows={4} defaultValue={defaults?.analysis ?? ""} placeholder="どんな層に刺さった？タイトルの効果は？" className={textareaCls} />
      </Field>
      <Field label="反省・次への改善点" htmlFor="reflection">
        <textarea id="reflection" name="reflection" rows={4} defaultValue={defaults?.reflection ?? ""} placeholder="次回に活かしたいこと、改善点など" className={textareaCls} />
      </Field>
    </>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode; }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300";
const textareaCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-300 resize-none";
