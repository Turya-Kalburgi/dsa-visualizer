import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const codeSnippets = {
  Java: [
    'void insert(int value) {',
    '  heap.add(value);',
    '  bubbleUp(heap.size() - 1);',
    '}',
    'int extractMin() {',
    '  int root = heap.get(0);',
    '  heap.set(0, heap.removeLast());',
    '  siftDown(0);',
    '  return root;',
    '}'
  ],
  Python: [
    'def insert(self, value):',
    '    self.heap.append(value)',
    '    self._bubble_up(len(self.heap) - 1)',
    'def extract_min(self):',
    '    root = self.heap[0]',
    '    self.heap[0] = self.heap.pop()',
    '    self._sift_down(0)',
    '    return root'
  ],
  JavaScript: [
    'insert(value) {',
    '  this.heap.push(value);',
    '  this.bubbleUp(this.heap.length - 1);',
    '}',
    'extractMin() {',
    '  const root = this.heap[0];',
    '  this.heap[0] = this.heap.pop();',
    '  this.siftDown(0);',
    '  return root;',
    '}'
  ],
  'C++': [
    'void insert(int value) {',
    '  data.push_back(value);',
    '  bubbleUp(data.size() - 1);',
    '}',
    'int extractMin() {',
    '  int root = data.front();',
    '  data[0] = data.back(); data.pop_back();',
    '  siftDown(0);',
    '  return root;',
    '}'
  ]
}

const problems = [
  { id: 1, title: 'Last Stone Weight', difficulty: 'Easy', description: 'Use a max heap to repeatedly remove the two heaviest stones.', hint: 'A max-heap gives you the largest stone quickly.' },
  { id: 2, title: 'K Closest Points', difficulty: 'Medium', description: 'Find the k points nearest to the origin.', hint: 'A min-heap of distances is a natural fit.' },
  { id: 3, title: 'Find Median from Data Stream', difficulty: 'Hard', description: 'Maintain the median while values arrive online.', hint: 'Use two heaps to keep the data partitioned.' }
]

function HeapsPage() {
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [heap, setHeap] = useState([2, 6, 4, 8, 10])
  const [message, setMessage] = useState('Insert a new value to see it bubble up to the right position.')

  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java
  const highlightedLine = 0

  const insert = () => {
    const next = [4, 2, 7, 5, 6, 3]
    const value = next[heap.length % next.length]
    setHeap((prev) => [...prev, value])
    setMessage(`Inserted ${value}. It moves upward until it is smaller than its parent.`)
  }

  const extractMin = () => {
    if (heap.length === 0) return
    const root = heap[0]
    const next = [...heap.slice(1)]
    setHeap(next)
    setMessage(`Extracted ${root}. The new root is sifted down to restore heap order.`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <h1 className="mb-2 text-4xl font-black text-white">Heaps</h1>
        <p className="mb-8 text-gray-400">A min-heap keeps the smallest value at the root.</p>

        <div className="mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 shadow-[0_0_25px_rgba(139,92,246,0.16)]">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Narration</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">{message}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Min-Heap Visualizer</h2>
                <p className="text-sm text-gray-400">The root is always the smallest element.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={insert} className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500">Insert</button>
                <button onClick={extractMin} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">Extract Min</button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
              <div className="flex justify-center gap-4">
                {heap.map((value, index) => (
                  <motion.div key={`${value}-${index}`} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-black ${index === 0 ? 'border-violet-400 bg-violet-600 text-white' : 'border-gray-700 bg-gray-800 text-gray-200'}`}>
                    {value}
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/70 p-4 text-sm text-gray-400">
                <p>Current heap: {heap.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Heap Operations Code</h2>
              <div className="flex gap-2">
                {Object.keys(codeSnippets).map((language) => (
                  <button key={language} onClick={() => setActiveLanguage(language)} className={`rounded-full px-3 py-1 text-sm font-semibold transition ${activeLanguage === language ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                    {language}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-auto rounded-2xl bg-gray-950 p-4 font-mono text-sm">
              {codeLines.map((line, index) => (
                <div key={`${activeLanguage}-${index}`} className={`rounded-lg px-3 py-1 transition-all duration-300 ${index === highlightedLine ? 'border-l-4 border-violet-500 bg-violet-600/40 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.25)]' : 'text-gray-400'}`}>
                  <span className="mr-4 select-none text-gray-600">{index + 1}</span>{line}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-2 text-2xl font-black text-white">Practice Problems</h2>
          <p className="mb-6 text-gray-400">Use heap techniques for these classic problems.</p>
          <div className="flex flex-col gap-4">
            {problems.map((problem) => (
              <div key={problem.id} className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-5 transition-all duration-300 hover:border-violet-700">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-white">{problem.title}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{problem.difficulty}</span>
                </div>
                <p className="mb-3 text-sm text-gray-400">{problem.description}</p>
                <p className="text-xs font-medium text-violet-400">Hint: {problem.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <CodeEditor />
      </div>
    </div>
  )
}

export default HeapsPage
