import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const nodeLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const positions = [
  { x: 155, y: 45 },
  { x: 80, y: 95 },
  { x: 230, y: 95 },
  { x: 50, y: 175 },
  { x: 120, y: 215 },
  { x: 200, y: 215 },
  { x: 275, y: 175 }
]

const adjacency = {
  A: [{ to: 'B', weight: 4 }, { to: 'C', weight: 2 }],
  B: [{ to: 'A', weight: 4 }, { to: 'D', weight: 5 }, { to: 'E', weight: 1 }],
  C: [{ to: 'A', weight: 2 }, { to: 'F', weight: 7 }],
  D: [{ to: 'B', weight: 5 }, { to: 'G', weight: 3 }],
  E: [{ to: 'B', weight: 1 }],
  F: [{ to: 'C', weight: 7 }],
  G: [{ to: 'D', weight: 3 }]
}

const graphFacts = [
  { title: 'Nodes', detail: 'Vertices are the circle-shaped points in the graph.' },
  { title: 'Edges', detail: 'Connections between nodes. They can be one-way or two-way.' },
  { title: 'Directed vs Undirected', detail: 'A directed graph has arrows, while undirected graphs can be traveled both ways.' },
  { title: 'Weighted vs Unweighted', detail: 'Weighted graphs assign costs to edges, which helps when finding shortest paths.' }
]

const patternCodeSnippets = {
  BFS: {
    Java: [
      'void bfs(char start) {',
      '  boolean[] visited = new boolean[n];',
      '  Queue<Character> queue = new LinkedList<>();',
      '  visited[start] = true;',
      '  queue.add(start);',
      '  while (!queue.isEmpty()) {',
      '    char node = queue.remove();',
      '    for (char next : adj[node]) {',
      '      if (!visited[next]) { visited[next] = true; queue.add(next); }',
      '    }',
      '  }',
      '}'
    ],
    Python: [
      'def bfs(start):',
      '    from collections import deque',
      '    visited = [False] * n',
      '    queue = deque([start])',
      '    while queue:',
      '        node = queue.popleft()',
      '        for nxt in adj[node]:',
      '            if not visited[nxt]:',
      '                visited[nxt] = True',
      '                queue.append(nxt)'
    ],
    JavaScript: [
      'function bfs(start) {',
      '  const visited = Array(n).fill(false);',
      '  const queue = [start];',
      '  while (queue.length) {',
      '    const node = queue.shift();',
      '    for (const next of adj[node]) {',
      '      if (!visited[next]) { visited[next] = true; queue.push(next); }',
      '    }',
      '  }',
      '}'
    ],
    'C++': [
      'void bfs(char start) {',
      '  vector<bool> visited(n, false);',
      '  queue<char> q;',
      '  visited[start] = true; q.push(start);',
      '  while (!q.empty()) {',
      '    char node = q.front(); q.pop();',
      '    for (char nxt : adj[node]) {',
      '      if (!visited[nxt]) { visited[nxt] = true; q.push(nxt); }',
      '    }',
      '  }',
      '}'
    ]
  },
  DFS: {
    Java: [
      'void dfs(char node) {',
      '  visited[node] = true;',
      '  for (char next : adj[node]) {',
      '    if (!visited[next]) dfs(next);',
      '  }',
      '}'
    ],
    Python: [
      'def dfs(node):',
      '    visited[node] = True',
      '    for nxt in adj[node]:',
      '        if not visited[nxt]:',
      '            dfs(nxt)'
    ],
    JavaScript: [
      'function dfs(node) {',
      '  visited[node] = true;',
      '  for (const next of adj[node]) {',
      '    if (!visited[next]) dfs(next);',
      '  }',
      '}'
    ],
    'C++': [
      'void dfs(char node) {',
      '  visited[node] = true;',
      '  for (char nxt : adj[node]) {',
      '    if (!visited[nxt]) dfs(nxt);',
      '  }',
      '}'
    ]
  },
  'Shortest Path': {
    Java: [
      'int[] dijkstra(char start) {',
      '  int[] dist = new int[n];',
      '  Arrays.fill(dist, INF);',
      '  dist[start] = 0;',
      '  while (!visitedAll) {',
      '    char node = pickSmallest();',
      '    relax(node);',
      '  }',
      '  return dist;',
      '}'
    ],
    Python: [
      'def dijkstra(start):',
      '    dist = {node: inf for node in graph}',
      '    dist[start] = 0',
      '    while unvisited:',
      '        node = min(unvisited, key=dist.get)',
      '        relax(node)'
    ],
    JavaScript: [
      'function dijkstra(start) {',
      '  const dist = Object.fromEntries(nodes.map((n) => [n, Infinity]));',
      '  dist[start] = 0;',
      '  while (unvisited.length) {',
      '    const node = pickSmallest(unvisited, dist);',
      '    relax(node);',
      '  }',
      '}'
    ],
    'C++': [
      'vector<int> dijkstra(char start) {',
      '  vector<int> dist(n, INF);',
      '  dist[start] = 0;',
      '  while (!done) {',
      '    char node = pickSmallest();',
      '    relax(node);',
      '  }',
      '  return dist;',
      '}'
    ]
  }
}

