'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Github, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: Props) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      setLoading(false)
      onClose()
    }
  }, [session])

  const handleGitHubLogin = async () => {
    setLoading(true)
    await signIn('github', { redirect: false })
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl backdrop-blur-md"
           
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="text-center space-y-6"
            >
              <DialogHeader>
                <DialogTitle className="text-xl text-violet-100">
                  Sign in to Continue
                </DialogTitle>
              </DialogHeader>

              <Button
                className="w-full bg-violet-600 hover:bg-violet-500 text-white"
                onClick={handleGitHubLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4 mr-2" /> Sign in with GitHub
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-300">
                We’ll never post without your permission.
              </p>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
