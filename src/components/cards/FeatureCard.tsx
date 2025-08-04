'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: 'Live Code Collaboration',
    emoji: '✍️',
    desc: 'Work together on code in real-time with others.',
  },
  {
    title: 'Real-time Chat',
    emoji: '💬',
    desc: 'Communicate instantly with your teammates.',
  },
  {
    title: 'Save Snippets',
    emoji: '💾',
    desc: 'Keep and reuse your favorite code pieces.',
  },
  {
    title: 'Multiple Languages',
    emoji: '🌐',
    desc: 'Write code in C++, Java, Python, JS and more.',
  },
  {
    title: 'Shareable Links',
    emoji: '📎',
    desc: 'Easily invite others with a single link.',
  },
  {
    title: 'Beautiful Dark Theme',
    emoji: '🌙',
    desc: 'Code with comfort in dark mode.',
  },
]

export default function FeatureCards() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        🚀 Key Features
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.15 }}
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow hover:scale-[1.02] transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="text-4xl mb-3">{feature.emoji}</div>
            <h3 className="text-lg font-semibold mb-1 text-white">
              {feature.title}
            </h3>
            <p className="text-sm text-white/80">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