const problems = [
  { id: 1, title: 'Find if Path Exists', difficulty: 'Easy', description: 'Determine whether a path exists between two nodes in a graph.', hint: 'Use DFS or BFS from the source.' },
  { id: 2, title: 'Number of Islands', difficulty: 'Medium', description: 'Count connected components of land cells in a grid.', hint: 'Traverse each island using BFS/DFS.' },
  { id: 3, title: 'Word Ladder', difficulty: 'Hard', description: 'Transform one word into another by changing one letter at a time.', hint: 'Use BFS over word states.' }
]

function buildBfsSteps() {
  const steps = []
  const visited = new Set(['A'])
  const visitedOrder = ['A']
  const queue = ['A']
  steps.push({
    visitedOrder: [...visitedOrder],
    queue: [],
    activeNode: 'A',
    adjacencyNode: 'A',
    highlightedEdges: [],
    narration: 'Start at A and place it into the queue to begin the traversal.'
  })

  while (queue.length) {
    const node = queue.shift()
    const newlyVisited = []
    const highlightedEdges = []

    for (const neighbor of adjacency[node]) {
      if (!visited.has(neighbor.to)) {
        visited.add(neighbor.to)
        visitedOrder.push(neighbor.to)
        queue.push(neighbor.to)
        newlyVisited.push(neighbor.to)
        highlightedEdges.push(`${node}-${neighbor.to}`)
      }
    }

    steps.push({
      visitedOrder: [...visitedOrder],
      queue: [...queue],
      activeNode: node,
      adjacencyNode: node,
      highlightedEdges,
      narration: `${node} is being processed. Its unvisited neighbors were added to the queue.`
    })
  }

  return steps
}

function buildDfsSteps() {
  const steps = []
  const visited = new Set(['A'])
  const visitedOrder = ['A']
  const stack = ['A']
  steps.push({
    visitedOrder: [...visitedOrder],
    stack: [],
    activeNode: 'A',
    adjacencyNode: 'A',
    highlightedEdges: [],
    narration: 'Start DFS at A and push it onto the stack.'
  })

  while (stack.length) {
    const node = stack.pop()
    const newlyVisited = []
    const highlightedEdges = []

    for (const neighbor of [...adjacency[node]].reverse()) {
      if (!visited.has(neighbor.to)) {
        visited.add(neighbor.to)
        visitedOrder.push(neighbor.to)
        stack.push(neighbor.to)
        newlyVisited.push(neighbor.to)
        highlightedEdges.push(`${node}-${neighbor.to}`)
      }
    }

    steps.push({
      visitedOrder: [...visitedOrder],
      stack: [...stack],
      activeNode: node,
      adjacencyNode: node,
      highlightedEdges,
      narration: `${node} is popped from the stack and its children are explored next.`
    })
  }

  return steps
}

