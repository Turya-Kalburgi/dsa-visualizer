import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stats = [
  { number: '12', label: 'Core Topics' },
  { number: '180+', label: 'Problems' },
  { number: '50+', label: 'Visualizations' },
  { number: '4', label: 'Languages' },
]

const steps = [
  { number: '1', title: 'Watch', description: 'See each algorithm animate step by step.' },
  { number: '2', title: 'Understand', description: 'Read plain-English narration that explains the idea.' },
  { number: '3', title: 'Practice', description: 'Write code yourself and test your understanding.' },
]

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-950 px-8 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-6 text-6xl font-black leading-tight text-white">
          Master DSA <span className="text-violet-500">Visually</span> 🚀
        </h1>
        <p className="mb-10 max-w-2xl text-xl text-gray-400">
          Watch every algorithm come to life. Step-by-step animations,
          synchronized code, and hands-on practice — all in one place.
        </p>
        <Link to="/topics">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-2xl bg-violet-600 px-10 py-4 text-lg font-bold text-white transition-colors hover:bg-violet-500"
          >
            Start Learning →
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-20 flex flex-wrap justify-center gap-8"
      >
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl font-black text-violet-400">{stat.number}</div>
            <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="mt-16 w-full max-w-6xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">How it works</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <motion.div
              key={step.title}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 text-left shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 text-lg font-black text-violet-300">
                {step.number}
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero