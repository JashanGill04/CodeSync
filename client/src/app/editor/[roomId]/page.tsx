import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import CodeEditor from '@/components/Editor'

type Props = {
  params: {
    roomId: string
  }
}

export default async function EditorPage({ params }: Props) {

  const session = await getServerSession(authOptions);
   const { roomId } = await params;

  if (!session) {
    redirect('/') // 🔐 Secure redirect to GitHub login
  }

  return (
    <>
      <Navbar />
      <main className="h-[calc(100vh-64px)] p-6 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
        <div className="w-full h-full rounded-xl shadow-2xl overflow-hidden border border-white/10">
          <CodeEditor roomId={roomId}/>
        </div>
      </main>
    </>
  )
}
