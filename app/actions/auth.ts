'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    return { error: 'Email ou mot de passe incorrect' };
  }

  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
  }), {
    httpOnly: true,
    secure: false,
    maxAge: 3600,
    path: '/',
  });

  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}