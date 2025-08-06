import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/connectDB'
import Snippet from '@/models/snippet'
import { NextResponse, NextRequest } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  console.log("Params:", params); // Keep this for debugging
  
  const { id } = params;

  await Snippet.deleteOne({ _id: id, userId: session.user.email });

  return NextResponse.json({ success: true });
}