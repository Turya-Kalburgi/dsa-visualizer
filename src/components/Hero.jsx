import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stats = [
  { number: '12', label: 'Core Topics' },
  { number: '180+', label: 'Problems' },
  { number: '50+', label: 'Visualizations' },
  { number: '4', label: 'Languages' },
]

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-32 bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        <h1 className="text-6xl font-black text-white mb-6 leading-tight">
          Master DSA <span className="text-violet-500">Visually</span> 🚀
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl">
          Watch every algorithm come to life. Step-by-step animations,
          synchronized code, and hands-on practice — all in one place.
        </p>
        <Link to="/topics">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-colors"
          >
            Start Learning →
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex gap-16 mt-20"
      >
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl font-black text-violet-400">{stat.number}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default Hero