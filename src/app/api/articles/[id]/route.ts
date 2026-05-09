import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { snapshots: { orderBy: { recordedAt: "desc" } } },
  });
  if (!article) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(article);
}

export async function PUT(request: NextRequest, { params }: Context) {
  const { id } = await params;
  const body = await request.json();
  const { title, noteUrl, publishedAt, likes, sales, revenue, analysis, reflection } = body;
  if (!title?.trim()) {
    return Response.json({ error: "タイトルは必須です" }, { status: 400 });
  }
  const prev = await prisma.article.findUnique({ where: { id } });
  if (!prev) return Response.json({ error: "Not found" }, { status: 404 });
  const newLikes = Number(likes) || 0;
  const newSales = Number(sales) || 0;
  const newRevenue = Number(revenue) || 0;
  const [article] = await prisma.$transaction([
    prisma.article.update({
      where: { id },
      data: {
        title: title.trim(),
        noteUrl: noteUrl?.trim() || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        likes: newLikes,
        sales: newSales,
        revenue: newRevenue,
        analysis: analysis?.trim() || null,
        reflection: reflection?.trim() || null,
      },
    }),
    ...(prev.likes !== newLikes || prev.sales !== newSales || prev.revenue !== newRevenue
      ? [prisma.snapshot.create({ data: { articleId: id, likes: newLikes, sales: newSales, revenue: newRevenue } })]
      : []),
  ]);
  return Response.json(article);
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
