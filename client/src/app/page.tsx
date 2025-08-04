'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import { useSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import LoginModal from '@/components/LoginModal'
import FeatureCards from '@/components/cards/FeatureCard'
import { Typewriter } from 'react-simple-typewriter'

export default function HomePage() {
  const [roomId, setRoomId] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [pendingAction, setPendingAction] = useState<'join' | 'create' | null>(null)

  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session && pendingAction) {
      if (pendingAction === 'join' && roomId.trim()) {
        router.push(`/editor/${roomId.trim()}`)
      } else if (pendingAction === 'create') {
        const newRoom = Math.random().toString(36).substring(2, 10)
        router.push(`/editor/${newRoom}`)
      }
      setPendingAction(null)
    }
  }, [session, pendingAction, roomId, router])

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomId.trim()) return

    if (!session) {
      setPendingAction('join')
      setShowLogin(true)
    } else {
      router.push(`/editor/${roomId.trim()}`)
    }
  }

  const handleCreateRoom = () => {
    if (!session) {
      setPendingAction('create')
      setShowLogin(true)
    } else {
      const newRoom = Math.random().toString(36).substring(2, 10)
      router.push(`/editor/${newRoom}`)
    }
  }

  return (
    <>
      <Navbar />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />

      <main className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
        <div className="w-full max-w-2xl text-center space-y-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative inline-block">
              <h1 className="text-5xl font-bold mb-2 text-white drop-shadow relative z-10">
                ⚡ CodeSync
              </h1>
              <motion.div
                className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-r from-purple-500 via-violet-400 to-pink-500 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.4 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />
            </div>

            <p className="text-md sm:text-lg text-violet-300 max-w-2xl mt-2">
              <Typewriter
                words={[
                  'Real-time collaborative code editing.',
                  'Built for remote teams, coders, and creators.',
                  'No downloads. No delays. Just code.',
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={50}
                deleteSpeed={30}
                delaySpeed={2000}
              />
            </p>

            {session?.user && (
              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-violet-200">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                )}
                <span>Welcome, {session.user.name} 👋</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl space-y-4"
          >
            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                type="text"
                placeholder="🔗 Enter a room ID to join"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-white/10 border border-white/20 text-white placeholder:text-white transition-all focus:ring-2 focus:ring-violet-500"
              />
              <Button
                className="w-full bg-violet-600 hover:bg-violet-500 text-white"
                type="submit"
              >
                Join Room
              </Button>
            </form>
            <div className="text-center text-sm text-violet-200">— OR —</div>
            <Button
              className="w-full bg-violet-500 hover:bg-violet-400 text-white"
              variant="outline"
              onClick={handleCreateRoom}
            >
              Create New Room
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FeatureCards />
          </motion.div>
        </div>
      </main>
    </>
  )
}
