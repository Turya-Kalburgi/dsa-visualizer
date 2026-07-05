import Navbar from '../components/Navbar'
import ArrayVisualizer from '../components/ArrayVisualizer'
import CodeEditor from '../components/CodeEditor'
import { motion } from 'framer-motion'
import { useState } from 'react'

const slidingWindowCode = {
  Java: [
    { code: 'public static int maxSum(int[] arr, int k) {', step: -1 },
    { code: '  int maxSum = 0;', step: 0 },
    { code: '  int windowSum = 0;', step: 0 },
    { code: '  for (int i = 0; i < k; i++) {', step: 0 },
    { code: '    windowSum += arr[i];', step: 0 },
    { code: '  }', step: 0 },
    { code: '  maxSum = windowSum;', step: 0 },
    { code: '  for (int i = k; i < arr.length; i++) {', step: 1 },
    { code: '    windowSum += arr[i];', step: 2 },
    { code: '    windowSum -= arr[i - k];', step: 2 },
    { code: '    maxSum = Math.max(maxSum, windowSum);', step: 3 },
    { code: '  }', step: 3 },
    { code: '  return maxSum;', step: 4 },
    { code: '}', step: -1 },
  ],
  Python: [
    { code: 'def max_sum(arr, k):', step: -1 },
    { code: '    window_sum = sum(arr[:k])', step: 0 },
    { code: '    max_sum = window_sum', step: 0 },
    { code: '    for i in range(k, len(arr)):', step: 1 },
    { code: '        window_sum += arr[i]', step: 2 },
    { code: '        window_sum -= arr[i - k]', step: 2 },
    { code: '        max_sum = max(max_sum, window_sum)', step: 3 },
    { code: '    return max_sum', step: 4 },
  ],
  JavaScript: [
    { code: 'function maxSum(arr, k) {', step: -1 },
    { code: '  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);', step: 0 },
    { code: '  let maxSum = windowSum;', step: 0 },
    { code: '  for (let i = k; i < arr.length; i++) {', step: 1 },
    { code: '    windowSum += arr[i];', step: 2 },
    { code: '    windowSum -= arr[i - k];', step: 2 },
    { code: '    maxSum = Math.max(maxSum, windowSum);', step: 3 },
    { code: '  }', step: 3 },
    { code: '  return maxSum;', step: 4 },
    { code: '}', step: -1 },
  ],
  'C++': [
    { code: 'int maxSum(vector<int> arr, int k) {', step: -1 },
    { code: '  int windowSum = accumulate(arr.begin(), arr.begin() + k, 0);', step: 0 },
    { code: '  int maxSum = windowSum;', step: 0 },
    { code: '  for (int i = k; i < arr.size(); i++) {', step: 1 },
    { code: '    windowSum += arr[i];', step: 2 },
    { code: '    windowSum -= arr[i - k];', step: 2 },
    { code: '    maxSum = max(maxSum, windowSum);', step: 3 },
    { code: '  }', step: 3 },
    { code: '  return maxSum;', step: 4 },
    { code: '}', step: -1 },
  ],
}

const twoPointersCode = {
  Java: [
    { code: 'public static int twoSum(int[] arr) {', step: -1 },
    { code: '  int left = 0;', step: 0 },
    { code: '  int right = arr.length - 1;', step: 0 },
    { code: '  while (left < right) {', step: 1 },
    { code: '    left++;', step: 2 },
    { code: '    right--;', step: 2 },
    { code: '  }', step: 3 },
    { code: '  return left;', step: 4 },
    { code: '}', step: -1 },
  ],
  Python: [
    { code: 'def two_sum(arr):', step: -1 },
    { code: '    left, right = 0, len(arr) - 1', step: 0 },
    { code: '    while left < right:', step: 1 },
    { code: '        left += 1', step: 2 },
    { code: '        right -= 1', step: 2 },
    { code: '    return left', step: 4 },
  ],
  JavaScript: [
    { code: 'function twoSum(arr) {', step: -1 },
    { code: '  let left = 0;', step: 0 },
    { code: '  let right = arr.length - 1;', step: 0 },
    { code: '  while (left < right) {', step: 1 },
    { code: '    left += 1;', step: 2 },
    { code: '    right -= 1;', step: 2 },
    { code: '  }', step: 3 },
    { code: '  return left;', step: 4 },
    { code: '}', step: -1 },
  ],
  'C++': [
    { code: 'int twoSum(vector<int> arr) {', step: -1 },
    { code: '  int left = 0;', step: 0 },
    { code: '  int right = arr.size() - 1;', step: 0 },
    { code: '  while (left < right) {', step: 1 },
    { code: '    left++;', step: 2 },
    { code: '    right--;', step: 2 },
    { code: '  }', step: 3 },
    { code: '  return left;', step: 4 },
    { code: '}', step: -1 },
  ],
}