function buildShortestPathSteps() {
  const steps = []
  const nodes = nodeLabels
  const distances = Object.fromEntries(nodes.map((node) => [node, Number.POSITIVE_INFINITY]))
  const previous = {}
  const visited = new Set()
  const visitedOrder = []
  distances.A = 0

  const getUnvisitedNode = () => {
    let bestNode = null
    let bestDist = Number.POSITIVE_INFINITY
    for (const node of nodes) {
      if (!visited.has(node) && distances[node] < bestDist) {
        bestDist = distances[node]
        bestNode = node
      }
    }
    return bestNode
  }

  steps.push({
    visitedOrder: [],
    distances: { ...distances },
    activeNode: 'A',
    adjacencyNode: 'A',
    highlightedEdges: [],
    narration: 'Begin Dijkstra from A with distance 0 to every node.'
  })

  let current = 'A'
  while (visited.size < nodes.length) {
    current = getUnvisitedNode()
    if (!current) break

    visited.add(current)
    visitedOrder.push(current)
    steps.push({
      visitedOrder: [...visitedOrder],
      distances: { ...distances },
      activeNode: current,
      adjacencyNode: current,
      highlightedEdges: [],
      narration: `${current} is selected as the next closest node.`
    })

    for (const edge of adjacency[current]) {
      const nextDistance = distances[current] + edge.weight
      if (nextDistance < distances[edge.to]) {
        distances[edge.to] = nextDistance
        previous[edge.to] = current
      }
    }

    steps.push({
      visitedOrder: [...visitedOrder],
      distances: { ...distances },
      activeNode: current,
      adjacencyNode: current,
      highlightedEdges: [],
      narration: `Relax the edges from ${current} and update tentative distances.`
    })
  }

  const path = ['G']
  let cursor = 'G'
  while (previous[cursor]) {
    cursor = previous[cursor]
    path.unshift(cursor)
  }

  const pathEdges = []
  for (let i = 1; i < path.length; i += 1) {
    pathEdges.push(`${path[i - 1]}-${path[i]}`)
  }

  steps.push({
    visitedOrder: [...visitedOrder],
    distances: { ...distances },
    activeNode: 'G',
    adjacencyNode: 'G',
    highlightedEdges: pathEdges,
    narration: `The shortest path from A to G is ${path.join(' -> ')}.`
  })

  return steps
}

