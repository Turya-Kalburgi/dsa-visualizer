import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const topics = [
  { id: 'arrays', title: 'Arrays', icon: '▦', color: 'from-orange-500 to-pink-500', problems: 24, difficulty: 'Beginner' },
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

function TopicCard({ topic, index }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -8, scale: 1.03 }}
      onClick={() => navigate(`/topic/${topic.id}`)}
      className="cursor-pointer rounded-3xl p-6 bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-300 group"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {topic.icon}
      </div>
      <h3 className="text-white font-bold text-lg mb-1">{topic.title}</h3>
      <p className="text-gray-500 text-sm mb-4">{topic.problems} problems</p>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
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
  return (
    <div className="px-8 py-16 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-black text-white mb-4 text-center"
      >
        Pick Your Topic
      </motion.h2>
      <p className="text-gray-400 text-center mb-12 text-lg">12 core concepts. Master them all.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {topics.map((topic, index) => (
          <TopicCard key={topic.id} topic={topic} index={index} />
        ))}
      </div>
    </div>
  )
}

export default TopicGrid