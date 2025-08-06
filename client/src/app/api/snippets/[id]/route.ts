import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/connectDB'
import Snippet from '@/models/snippet'
import { NextResponse } from 'next/server'
type Props = {
  params: {
    id: string
  }
}
export async function DELETE(_: Request, { params }: Props) {
  const session = await getServerSession(authOptions)
  const id1 = await params;
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  await Snippet.deleteOne({ _id: id1.id, userId: session.user.email })
  return NextResponse.json({ success: true })
}
