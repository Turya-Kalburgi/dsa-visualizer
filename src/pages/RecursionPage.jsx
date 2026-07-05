import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const codeSnippets = {
  Java: [
    'int factorial(int n) {',
    '  if (n == 0) return 1;',
    '  return n * factorial(n - 1);',
    '}'
  ],
  Python: [
    'def factorial(n):',
    '    if n == 0:',
    '        return 1',
    '    return n * factorial(n - 1)'
  ],
  JavaScript: [
    'function factorial(n) {',
    '  if (n === 0) return 1;',
    '  return n * factorial(n - 1);',
    '}'
  ],
  'C++': [
    'int factorial(int n) {',
    '  if (n == 0) return 1;',
    '  return n * factorial(n - 1);',
    '}'
  ]
}

const problems = [
  {
    id: 1,
    title: 'Fibonacci Number',
    difficulty: 'Easy',
    description: 'Write a recursive solution to compute the nth Fibonacci number.',
    hint: 'Use the recurrence F(n) = F(n - 1) + F(n - 2).'
  },
  {
    id: 2,
    title: 'Permutations',
    difficulty: 'Medium',
    description: 'Generate every permutation of a set of distinct integers.',
    hint: 'Build the result incrementally and backtrack.'
  },
  {
    id: 3,
    title: 'N-Queens',
    difficulty: 'Hard',
    description: 'Place N queens on an N×N board so none attack each other.',
    hint: 'Use backtracking and column/diagonal tracking.'
  }
]

function RecursionPage() {
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const frames = useMemo(() => {
    const calls = [5, 4, 3, 2, 1, 0]
    const stackFrames = calls.map((value) => ({ value, active: value === 5 }))
    return [
      { type: 'build', stack: [5], active: 5, message: 'factorial(5) starts and calls factorial(4).' },
      { type: 'build', stack: [5, 4], active: 4, message: 'factorial(4) calls factorial(3).' },
      { type: 'build', stack: [5, 4, 3], active: 3, message: 'factorial(3) calls factorial(2).' },
      { type: 'build', stack: [5, 4, 3, 2], active: 2, message: 'factorial(2) calls factorial(1).' },
      { type: 'build', stack: [5, 4, 3, 2, 1], active: 1, message: 'factorial(1) calls factorial(0).' },
      { type: 'base', stack: [5, 4, 3, 2, 1, 0], active: 0, message: 'Base case reached: factorial(0) returns 1.' },
      { type: 'unwind', stack: [5, 4, 3, 2, 1], active: 1, message: 'factorial(1) returns 1 × 1 = 1.' },
      { type: 'unwind', stack: [5, 4, 3, 2], active: 2, message: 'factorial(2) returns 2 × 1 = 2.' },
      { type: 'unwind', stack: [5, 4, 3], active: 3, message: 'factorial(3) returns 3 × 2 = 6.' },
      { type: 'unwind', stack: [5, 4], active: 4, message: 'factorial(4) returns 4 × 6 = 24.' },
      { type: 'unwind', stack: [5], active: 5, message: 'factorial(5) returns 5 × 24 = 120.' },
      { type: 'done', stack: [], active: null, message: 'The recursion finishes and the final value is 120.' }
    ]
  }, [])

  const currentFrame = frames[step] || frames[0]
  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java
  const highlightedLine = activeLanguage === 'Python' ? 2 : 1

  const play = () => {
    setIsPlaying(true)
    let index = step
    const interval = setInterval(() => {
      index += 1
      if (index >= frames.length) {
        clearInterval(interval)
        setIsPlaying(false)
        return
      }
      setStep(index)
    }, 700)

    return () => clearInterval(interval)
  }

  const reset = () => {
    setIsPlaying(false)
    setStep(0)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <h1 className="mb-2 text-4xl font-black text-white">Recursion</h1>
        <p className="mb-8 text-gray-400">A function that calls itself — until it doesn&apos;t</p>

        <div className="mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 shadow-[0_0_25px_rgba(139,92,246,0.16)]">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Narration</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">{currentFrame.message}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Recursion Visualizer</h2>
                <p className="text-sm text-gray-400">Watch factorial(5) build up and unwind.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    setStep((prev) => Math.min(prev + 1, frames.length - 1))
                  }}
                  className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500"
                >
                  Next
                </button>
                <button
                  onClick={() => {
                    if (isPlaying) {
                      reset()
                    } else {
                      play()
                    }
                  }}
                  className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
              <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                <span>Call Stack</span>
                <span>Current</span>
              </div>

              <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
                <AnimatePresence mode="popLayout">
                  {currentFrame.stack.map((value) => {
                    const isActive = value === currentFrame.active
                    return (
                      <motion.div
                        key={`${value}-${currentFrame.type}`}
                        layout
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                        className={`flex h-14 w-40 items-center justify-center rounded-2xl border text-sm font-black shadow-lg ${
                          isActive
                            ? 'border-violet-400 bg-violet-600 text-white shadow-violet-500/30'
                            : 'border-gray-700 bg-gray-800 text-gray-200'
                        }`}
                      >
                        factorial({value})
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {currentFrame.type === 'unwind' && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm font-semibold text-emerald-400"
                >
                  Returning value: {currentFrame.stack.length > 0 ? '...' : '120'}
                </motion.p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recursive Code</h2>
              <div className="flex gap-2">
                {Object.keys(codeSnippets).map((language) => (
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
                <div
                  key={`${activeLanguage}-${index}`}
                  className={`rounded-lg px-3 py-1 transition-all duration-300 ${
                    index === highlightedLine
                      ? 'border-l-4 border-violet-500 bg-violet-600/40 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
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
          <p className="mb-6 text-gray-400">Work through recursion patterns beyond the base case.</p>
          <div className="flex flex-col gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-5 transition-all duration-300 hover:border-violet-700"
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

export default RecursionPage
