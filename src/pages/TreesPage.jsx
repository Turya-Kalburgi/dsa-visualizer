import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const tree = {
  value: 1,
  left: { value: 2, left: { value: 4 }, right: { value: 5 } },
  right: { value: 3, left: { value: 6 }, right: { value: 7 } }
}

const termCards = [
  { term: 'root', detail: 'The top node where the tree starts.' },
  { term: 'node', detail: 'A single value stored in the tree.' },
  { term: 'leaf', detail: 'A node with no children.' },
  { term: 'height', detail: 'How many levels the tree has.' },
  { term: 'depth', detail: 'How far a node is from the root.' }
]

const patternCodeSnippets = {
  'Inorder DFS': {
    Java: [
      'void inorder(Node node) {',
      '  if (node == null) return;',
      '  inorder(node.left);',
      '  visit(node);',
      '  inorder(node.right);',
      '}'
    ],
    Python: [
      'def inorder(node):',
      '    if not node: return',
      '    inorder(node.left)',
      '    visit(node)',
      '    inorder(node.right)'
    ],
    JavaScript: [
      'function inorder(node) {',
      '  if (!node) return;',
      '  inorder(node.left);',
      '  visit(node);',
      '  inorder(node.right);',
      '}'
    ],
    'C++': [
      'void inorder(Node* node) {',
      '  if (!node) return;',
      '  inorder(node->left);',
      '  visit(node);',
      '  inorder(node->right);',
      '}'
    ]
  },
  'Level Order BFS': {
    Java: [
      'void bfs(Node root) {',
      '  Queue<Node> queue = new LinkedList<>();',
      '  queue.add(root);',
      '  while (!queue.isEmpty()) {',
      '    Node node = queue.remove();',
      '    visit(node);',
      '    if (node.left != null) queue.add(node.left);',
      '    if (node.right != null) queue.add(node.right);',
      '  }',
      '}'
    ],
    Python: [
      'def bfs(root):',
      '    from collections import deque',
      '    queue = deque([root])',
      '    while queue:',
      '        node = queue.popleft()',
      '        visit(node)',
      '        if node.left: queue.append(node.left)',
      '        if node.right: queue.append(node.right)'
    ],
    JavaScript: [
      'function bfs(root) {',
      '  const queue = [root];',
      '  while (queue.length) {',
      '    const node = queue.shift();',
      '    visit(node);',
      '    if (node.left) queue.push(node.left);',
      '    if (node.right) queue.push(node.right);',
      '  }',
      '}'
    ],
    'C++': [
      'void bfs(Node* root) {',
      '  queue<Node*> q;',
      '  q.push(root);',
      '  while (!q.empty()) {',
      '    Node* node = q.front(); q.pop();',
      '    visit(node);',
      '    if (node->left) q.push(node->left);',
      '    if (node->right) q.push(node->right);',
      '  }',
      '}'
    ]
  },
  'Max Depth': {
    Java: [
      'int maxDepth(Node node) {',
      '  if (node == null) return 0;',
      '  return 1 + Math.max(',
      '      maxDepth(node.left),',
      '      maxDepth(node.right));',
      '}'
    ],
    Python: [
      'def max_depth(node):',
      '    if not node: return 0',
      '    return 1 + max(max_depth(node.left), max_depth(node.right))'
    ],
    JavaScript: [
      'function maxDepth(node) {',
      '  if (!node) return 0;',
      '  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));',
      '}'
    ],
    'C++': [
      'int maxDepth(Node* node) {',
      '  if (!node) return 0;',
      '  return 1 + max(maxDepth(node->left), maxDepth(node->right));',
      '}'
    ]
  }
}

