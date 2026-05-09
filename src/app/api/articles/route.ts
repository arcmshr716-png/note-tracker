import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { snapshots: true } } },
  });
  return Response.json(articles);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, noteUrl, publishedAt, likes, sales, revenue, analysis, reflection } = body;
  if (!title?.trim()) {
    return Response.json({ error: "タイトルは必須です" }, { status: 400 });
  }
  const article = await prisma.article.create({
    data: {
      title: title.trim(),
      noteUrl: noteUrl?.trim() || null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      likes: Number(likes) || 0,
      sales: Number(sales) || 0,
      revenue: Number(revenue) || 0,
      analysis: analysis?.trim() || null,
      reflection: reflection?.trim() || null,
    },
  });
  return Response.json(article, { status: 201 });
}
