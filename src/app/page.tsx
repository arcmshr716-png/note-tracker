import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const totalLikes = articles.reduce((s, a) => s + a.likes, 0);
  const totalSales = articles.reduce((s, a) => s + a.sales, 0);
  const totalRevenue = articles.reduce((s, a) => s + a.revenue, 0);

  const top = [...articles].sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold">ダッシュボード</h1>
        <p className="text-sm text-gray-400 mt-1">全記事の集計サマリー</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="記事数" value={articles.length.toString()} />
        <Stat label="総いいね" value={totalLikes.toLocaleString()} />
        <Stat label="総売上数" value={totalSales.toLocaleString()} />
        <Stat label="総売上金額" value={`¥${totalRevenue.toLocaleString()}`} />
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
          売上トップ記事
        </h2>
        {top.length === 0 ? (
          <p className="text-sm text-gray-400">まだ記事がありません。</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {top.map((a, i) => (
              <li key={a.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-gray-300 w-4">{i + 1}</span>
                  <Link href={`/articles/${a.id}`} className="text-sm font-medium truncate hover:underline">
                    {a.title}
                  </Link>
                </div>
                <div className="flex gap-4 text-sm text-gray-500 shrink-0">
                  <span>♡ {a.likes}</span>
                  <span>¥{a.revenue.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">最近の記事</h2>
          <Link href="/articles" className="text-xs text-gray-400 hover:text-gray-900">すべて見る →</Link>
        </div>
        {articles.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-400">記事がまだありません</p>
            <Link href="/articles/new" className="mt-3 inline-block text-sm text-gray-900 underline">
              最初の記事を追加する
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {articles.slice(0, 5).map((a) => (
              <li key={a.id} className="py-3 flex items-center justify-between gap-4">
                <Link href={`/articles/${a.id}`} className="text-sm font-medium hover:underline truncate">
                  {a.title}
                </Link>
                <div className="flex gap-4 text-sm text-gray-500 shrink-0">
                  <span>♡ {a.likes}</span>
                  <span>{a.sales}件</span>
                  <span>¥{a.revenue.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
