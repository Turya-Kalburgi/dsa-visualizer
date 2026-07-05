import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const codeSnippets = {
  Java: [
    'class Queue {',
    '  private int[] data = new int[100];',
    '  private int front = 0, rear = -1;',
    '  void enqueue(int value) {',
    '    data[++rear] = value;',
    '  }',
    '  int dequeue() {',
    '    return data[front++];',
    '  }',
    '}'
  ],
  Python: [
    'class Queue:',
    '    def __init__(self):',
    '        self.items = []',
    '    def enqueue(self, value):',
    '        self.items.append(value)',
    '    def dequeue(self):',
    '        return self.items.pop(0)'
  ],
  JavaScript: [
    'class Queue {',
    '  constructor() {',
    '    this.items = [];',
    '  }',
    '  enqueue(value) {',
    '    this.items.push(value);',
    '  }',
    '  dequeue() {',
    '    return this.items.shift();',
    '  }',
    '}'
  ],
  'C++': [
    'class Queue {',
    'public:',
    '  vector<int> data;',
    '  void enqueue(int value) {',
    '    data.push_back(value);',
    '  }',
    '  int dequeue() {',
    '    int value = data.front();',
    '    data.erase(data.begin());',
    '    return value;',
    '  }',
    '};'
  ]
}

const problems = [
  {
    id: 1,
    title: 'Number of Recent Calls',
    difficulty: 'Easy',
    description: 'Track requests in a sliding time window using a queue.',
    hint: 'Remove stale timestamps before counting.'
  },
  {
    id: 2,
    title: 'Design Circular Queue',
    difficulty: 'Medium',
    description: 'Implement a fixed-size queue that wraps around efficiently.',
    hint: 'Use front and rear indices with modulo arithmetic.'
  },
  {
    id: 3,
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    description: 'Maintain the maximum in each sliding window using a deque.',
    hint: 'Think of a monotonic deque instead of a simple queue.'
  }
]

function QueuePage() {
  const [queue, setQueue] = useState(['A', 'B', 'C'])
  const [inputValue, setInputValue] = useState('')
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [lastAction, setLastAction] = useState('idle')

  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java
  const highlightLineMap = {
    Java: lastAction === 'enqueue' ? 3 : 5,
    Python: lastAction === 'enqueue' ? 3 : 5,
    JavaScript: lastAction === 'enqueue' ? 3 : 5,
    'C++': lastAction === 'enqueue' ? 2 : 4
  }
  const highlightedLine = highlightLineMap[activeLanguage] ?? 0

  const handleEnqueue = () => {
    const value = inputValue.trim() || 'D'
    setQueue((prev) => [...prev, value])
    setInputValue('')
    setLastAction('enqueue')
  }

  const handleDequeue = () => {
    setQueue((prev) => (prev.length > 0 ? prev.slice(1) : prev))
    setLastAction('dequeue')
  }

  const frontValue = queue[0] ?? '∅'
  const rearValue = queue[queue.length - 1] ?? '∅'
  const narration = lastAction === 'enqueue'
    ? `Enqueued ${rearValue} at the rear. It will wait until all earlier items are processed.`
    : lastAction === 'dequeue'
      ? queue.length === 0
        ? 'Dequeued the front item and the queue is now empty.'
        : `Dequeued ${frontValue} from the front. ${queue[0]} is now the new front.`
      : 'Queues follow FIFO: the first item added is the first one removed.'

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <h1 className="mb-2 text-4xl font-black text-white">Queues</h1>
        <p className="mb-8 text-gray-400">First In First Out — used in BFS, scheduling, and more</p>

        <div className="mb-8 rounded-2xl border-l-4 border-emerald-500 bg-gray-900 px-6 py-4 shadow-[0_0_25px_rgba(16,185,129,0.16)]">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Narration</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">{narration}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Queue Visualizer</h2>
                <p className="text-sm text-gray-400">Enqueue on the right and dequeue from the left.</p>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Enter a value"
                className="flex-1 rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-500"
              />
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleEnqueue}
                className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Enqueue
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleDequeue}
                className="rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Dequeue
              </motion.button>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
              <div className="mb-4 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                <span>FRONT</span>
                <span>REAR</span>
              </div>

              <div className="flex min-h-[180px] items-center justify-center overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/70 p-4">
                <div className="flex items-center gap-2">
                  <AnimatePresence initial={false}>
                    {queue.map((item, index) => {
                      const isFront = index === 0
                      const isRear = index === queue.length - 1
                      return (
                        <motion.div
                          key={`${item}-${index}`}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-sm font-black shadow-lg ${
                            isFront
                              ? 'border-red-400 bg-red-600 text-white shadow-red-500/30'
                              : isRear
                                ? 'border-emerald-400 bg-emerald-600 text-white shadow-emerald-500/30'
                                : 'border-gray-700 bg-gray-800 text-gray-200'
                          }`}
                        >
                          {item}
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {queue.length === 0 ? (
                <p className="mt-6 text-sm text-gray-500">The queue is empty. Enqueue a value to begin.</p>
              ) : (
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span>Front: <span className="font-semibold text-red-400">{frontValue}</span></span>
                  <span>Rear: <span className="font-semibold text-emerald-400">{rearValue}</span></span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Queue Operations</h2>
              <div className="flex gap-2">
                {Object.keys(codeSnippets).map((language) => (
                  <button
                    key={language}
                    onClick={() => setActiveLanguage(language)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                      activeLanguage === language
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-auto rounded-2xl bg-gray-950 p-4 font-mono text-sm">
              {codeLines.map((line, index) => (
                <div
                  key={`${activeLanguage}-${index}`}
                  className={`rounded-lg px-3 py-1 transition-all duration-300 ${
                    index === highlightedLine
                      ? 'border-l-4 border-emerald-500 bg-emerald-600/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'text-gray-400'
                  }`}
                >
                  <span className="mr-4 select-none text-gray-600">{index + 1}</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-2 text-2xl font-black text-white">Practice Problems</h2>
          <p className="mb-6 text-gray-400">Sharpen your queue intuition with these classic tasks.</p>
          <div className="flex flex-col gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-5 transition-all duration-300 hover:border-emerald-700"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-white">{problem.title}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      problem.difficulty === 'Easy'
                        ? 'bg-green-500/20 text-green-400'
                        : problem.difficulty === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
                <p className="mb-3 text-sm text-gray-400">{problem.description}</p>
                <p className="text-xs font-medium text-emerald-400">Hint: {problem.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <CodeEditor />
      </div>
    </div>
  )
}

export default QueuePage
