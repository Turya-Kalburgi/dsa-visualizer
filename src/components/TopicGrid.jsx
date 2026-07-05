import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const topics = [
  { id: 'arrays', title: 'Arrays', icon: '▦', color: 'from-orange-500 to-pink-500', problems: 24, difficulty: 'Beginner', featured: true },
  { id: 'linked-list', title: 'Linked List', icon: '⬡', color: 'from-blue-500 to-cyan-400', problems: 18, difficulty: 'Beginner' },
  { id: 'stacks', title: 'Stacks', icon: '⬘', color: 'from-green-500 to-emerald-400', problems: 15, difficulty: 'Beginner' },
  { id: 'queues', title: 'Queues', icon: '⟶', color: 'from-yellow-500 to-orange-400', problems: 12, difficulty: 'Beginner' },
  { id: 'trees', title: 'Trees', icon: '⌥', color: 'from-violet-500 to-purple-400', problems: 28, difficulty: 'Intermediate' },
  { id: 'graphs', title: 'Graphs', icon: '⬡', color: 'from-pink-500 to-rose-400', problems: 22, difficulty: 'Intermediate' },
  { id: 'binary-search', title: 'Binary Search', icon: '⌖', color: 'from-cyan-500 to-blue-400', problems: 20, difficulty: 'Intermediate' },
  { id: 'sorting', title: 'Sorting', icon: '≋', color: 'from-red-500 to-orange-400', problems: 10, difficulty: 'Beginner' },
  { id: 'recursion', title: 'Recursion', icon: '↺', color: 'from-indigo-500 to-violet-400', problems: 16, difficulty: 'Intermediate' },
  { id: 'heaps', title: 'Heaps', icon: '△', color: 'from-teal-500 to-green-400', problems: 14, difficulty: 'Intermediate' },
  { id: 'dp', title: 'Dynamic Programming', icon: '⊞', color: 'from-fuchsia-500 to-pink-400', problems: 30, difficulty: 'Advanced' },
  { id: 'tries', title: 'Tries', icon: '⌬', color: 'from-amber-500 to-yellow-400', problems: 10, difficulty: 'Advanced' },
]

function TopicCard({ topic, index, status, onSelect }) {
  const navigate = useNavigate()

  const handleClick = () => {
    onSelect(topic.id)
    navigate(`/topic/${topic.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -8, scale: 1.03 }}
      onClick={handleClick}
      className="group cursor-pointer rounded-[28px] border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition-all duration-300 hover:border-violet-500/50"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${topic.color} text-2xl transition-transform duration-300 group-hover:scale-110`}>
          {topic.icon}
        </div>
        <div className="flex flex-col items-end gap-2">
          {topic.featured && (
            <span className="rounded-full bg-violet-600/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300">
              Start Here
            </span>
          )}
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
            status === 'in-progress' ? 'bg-amber-500/20 text-amber-300' :
            'bg-gray-800 text-gray-400'
          }`}>
            {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Not Started'}
          </span>
        </div>
      </div>

      <h3 className="mb-2 text-xl font-black text-white">{topic.title}</h3>
      <p className="mb-4 text-sm text-gray-400">{topic.problems} problems</p>

      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
        topic.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
        topic.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-red-500/20 text-red-400'
      }`}>
        {topic.difficulty}
      </span>
    </motion.div>
  )
}

function TopicGrid() {
  const [statuses, setStatuses] = useState({})

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('dsa-visualizer-topic-status')
      if (saved) {
        setStatuses(JSON.parse(saved))
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const handleSelect = (topicId) => {
    setStatuses((prev) => {
      const current = prev[topicId] || 'not-started'
      const next = current === 'completed' ? 'not-started' : current === 'in-progress' ? 'completed' : 'in-progress'
      const updated = { ...prev, [topicId]: next }
      try {
        window.localStorage.setItem('dsa-visualizer-topic-status', JSON.stringify(updated))
      } catch {
        // ignore storage errors
      }
      return updated
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 text-center text-4xl font-black text-white"
      >
        Pick Your Topic
      </motion.h2>
      <p className="mb-12 text-center text-lg text-gray-400">12 core concepts. Master them all.</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topics.map((topic, index) => (
          <TopicCard key={topic.id} topic={topic} index={index} status={statuses[topic.id] || 'not-started'} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  )
}

export default TopicGrid