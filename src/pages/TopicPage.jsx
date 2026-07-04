import Navbar from '../components/Navbar'
import ArrayVisualizer from '../components/ArrayVisualizer'
import CodeEditor from '../components/CodeEditor'
import { useState } from 'react'

const codeLines = [
  { code: 'function maxSlidingWindow(arr, k) {', step: -1 },
  { code: '  let maxSum = 0', step: 0 },
  { code: '  let windowSum = 0', step: 0 },
  { code: '', step: -1 },
  { code: '  // Build first window', step: 0 },
  { code: '  for (let i = 0; i < k; i++) {', step: 0 },
  { code: '    windowSum += arr[i]', step: 0 },
  { code: '  }', step: 0 },
  { code: '  maxSum = windowSum', step: 0 },
  { code: '', step: -1 },
  { code: '  // Slide the window', step: 1 },
  { code: '  for (let i = k; i < arr.length; i++) {', step: 1 },
  { code: '    windowSum += arr[i]', step: 2 },
  { code: '    windowSum -= arr[i - k]', step: 2 },
  { code: '    maxSum = Math.max(maxSum, windowSum)', step: 3 },
  { code: '  }', step: 3 },
  { code: '  return maxSum', step: 4 },
  { code: '}', step: -1 },
]

const narrations = [
  "Building the first window — adding the first 3 elements together to get the initial sum.",
  "Window slides right — the new element enters from the right, leftmost element leaves.",
  "Comparing current window sum with the maximum sum found so far.",
  "New maximum found — this window has a higher sum than all previous windows.",
  "All windows checked — the maximum subarray sum has been found.",
]

const problems = [
  {
    id: 1,
    title: "Maximum Sum Subarray of Size K",
    difficulty: "Easy",
    description: "Given an array and integer K, find the maximum sum of any contiguous subarray of size K.",
    hint: "Use a sliding window of fixed size K."
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Find the length of the longest substring without repeating characters.",
    hint: "Use a variable size sliding window with a hash set."
  },
  {
    id: 3,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    description: "Find the minimum window in string S which contains all characters of string T.",
    hint: "Use two pointers with a character frequency map."
  },
]

function TopicPage() {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-black text-white mb-2">Arrays</h1>
        <p className="text-gray-400 mb-12">Master the most fundamental data structure</p>

        {/* Narration Box */}
        <div className={`mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 transition-all duration-300 ${currentStep > 0 ? 'shadow-[0_0_20px_rgba(139,92,246,0.25)]' : ''}`}>
          <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-1">
            What's happening
          </p>
          <p className="text-gray-200 text-base font-medium leading-relaxed">
            {narrations[currentStep] || narrations[0]}
          </p>
        </div>

        {/* Visualizer + Code Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Visualizer */}
          <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
            <h2 className="text-white font-bold text-xl mb-4">Sliding Window</h2>
            <ArrayVisualizer onStep={setCurrentStep} />
          </div>

          {/* Right — Code */}
          <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
            <h2 className="text-white font-bold text-xl mb-4">Code</h2>
            <div className="font-mono text-sm rounded-2xl bg-gray-950 p-4 overflow-auto">
              {codeLines.map((line, i) => (
                <div
                  key={i}
                  className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                    line.step === currentStep
                      ? 'bg-violet-600/40 text-violet-200 border-l-4 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                      : 'text-gray-400'
                  }`}
                >
                  <span className="text-gray-600 mr-4 select-none">{i + 1}</span>
                  {line.code || ' '}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Problem List */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-white mb-2">Practice Problems</h2>
          <p className="text-gray-400 mb-6">Apply what you just learned</p>
          <div className="flex flex-col gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5 hover:border-violet-700 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-bold text-lg group-hover:text-violet-400 transition-colors">
                    {problem.title}
                  </h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{problem.description}</p>
                <p className="text-violet-400 text-xs font-medium">
                  Hint: {problem.hint}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <CodeEditor />

      </div>
    </div>
  )
}

export default TopicPage