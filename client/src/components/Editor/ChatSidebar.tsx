'use client'

import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ChatMessage = {
  user: string
  message: string
  image?: string
}

type Participant = {
  id: string
  name: string
  image?: string
}

type Props = {
  participants: Participant[]
  messages: ChatMessage[]
  typingUsers: string[]
  chatInput: string
  setChatInput: (val: string) => void
  sendMessage: (e: React.FormEvent) => void
  onTyping: () => void
  onLeave: () => void
}

export default function ChatPanel({
  participants,
  messages,
  typingUsers,
  chatInput,
  setChatInput,
  sendMessage,
  onTyping,
  onLeave,
}: Props) {
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="w-1/3 flex flex-col p-4 border-l border-white/10">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">Live Chat</h2>
        <Button size="sm" variant="destructive" onClick={onLeave}>Leave</Button>
      </div>

      {/* Participants */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1">Participants ({participants.length})</h3>
        <ul className="space-y-1 text-sm">
          {participants.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              {p.image ? (
                <img src={p.image} className="w-6 h-6 rounded-full" alt={p.name} />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">
                  {p.name[0]}
                </div>
              )}
              <span>{p.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-white/5 rounded p-3 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            {msg.image ? (
              <img
                src={msg.image}
                alt={msg.user}
                className="w-8 h-8 rounded-full border border-white/20 shadow"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold">
                {msg.user[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div>
              <div className="font-semibold">{msg.user}</div>
              <div className="text-white/90">{msg.message}</div>
            </div>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="text-xs text-gray-400 italic">
            {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <Input
          placeholder="Type a message"
          value={chatInput}
          onChange={(e) => {
            setChatInput(e.target.value)
            onTyping()
          }}
          className="bg-white/10 border border-white/20 text-white placeholder:text-white"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
