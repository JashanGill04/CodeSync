import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/connectDB'
import Snippet from '@/models/snippet'
import { NextResponse } from 'next/server'

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  await Snippet.deleteOne({ _id: params.id, userId: session.user.email })
  return NextResponse.json({ success: true })
}
