import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const values = [2, 4, 7, 9, 12, 15, 18, 21, 25]
const target = 15

const codeSnippets = {
  Java: [
    'int binarySearch(int[] arr, int target) {',
    '  int low = 0, high = arr.length - 1;',
    '  while (low <= high) {',
    '    int mid = low + (high - low) / 2;',
    '    if (arr[mid] == target) return mid;',
    '    if (arr[mid] < target) low = mid + 1;',
    '    else high = mid - 1;',
    '  }',
    '  return -1;',
    '}'
  ],
  Python: [
    'def binary_search(arr, target):',
    '    low, high = 0, len(arr) - 1',
    '    while low <= high:',
    '        mid = (low + high) // 2',
    '        if arr[mid] == target:',
    '            return mid',
    '        if arr[mid] < target:',
    '            low = mid + 1',
    '        else:',
    '            high = mid - 1',
    '    return -1'
  ],
  JavaScript: [
    'function binarySearch(arr, target) {',
    '  let low = 0, high = arr.length - 1;',
    '  while (low <= high) {',
    '    let mid = Math.floor((low + high) / 2);',
    '    if (arr[mid] === target) return mid;',
    '    if (arr[mid] < target) low = mid + 1;',
    '    else high = mid - 1;',
    '  }',
    '  return -1;',
    '}'
  ],
  'C++': [
    'int binarySearch(vector<int> arr, int target) {',
    '  int low = 0, high = arr.size() - 1;',
    '  while (low <= high) {',
    '    int mid = low + (high - low) / 2;',
    '    if (arr[mid] == target) return mid;',
    '    if (arr[mid] < target) low = mid + 1;',
    '    else high = mid - 1;',
    '  }',
    '  return -1;',
    '}'
  ]
}

const problems = [
  {
    id: 1,
    title: 'Binary Search',
    difficulty: 'Easy',
    description: 'Implement binary search on a sorted array.',
    hint: 'Keep shrinking the search range by half.'
  },
  {
    id: 2,
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    description: 'Locate the minimum in a rotated sorted array.',
    hint: 'Compare the middle element with the right boundary.'
  },
  {
    id: 3,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    description: 'Find the median of two sorted arrays in logarithmic time.',
    hint: 'Binary search on the smaller array to partition both arrays.'
  }
]

function BinarySearchPage() {
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const animationSteps = useMemo(() => [
    {
      low: 0,
      mid: 4,
      high: 8,
      narration: 'Start with the full range from the first to the last index.'
    },
    {
      low: 0,
      mid: 4,
      high: 8,
      narration: 'Compute the midpoint and compare it with the target 15.'
    },
    {
      low: 5,
      mid: 6,
      high: 8,
      narration: 'The middle value is 12, which is less than 15, so discard the left half.'
    },
    {
      low: 5,
      mid: 6,
      high: 8,
      narration: 'Now search the right half and compute the next midpoint.'
    },
    {
      low: 5,
      mid: 6,
      high: 8,
      narration: 'The midpoint is 18, which is greater than 15, so discard the right half.'
    },
    {
      low: 5,
      mid: 5,
      high: 5,
      narration: 'The remaining range narrows to a single element, which is the target.'
    },
    {
      low: 5,
      mid: 5,
      high: 5,
      narration: 'Target found at index 5.'
    }
  ], [])

  const currentStep = animationSteps[Math.min(step, animationSteps.length - 1)]
  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java
  const highlightedLineMap = {
    Java: [1, 2, 3, 4, 5, 6, 7, 8],
    Python: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    JavaScript: [1, 2, 3, 4, 5, 6, 7, 8],
    'C++': [1, 2, 3, 4, 5, 6, 7, 8]
  }
  const highlightedLine = highlightedLineMap[activeLanguage]?.[Math.min(step, highlightedLineMap[activeLanguage].length - 1)] ?? 0

  const play = () => {
    setIsPlaying(true)
    let index = step
    const interval = setInterval(() => {
      index += 1
      if (index >= animationSteps.length) {
        clearInterval(interval)
        setIsPlaying(false)
        return
      }
      setStep(index)
    }, 800)

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
        <h1 className="mb-2 text-4xl font-black text-white">Binary Search</h1>
        <p className="mb-8 text-gray-400">Eliminate half the search space with every step</p>

        <div className="mb-8 rounded-2xl border-l-4 border-emerald-500 bg-gray-900 px-6 py-4 shadow-[0_0_25px_rgba(16,185,129,0.16)]">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Narration</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">{currentStep.narration}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Binary Search Visualizer</h2>
                <p className="text-sm text-gray-400">Target: <span className="font-semibold text-emerald-400">{target}</span></p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep((prev) => Math.min(prev + 1, animationSteps.length - 1))}
                  className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  Step
                </button>
                <button
                  onClick={() => {
                    if (isPlaying) {
                      setIsPlaying(false)
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
                <span>Low</span>
                <span>Mid</span>
                <span>High</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
                {values.map((value, index) => {
                  const isLow = index === currentStep.low
                  const isMid = index === currentStep.mid
                  const isHigh = index === currentStep.high
                  const isTarget = value === target

                  return (
                    <motion.div
                      key={`${value}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-sm font-black shadow-lg ${
                        isLow
                          ? 'border-emerald-400 bg-emerald-600 text-white'
                          : isMid
                            ? 'border-violet-400 bg-violet-600 text-white'
                            : isHigh
                              ? 'border-red-400 bg-red-600 text-white'
                              : isTarget
                                ? 'border-emerald-500/40 bg-emerald-950 text-emerald-300'
                                : 'border-gray-700 bg-gray-800 text-gray-200'
                      }`}
                    >
                      {value}
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
                <span className="text-emerald-400">LOW = {currentStep.low}</span>
                <span className="text-violet-400">MID = {currentStep.mid}</span>
                <span className="text-red-400">HIGH = {currentStep.high}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Binary Search Code</h2>
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
          <p className="mb-6 text-gray-400">Apply binary search logic to common interview problems.</p>
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

export default BinarySearchPage
