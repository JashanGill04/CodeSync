import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/connectDB'
import Snippet from '@/models/snippet'
import { NextResponse } from 'next/server'
import type { Params } from '@/lib/types' // Add this type definition

export async function DELETE(
  request: Request,
  { params }: { params: Params }  // Updated parameter type
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { id } = params;  // Direct destructuring

  await Snippet.deleteOne({ _id: id, userId: session.user.email });

  return NextResponse.json({ success: true });
}