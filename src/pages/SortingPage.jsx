import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const initialArray = [64, 34, 25, 12, 22, 11, 90]

const codeSnippets = {
  Java: [
    'void bubbleSort(int[] arr) {',
    '  for (int i = 0; i < arr.length; i++) {',
    '    for (int j = 0; j < arr.length - i - 1; j++) {',
    '      if (arr[j] > arr[j + 1]) swap(arr, j, j + 1);',
    '    }',
    '  }',
    '}'
  ],
  Python: [
    'def bubble_sort(arr):',
    '    n = len(arr)',
    '    for i in range(n):',
    '        for j in range(0, n - i - 1):',
    '            if arr[j] > arr[j + 1]:',
    '                arr[j], arr[j + 1] = arr[j + 1], arr[j]'
  ],
  JavaScript: [
    'function bubbleSort(arr) {',
    '  for (let i = 0; i < arr.length; i++) {',
    '    for (let j = 0; j < arr.length - i - 1; j++) {',
    '      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];',
    '    }',
    '  }',
    '}'
  ],
  'C++': [
    'void bubbleSort(vector<int>& arr) {',
    '  for (int i = 0; i < arr.size(); i++) {',
    '    for (int j = 0; j < arr.size() - i - 1; j++) {',
    '      if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);',
    '    }',
    '  }',
    '}'
  ]
}

const problems = [
  { id: 1, title: 'Sort Colors', difficulty: 'Easy', description: 'Sort an array of 0s, 1s, and 2s in-place.', hint: 'Use a three-way partition.' },
  { id: 2, title: 'Merge Intervals', difficulty: 'Medium', description: 'Merge overlapping intervals into a compact set.', hint: 'Sort intervals by their start values.' },
  { id: 3, title: 'Largest Number', difficulty: 'Hard', description: 'Arrange numbers to form the largest possible number.', hint: 'Use custom comparator sorting.' }
]

function buildBubbleSteps(arr) {
  const steps = []
  const values = [...arr]
  for (let i = 0; i < values.length; i += 1) {
    for (let j = 0; j < values.length - i - 1; j += 1) {
      const swapped = values[j] > values[j + 1]
      if (swapped) {
        ;[values[j], values[j + 1]] = [values[j + 1], values[j]]
      }
      steps.push({ array: [...values], swap: swapped ? [j, j + 1] : null })
    }
  }
  return steps
}

function buildMergeSteps(arr) {
  const steps = []
  const sort = (values) => {
    if (values.length <= 1) return values
    const mid = Math.floor(values.length / 2)
    const left = sort(values.slice(0, mid))
    const right = sort(values.slice(mid))
    const merged = []
    let i = 0
    let j = 0
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        merged.push(left[i])
        i += 1
      } else {
        merged.push(right[j])
        j += 1
      }
    }
    while (i < left.length) merged.push(left[i++])
    while (j < right.length) merged.push(right[j++])
    steps.push([...merged])
    return merged
  }
  sort([...arr])
  return steps
}

function SortingPage() {
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const bubbleSteps = useMemo(() => buildBubbleSteps(initialArray), [])
  const mergeSteps = useMemo(() => buildMergeSteps(initialArray), [])
  const bubbleState = bubbleSteps[Math.min(step, bubbleSteps.length - 1)]
  const mergeState = mergeSteps[Math.min(step, mergeSteps.length - 1)]
  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java
  const highlightedLine = 2

  const play = () => {
    setIsPlaying(true)
    let index = step
    const interval = setInterval(() => {
      index += 1
      if (index >= Math.max(bubbleSteps.length, mergeSteps.length)) {
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
        <h1 className="mb-2 text-4xl font-black text-white">Sorting</h1>
        <p className="mb-8 text-gray-400">Compare classic sorting strategies and watch them evolve.</p>

        <div className="mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 shadow-[0_0_25px_rgba(139,92,246,0.16)]">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Narration</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">
            {bubbleState.swap
              ? `Bubble Sort swaps positions ${bubbleState.swap[0]} and ${bubbleState.swap[1]} in red.`
              : 'Bubble Sort is comparing adjacent values while Merge Sort builds sorted subarrays.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Bubble Sort</h2>
                <p className="text-sm text-gray-400">Swaps are highlighted in red.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep((prev) => Math.min(prev + 1, bubbleSteps.length - 1))} className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500">Step</button>
                <button onClick={() => { if (isPlaying) { setIsPlaying(false) } else { play() } }} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">{isPlaying ? 'Pause' : 'Play'}</button>
                <button onClick={reset} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">Reset</button>
              </div>
            </div>
            <div className="flex h-56 items-end justify-center gap-2 rounded-2xl border border-gray-800 bg-gray-950/80 p-4">
              {bubbleState.array.map((value, index) => (
                <motion.div key={`${value}-${index}`} layout initial={{ height: 0 }} animate={{ height: `${(value / 90) * 100}%` }} className={`w-8 rounded-t-xl ${bubbleState.swap?.includes(index) ? 'bg-red-500' : 'bg-violet-600'}`} />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Merge Sort</h2>
              <p className="text-sm text-gray-400">Sorted subarrays are merged step by step.</p>
            </div>
            <div className="flex h-56 items-end justify-center gap-2 rounded-2xl border border-gray-800 bg-gray-950/80 p-4">
              {mergeState.map((value, index) => (
                <motion.div key={`${value}-${index}`} layout initial={{ height: 0 }} animate={{ height: `${(value / 90) * 100}%` }} className="w-8 rounded-t-xl bg-emerald-500" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Sorting Code</h2>
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
          <p className="mb-6 text-gray-400">Apply your sorting intuition to these interview favorites.</p>
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

export default SortingPage
