import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
  });
  if (!project) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const { name, color } = await request.json();
  try {
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: { name, color },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Non trouvé' }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Non trouvé' }, { status: 404 });
  }
}