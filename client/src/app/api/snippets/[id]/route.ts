import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/connectDB'
import Snippet from '@/models/snippet'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const { id } = context.params

  await Snippet.deleteOne({ _id: id, userId: session.user.email })

  return NextResponse.json({ success: true })
}
