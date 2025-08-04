import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/connectDB'
import Snippet from '@/models/snippet'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const snippets = await Snippet.find({ userId: session.user.email }).sort({ createdAt: -1 })
  return NextResponse.json(snippets)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, language, code } = await req.json()
  if (!title || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  await connectDB()
  const snippet = await Snippet.create({
    userId: session.user.email,
    title,
    language,
    code,
  })

  return NextResponse.json(snippet, { status: 201 })
}