function GraphsPage() {
  const [activePattern, setActivePattern] = useState('BFS')
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(900)

  const patternSteps = useMemo(() => {
    if (activePattern === 'DFS') return buildDfsSteps()
    if (activePattern === 'Shortest Path') return buildShortestPathSteps()
    return buildBfsSteps()
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
    }, speed)

    return () => window.clearInterval(interval)
  }, [isPlaying, patternSteps.length, speed])

  const currentStep = patternSteps[Math.min(step, patternSteps.length - 1)] || patternSteps[0]
  const codeLines = patternCodeSnippets[activePattern][activeLanguage] || patternCodeSnippets.BFS.Java

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

  const edgeKey = (from, to) => [from, to].sort().join('-')
  const isHighlightedEdge = (from, to) => currentStep?.highlightedEdges?.includes(`${from}-${to}`) || currentStep?.highlightedEdges?.includes(`${to}-${from}`)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <h1 className="mb-2 text-4xl font-black text-white">Graphs</h1>
        <p className="mb-8 text-gray-400">Explore nodes, edges, and traversal patterns in a live graph view.</p>

        <div className="mb-8 rounded-3xl border border-gray-800 bg-gray-900 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">What is a Graph?</p>
          <p className="mb-4 text-base leading-relaxed text-gray-200">
            A graph is a set of nodes connected by edges. It is used to model roads, social networks, maps, and dependency relationships.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {graphFacts.map((fact) => (
              <div key={fact.title} className="rounded-2xl border border-gray-800 bg-gray-950/70 p-3">
                <p className="mb-1 text-sm font-semibold text-violet-300">{fact.title}</p>
                <p className="text-sm text-gray-400">{fact.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {['BFS', 'DFS', 'Shortest Path'].map((pattern) => (
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

        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{activePattern} Visualization</h2>
                <p className="text-sm text-gray-400">
                  {activePattern === 'BFS'
                    ? 'Visit nodes level by level and grow the queue.'
                    : activePattern === 'DFS'
                      ? 'Visit nodes deeply first and keep a stack of pending branches.'
                      : 'Use Dijkstra to find the cheapest route from A to G.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={stepForward} className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500">Step</button>
                <button onClick={togglePlay} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">{isPlaying ? 'Pause' : 'Play'}</button>
                <button onClick={reset} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">Reset</button>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              {[900, 650, 1200].map((value) => (
                <button
                  key={value}
                  onClick={() => setSpeed(value)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition ${speed === value ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  {value === 900 ? 'Normal' : value === 650 ? 'Fast' : 'Slow'}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
              <svg viewBox="0 0 340 260" className="mx-auto w-full max-w-2xl">
                {Object.entries(adjacency).flatMap(([from, neighbors]) => neighbors.map((neighbor) => {
                  const fromIndex = nodeLabels.indexOf(from)
                  const toIndex = nodeLabels.indexOf(neighbor.to)
                  const fromPos = positions[fromIndex]
                  const toPos = positions[toIndex]
                  const highlighted = isHighlightedEdge(from, neighbor.to)
                  return (
                    <g key={`${from}-${neighbor.to}`}>
                      <line
                        x1={fromPos.x}
                        y1={fromPos.y}
                        x2={toPos.x}
                        y2={toPos.y}
                        stroke={highlighted ? (activePattern === 'Shortest Path' ? '#f59e0b' : '#8b5cf6') : '#475569'}
                        strokeWidth={highlighted ? 3.2 : 2.2}
                        strokeLinecap="round"
                      />
                      {activePattern === 'Shortest Path' && (
                        <text x={(fromPos.x + toPos.x) / 2} y={(fromPos.y + toPos.y) / 2 - 6} textAnchor="middle" fill="#fbbf24" fontSize="11">
                          {neighbor.weight}
                        </text>
                      )}
                    </g>
                  )
                }))}

                {positions.map((pos, index) => {
                  const label = nodeLabels[index]
                  const visited = currentStep?.visitedOrder?.includes(label)
                  const active = currentStep?.activeNode === label
                  const color = activePattern === 'Shortest Path'
                    ? (visited ? '#f59e0b' : '#111827')
                    : activePattern === 'DFS'
                      ? (visited ? '#38bdf8' : '#111827')
                      : (visited ? '#22c55e' : '#111827')
                  const border = activePattern === 'Shortest Path'
                    ? '#fde68a'
                    : activePattern === 'DFS'
                      ? '#bae6fd'
                      : '#86efac'

                  return (
                    <motion.g key={label} initial={false} animate={{ scale: active ? 1.08 : 1 }}>
                      <circle cx={pos.x} cy={pos.y} r="23" fill={color} stroke={border} strokeWidth="2" />
                      <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{label}</text>
                    </motion.g>
                  )
                })}
              </svg>

              <div className="mt-5 rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-300">Visited Order</span>
                  <span className="text-sm text-violet-400">Step {Math.min(step + 1, patternSteps.length)} / {patternSteps.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentStep?.visitedOrder || []).map((value) => (
                    <span key={value} className="rounded-full bg-violet-600/20 px-2.5 py-1 text-sm font-semibold text-violet-200">
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <div className="mb-2 text-sm font-semibold text-gray-300">Adjacency List</div>
                  <div className="space-y-2 text-sm text-gray-300">
                    {nodeLabels.map((label) => (
                      <div key={label} className={`rounded-xl px-3 py-2 ${currentStep?.adjacencyNode === label ? 'bg-violet-600/20 text-violet-100' : 'bg-gray-900/70 text-gray-300'}`}>
                        <span className="mr-2 font-semibold text-white">{label}</span>
                        {adjacency[label].map((edge) => `${edge.to}(${edge.weight || ''})`).join(' → ')}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <div className="mb-2 text-sm font-semibold text-gray-300">Structure</div>
                  {activePattern === 'BFS' && (
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>Queue: {(currentStep?.queue || []).join(' → ') || 'empty'}</p>
                      <p>Current node: {currentStep?.activeNode}</p>
                    </div>
                  )}
                  {activePattern === 'DFS' && (
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>Stack: {(currentStep?.stack || []).join(' → ') || 'empty'}</p>
                      <p>Current node: {currentStep?.activeNode}</p>
                    </div>
                  )}
                  {activePattern === 'Shortest Path' && (
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>Distances: {Object.entries(currentStep?.distances || {}).map(([node, distance]) => `${node}=${distance}`).join(', ')}</p>
                      <p>Current node: {currentStep?.activeNode}</p>
                    </div>
                  )}
                </div>
              </div>
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
          <p className="mb-6 text-gray-400">Take on graph traversal challenges.</p>
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

export default GraphsPage
