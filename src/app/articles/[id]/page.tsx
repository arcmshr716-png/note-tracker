import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleDetail from "./ArticleDetail";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { snapshots: { orderBy: { recordedAt: "desc" } } },
  });
  if (!article) notFound();
  return <ArticleDetail article={article} />;
}