const slidingWindowNarrations = [
  'Building the first window — adding the first 3 elements together to get the initial sum.',
  'Window slides right — the new element enters from the right, leftmost element leaves.',
  'Comparing current window sum with the maximum sum found so far.',
  'New maximum found — this window has a higher sum than all previous windows.',
  'All windows checked — the maximum subarray sum has been found.',
]

const twoPointersNarrations = [
  'Two pointers begin at opposite ends of the array.',
  'Move the left pointer inward and the right pointer inward as you compare values.',
  'The pointers continue closing the gap until they meet.',
  'The search is complete once the pointers converge at the middle.',
]

const problems = [
  {
    id: 1,
    title: 'Maximum Sum Subarray of Size K',
    difficulty: 'Easy',
    description: 'Given an array and integer K, find the maximum sum of any contiguous subarray of size K.',
    hint: 'Use a sliding window of fixed size K.'
  },
  {
    id: 2,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    description: 'Find the length of the longest substring without repeating characters.',
    hint: 'Use a variable size sliding window with a hash set.'
  },
  {
    id: 3,
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    description: 'Find the minimum window in string S which contains all characters of string T.',
    hint: 'Use two pointers with a character frequency map.'
  },
]

function TwoPointersVisualizer({ onStep }) {
  const values = [1, 3, 5, 7, 9, 11]
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(values.length - 1)

  const step = () => {
    if (left >= right) {
      onStep?.(2)
      return
    }

    setLeft((prev) => prev + 1)
    setRight((prev) => prev - 1)
    onStep?.(1)
  }

  const reset = () => {
    setLeft(0)
    setRight(values.length - 1)
    onStep?.(0)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {values.map((value, index) => {
          const isLeft = index === left
          const isRight = index === right
          const isActive = isLeft || isRight

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  scale: isActive ? 1.12 : 1,
                  backgroundColor: isActive ? '#7c3aed' : '#111827',
                }}
                transition={{ duration: 0.25 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-violet-500/50 text-sm font-black text-white"
              >
                {value}
              </motion.div>
              <span className="text-xs text-gray-500">{index}</span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-6 text-sm">
        <span className="font-bold text-green-400">● L = {left}</span>
        <span className="font-bold text-red-400">● R = {right}</span>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={step}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Next
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Reset
        </motion.button>
      </div>
    </div>
  )
}

function TopicPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [activePattern, setActivePattern] = useState('Sliding Window')
  const [activeLanguage, setActiveLanguage] = useState('Java')

  const codeSnippets = activePattern === 'Two Pointers' ? twoPointersCode : slidingWindowCode
  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java
  const narrations = activePattern === 'Two Pointers' ? twoPointersNarrations : slidingWindowNarrations

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-8 py-12">
        <h1 className="mb-2 text-4xl font-black text-white">Arrays</h1>
        <p className="mb-8 text-gray-400">Master the most fundamental data structure</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {['Sliding Window', 'Two Pointers'].map((pattern) => (
            <button
              key={pattern}
              onClick={() => {
                setActivePattern(pattern)
                setCurrentStep(0)
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activePattern === pattern
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {pattern}
            </button>
          ))}
        </div>

        <div className={`mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 transition-all duration-300 ${currentStep > 0 ? 'shadow-[0_0_20px_rgba(139,92,246,0.25)]' : ''}`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">What&apos;s happening</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">
            {narrations[currentStep] || narrations[0]}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              {activePattern === 'Two Pointers' ? 'Two Pointers' : 'Sliding Window'}
            </h2>
            {activePattern === 'Two Pointers' ? (
              <TwoPointersVisualizer onStep={setCurrentStep} />
            ) : (
              <ArrayVisualizer onStep={setCurrentStep} />
            )}
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
              {codeLines.map((line, i) => (
                <div
                  key={`${activeLanguage}-${i}`}
                  className={`rounded-lg px-3 py-1 transition-all duration-300 ${
                    line.step === currentStep
                      ? 'border-l-4 border-violet-500 bg-violet-600/40 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                      : 'text-gray-400'
                  }`}
                >
                  <span className="mr-4 select-none text-gray-600">{i + 1}</span>
                  {line.code || ' '}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-2 text-2xl font-black text-white">Practice Problems</h2>
          <p className="mb-6 text-gray-400">Apply what you just learned</p>
          <div className="flex flex-col gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="cursor-pointer rounded-2xl border border-gray-800 bg-gray-900 px-6 py-5 transition-all duration-300 hover:border-violet-700 group"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                    {problem.title}
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
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

export default TopicPage