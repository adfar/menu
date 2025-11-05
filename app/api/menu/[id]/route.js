import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function DELETE(_req, ctx) {
  const { id } = await ctx.params; // params is async in newer Next
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) {
    return new Response('Invalid id', { status: 400 });
  }

  try {
    const deleted = await prisma.menuItem.delete({ where: { id: itemId } });
    // 204 is a nice REST-y response for deletes
    return new Response(null, { status: 204 });
  } catch (err) {
    // If the record doesn't exist
    if (err.code === 'P2025') return new Response('Not found', { status: 404 });
    console.error('Delete failed:', err);
    return new Response('Server error', { status: 500 });
  }
}

export async function PUT(req, ctx) {
  const { id } = await ctx.params;
  const itemId = Number(id);
  const data = await req.json();
  // Optionally validate fields here
  const updated = await prisma.menuItem.update({ where: { id: itemId }, data });
  return Response.json(updated);
}