const problems = [
  { id: 1, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', description: 'Find the maximum root-to-leaf depth.', hint: 'Use DFS or BFS and track the depth.' },
  { id: 2, title: 'Level Order Traversal', difficulty: 'Medium', description: 'Return the values of a tree level by level.', hint: 'Use a queue to process nodes level-wise.' },
  { id: 3, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', description: 'Compute the best path sum through the tree.', hint: 'Use recursive DP on each subtree.' }
]

const nodePositions = {
  1: { x: 160, y: 40 },
  2: { x: 95, y: 112 },
  3: { x: 225, y: 112 },
  4: { x: 48, y: 180 },
  5: { x: 140, y: 180 },
  6: { x: 195, y: 180 },
  7: { x: 282, y: 180 }
}

function buildInorderSteps(node, steps, visited = []) {
  if (!node) return

  buildInorderSteps(node.left, steps, visited)
  visited = [...visited, node.value]
  steps.push({
    visited,
    activeNode: node.value,
    narration: `Visit ${node.value} after exploring the left side.`,
    depth: 0
  })
  buildInorderSteps(node.right, steps, visited)
}

function buildBfsSteps(root) {
  const steps = []
  const visited = []
  const queue = [root]

  while (queue.length) {
    const node = queue.shift()
    visited.push(node.value)
    const pendingQueue = queue.map((item) => item.value)
    steps.push({
      visited: [...visited],
      activeNode: node.value,
      queue: pendingQueue,
      narration: `Dequeue ${node.value} and enqueue its children.`,
      depth: 0
    })

    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }

  return steps
}

function buildDepthSteps(node, depth = 1, path = [], steps = []) {
  if (!node) return steps

  const nextPath = [...path, node.value]
  steps.push({
    visited: nextPath,
    activeNode: node.value,
    depth,
    narration: `We go down one level to node ${node.value}.`,
    queue: []
  })

  buildDepthSteps(node.left, depth + 1, nextPath, steps)
  buildDepthSteps(node.right, depth + 1, nextPath, steps)
  return steps
}

function TreesPage() {
  const [activePattern, setActivePattern] = useState('Inorder DFS')
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredTerm, setHoveredTerm] = useState('root')

  const patternSteps = useMemo(() => {
    if (activePattern === 'Level Order BFS') return buildBfsSteps(tree)
    if (activePattern === 'Max Depth') return buildDepthSteps(tree)

    const steps = []
    buildInorderSteps(tree, steps)
    return steps
  }, [activePattern])

  useEffect(() => {
    setStep(0)
    setIsPlaying(false)
  }, [activePattern])

  useEffect(() => {
    if (!isPlaying) return undefined

    const interval = window.setInterval(() => {
      setStep((prev) => {
        if (prev >= patternSteps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 900)

    return () => window.clearInterval(interval)
  }, [isPlaying, patternSteps.length])

  const currentStep = patternSteps[Math.min(step, patternSteps.length - 1)] || patternSteps[0]
  const codeLines = patternCodeSnippets[activePattern][activeLanguage] || patternCodeSnippets['Inorder DFS'].Java

  const reset = () => {
    setIsPlaying(false)
    setStep(0)
  }

  const stepForward = () => {
    setStep((prev) => Math.min(prev + 1, patternSteps.length - 1))
  }

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <h1 className="mb-2 text-4xl font-black text-white">Trees</h1>
        <p className="mb-8 text-gray-400">Understand trees by seeing how nodes connect, move, and grow.</p>

        <div className="mb-8 rounded-3xl border border-gray-800 bg-gray-900 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">What is a Tree?</p>
          <p className="mb-4 text-base leading-relaxed text-gray-200">
            A tree is a connected structure made of nodes where each node can branch into children. It is perfect for modeling hierarchies, file systems, family trees, and decision paths.
          </p>
          <div className="flex flex-wrap gap-3">
            {termCards.map((item) => (
              <motion.button
                key={item.term}
                whileHover={{ scale: 1.03, y: -2 }}
                onMouseEnter={() => setHoveredTerm(item.term)}
                onFocus={() => setHoveredTerm(item.term)}
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  hoveredTerm === item.term
                    ? 'border-violet-500 bg-violet-600/20 text-violet-200'
                    : 'border-gray-700 bg-gray-950 text-gray-300'
                }`}
              >
                {item.term}
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={hoveredTerm}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-600/10 px-4 py-3 text-sm text-violet-100"
            >
              <span className="font-semibold capitalize">{hoveredTerm}</span>: {termCards.find((item) => item.term === hoveredTerm)?.detail}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {['Inorder DFS', 'Level Order BFS', 'Max Depth'].map((pattern) => (
            <button
              key={pattern}
              onClick={() => setActivePattern(pattern)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activePattern === pattern
                  ? 'bg-violet-600 text-white shadow-[0_0_18px_rgba(139,92,246,0.25)]'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {pattern}
            </button>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 shadow-[0_0_25px_rgba(139,92,246,0.16)]">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Narration</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">{currentStep?.narration}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{activePattern}</h2>
                <p className="text-sm text-gray-400">
                  {activePattern === 'Inorder DFS'
                    ? 'Visit the left subtree, then the root, then the right subtree.'
                    : activePattern === 'Level Order BFS'
                      ? 'Process nodes level by level using a queue.'
                      : 'Count how many levels the tree reaches from the root.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={stepForward} className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500">Step</button>
                <button onClick={togglePlay} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">{isPlaying ? 'Pause' : 'Play'}</button>
                <button onClick={reset} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">Reset</button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
              <svg viewBox="0 0 330 220" className="mx-auto w-full max-w-xl">
                {[
                  [1, 2],
                  [1, 3],
                  [2, 4],
                  [2, 5],
                  [3, 6],
                  [3, 7]
                ].map(([parent, child]) => {
                  const from = nodePositions[parent]
                  const to = nodePositions[child]
                  return <line key={`${parent}-${child}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#4b5563" strokeWidth="2" />
                })}

                {Object.entries(nodePositions).map(([value, coords]) => {
                  const numericValue = Number(value)
                  const visited = currentStep?.visited?.includes(numericValue)
                  const isActive = currentStep?.activeNode === numericValue
                  return (
                    <motion.g key={value} initial={false} animate={{ scale: isActive ? 1.08 : 1 }}>
                      <circle cx={coords.x} cy={coords.y} r={isActive ? 20 : 18} fill={isActive ? '#7c3aed' : visited ? '#4c1d95' : '#111827'} stroke={isActive ? '#f5f3ff' : '#8b5cf6'} strokeWidth="2" />
                      <text x={coords.x} y={coords.y + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="700">{value}</text>
                    </motion.g>
                  )
                })}
              </svg>

              <div className="mt-5 rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-300">Traversal Result</span>
                  <span className="text-sm text-violet-400">Step {Math.min(step + 1, patternSteps.length)} / {patternSteps.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentStep?.visited || []).map((value) => (
                    <span key={`${value}-${Math.random()}`} className="rounded-full bg-violet-600/20 px-2.5 py-1 text-sm font-semibold text-violet-200">
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              {activePattern === 'Level Order BFS' && (
                <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <div className="mb-2 text-sm font-semibold text-gray-300">Queue</div>
                  <div className="flex flex-wrap gap-2">
                    {(currentStep?.queue || []).length ? (
                      currentStep.queue.map((value) => <span key={value} className="rounded-full bg-gray-800 px-2.5 py-1 text-sm text-gray-200">{value}</span>)
                    ) : (
                      <span className="text-sm text-gray-500">empty</span>
                    )}
                  </div>
                </div>
              )}

              {activePattern === 'Max Depth' && (
                <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <div className="mb-2 text-sm font-semibold text-gray-300">Current Depth</div>
                  <div className="text-2xl font-black text-violet-300">{currentStep?.depth ?? 0}</div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-white">Code</h2>
              <div className="flex flex-wrap gap-2">
                {['Java', 'Python', 'JavaScript', 'C++'].map((language) => (
                  <button
                    key={language}
                    onClick={() => setActiveLanguage(language)}
                    className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                      activeLanguage === language
                        ? 'bg-violet-600 text-white'
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
                <div key={`${activePattern}-${activeLanguage}-${index}`} className="rounded-lg px-3 py-1 text-gray-400">
                  <span className="mr-4 select-none text-gray-600">{index + 1}</span>{line}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-2 text-2xl font-black text-white">Practice Problems</h2>
          <p className="mb-6 text-gray-400">Try these tree and traversal challenges.</p>
          <div className="flex flex-col gap-4">
            {problems.map((problem) => (
              <div key={problem.id} className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-5 transition-all duration-300 hover:border-violet-700">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
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

export default TreesPage
