'use client'
import SnippetsModal from './SnippetsModal'
import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()
const [showSnippets, setShowSnippets] = useState(false)

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 shadow-lg text-white z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold tracking-wide">
        ⚡ CodeSync
      </Link>

      {/* Right-side session actions */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full border border-white shadow"
                />
              )}
              <span className="text-sm font-medium">{session.user?.name}</span>
            </div>

            <Button
              onClick={() => signOut()}
              className="bg-white text-purple-900 hover:bg-gray-200"
              variant="ghost"
            >
              Logout
            </Button>
              <button
    onClick={() => setShowSnippets(true)}
    className="text-sm px-3 py-2 rounded bg-violet-600 hover:bg-violet-500 text-white transition"
  >
    💾 Saved Snippets
  </button>
          </>

        ) : (
          <Button
            onClick={() => signIn('github')}
            className="bg-white text-gray-900 hover:bg-gray-200"
            variant="ghost"
          >
            Login with GitHub
          </Button>
        )}
      </div>
      <SnippetsModal open={showSnippets} onClose={() => setShowSnippets(false)} />

    </header>
  )
  
}

