import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Note Tracker",
  description: "Note記事の売上・いいね管理ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <header className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              Note Tracker
            </Link>
            <nav className="flex gap-6 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                ダッシュボード
              </Link>
              <Link href="/articles" className="hover:text-gray-900 transition-colors">
                記事一覧
              </Link>
              <Link href="/articles/new" className="hover:text-gray-900 transition-colors">
                + 記事追加
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
