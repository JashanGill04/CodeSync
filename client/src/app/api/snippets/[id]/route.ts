import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/connectDB'
import Snippet from '@/models/snippet'
import { NextResponse, NextRequest } from 'next/server'

// Define a type that matches your actual parameter structure
type RouteParams = {
  params: {
    id: string;
  } & {
    // Account for the dual structure shown in your log
    id?: string;
    [key: string]: any; // Allow other properties
  };
};

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  // Handle both possible locations of the id
  const id = context.params.id || (context.params as any).id;
  
  if (!id) {
    return NextResponse.json({ error: 'Missing snippet ID' }, { status: 400 });
  }

  await Snippet.deleteOne({ _id: id, userId: session.user.email });

  return NextResponse.json({ success: true });
}