import { PrismaClient } from '@prisma/client';
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
  return Response.json(item);
}
