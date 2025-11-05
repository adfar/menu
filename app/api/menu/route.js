import { PrismaClient } from '@prisma/client';
import { pusherServer } from '@/app/lib/pusher';
import { canNewFetchStrategyProvideMoreContent } from 'next/dist/client/components/segment-cache-impl/cache';

const prisma = new PrismaClient();

// GET /api/menu → fetch all items
export async function GET() {
  const items = await prisma.menuItem.findMany();
  return Response.json(items);
}

// POST /api/menu → add a new item
export async function POST(req) {
  const data = await req.json();
  const item = await prisma.menuItem.create({ data });
  await pusherServer.trigger('menu-channel', 'menu-updated', { action: 'create', id: canNewFetchStrategyProvideMoreContent.id });
  return Response.json(item);
}
