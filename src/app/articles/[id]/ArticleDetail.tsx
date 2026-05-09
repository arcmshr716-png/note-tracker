"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article, Snapshot } from "@prisma/client";
import { ArticleFormFields } from "../new/page";

type Props = { article: Article & { snapshots: Snapshot[] } };

export default function ArticleDetail({ article }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
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
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "エラーが発生しました");
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`「${article.title}」を削除しますか？`)) return;
    await fetch(`/api/articles/${article.id}`, { method: "DELETE" });
    router.push("/articles");
    router.refresh();
  }

  const publishedStr = article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 10) : "";

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{article.title}</h1>
          {article.noteUrl && (
            <a href={article.noteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-gray-600 mt-1 inline-block">
              note で見る ↗
            </a>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setEditing((v) => !v)} className="text-sm px-4 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            {editing ? "キャンセル" : "編集"}
          </button>
          <button onClick={handleDelete} className="text-sm px-4 py-1.5 text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
            削除
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>}
      {editing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <ArticleFormFields defaults={{ title: article.title, noteUrl: article.noteUrl ?? "", publishedAt: publishedStr, likes: article.likes, sales: article.sales, revenue: article.revenue, analysis: article.analysis ?? "", reflection: article.reflection ?? "" }} />
          <button type="submit" disabled={saving} className="bg-gray-900 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
            {saving ? "保存中…" : "保存する"}
          </button>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="いいね" value={article.likes.toLocaleString()} />
            <StatBox label="売上数" value={`${article.sales.toLocaleString()} 件`} />
            <StatBox label="売上金額" value={`¥${article.revenue.toLocaleString()}`} />
          </div>
          {article.publishedAt && (
            <div>
              <p className="text-xs text-gray-400 mb-1">公開日</p>
              <p className="text-sm">{new Date(article.publishedAt).toLocaleDateString("ja-JP")}</p>
            </div>
          )}
          {article.analysis && (
            <div>
              <p className="text-xs text-gray-400 mb-2">分析メモ</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-4">{article.analysis}</p>
            </div>
          )}
          {article.reflection && (
            <div>
              <p className="text-xs text-gray-400 mb-2">反省・次への改善点</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-4">{article.reflection}</p>
            </div>
          )}
          {article.snapshots.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-3">数値の推移</p>
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">記録日時</th>
                      <th className="text-right px-4 py-2 font-medium text-gray-500 text-xs">いいね</th>
                      <th className="text-right px-4 py-2 font-medium text-gray-500 text-xs">売上数</th>
                      <th className="text-right px-4 py-2 font-medium text-gray-500 text-xs">売上金額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {article.snapshots.map((s) => (
                      <tr key={s.id}>
                        <td className="px-4 py-2 text-xs text-gray-400">{new Date(s.recordedAt).toLocaleString("ja-JP")}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{s.likes.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{s.sales.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-gray-600">¥{s.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
