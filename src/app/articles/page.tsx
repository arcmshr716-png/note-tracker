import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">記事一覧</h1>
          <p className="text-sm text-gray-400 mt-1">{articles.length}件の記事</p>
        </div>
        <Link href="/articles/new" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          + 記事追加
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200 rounded-lg">
          <p className="text-sm text-gray-400">まだ記事がありません</p>
          <Link href="/articles/new" className="mt-3 inline-block text-sm underline">最初の記事を追加する</Link>
        </div>
      ) : (
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">タイトル</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">いいね</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">売上数</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">売上金額</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">更新日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/articles/${a.id}`} className="font-medium hover:underline">{a.title}</Link>
                    {a.noteUrl && (
                      <a href={a.noteUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-gray-400 hover:text-gray-600">↗</a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{a.likes.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{a.sales.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-600">¥{a.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-400 text-xs">{new Date(a.updatedAt).toLocaleDateString("ja-JP")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
