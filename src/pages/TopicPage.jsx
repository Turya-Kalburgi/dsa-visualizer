import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

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
    { code: '}', step: -1 }
  ],
  Python: [
    { code: 'def max_sum(arr, k):', step: -1 },
    { code: '    window_sum = sum(arr[:k])', step: 0 },
    { code: '    max_sum = window_sum', step: 0 },
    { code: '    for i in range(k, len(arr)):', step: 1 },
    { code: '        window_sum += arr[i]', step: 2 },
    { code: '        window_sum -= arr[i - k]', step: 2 },
    { code: '        max_sum = max(max_sum, window_sum)', step: 3 },
    { code: '    return max_sum', step: 4 }
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
    { code: '}', step: -1 }
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
    { code: '}', step: -1 }
  ]
}

const twoPointersCode = {
  Java: [
    { code: 'public static int twoSum(int[] arr, int target) {', step: -1 },
    { code: '  int left = 0;', step: 0 },
    { code: '  int right = arr.length - 1;', step: 0 },
    { code: '  while (left < right) {', step: 1 },
    { code: '    int sum = arr[left] + arr[right];', step: 1 },
    { code: '    if (sum < target) left++;', step: 2 },
    { code: '    else if (sum > target) right--;', step: 2 },
    { code: '    else return left;', step: 3 },
    { code: '  }', step: 3 },
    { code: '  return -1;', step: 4 },
    { code: '}', step: -1 }
  ],
  Python: [
    { code: 'def two_sum(arr, target):', step: -1 },
    { code: '    left, right = 0, len(arr) - 1', step: 0 },
    { code: '    while left < right:', step: 1 },
    { code: '        total = arr[left] + arr[right]', step: 1 },
    { code: '        if total < target: left += 1', step: 2 },
    { code: '        elif total > target: right -= 1', step: 2 },
    { code: '        else: return left', step: 3 },
    { code: '    return -1', step: 4 }
  ],
  JavaScript: [
    { code: 'function twoSum(arr, target) {', step: -1 },
    { code: '  let left = 0;', step: 0 },
    { code: '  let right = arr.length - 1;', step: 0 },
    { code: '  while (left < right) {', step: 1 },
    { code: '    const sum = arr[left] + arr[right];', step: 1 },
    { code: '    if (sum < target) left += 1;', step: 2 },
    { code: '    else if (sum > target) right -= 1;', step: 2 },
    { code: '    else return left;', step: 3 },
    { code: '  }', step: 3 },
    { code: '  return -1;', step: 4 },
    { code: '}', step: -1 }
  ],
  'C++': [
    { code: 'int twoSum(vector<int> arr, int target) {', step: -1 },
    { code: '  int left = 0;', step: 0 },
    { code: '  int right = arr.size() - 1;', step: 0 },
    { code: '  while (left < right) {', step: 1 },
    { code: '    int sum = arr[left] + arr[right];', step: 1 },
    { code: '    if (sum < target) left++;', step: 2 },
    { code: '    else if (sum > target) right--;', step: 2 },
    { code: '    else return left;', step: 3 },
    { code: '  }', step: 3 },
    { code: '  return -1;', step: 4 },
    { code: '}', step: -1 }
  ]
}

const problems = [
  {
    id: 1,
    title: 'Maximum Sum Subarray of Size K',
    difficulty: 'Easy',
    description: 'Given an array and integer K, find the maximum sum of any contiguous subarray of size K.',
    hint: 'Use a sliding window of fixed size K.',
    pattern: 'Sliding Window'
  },
  {
    id: 2,
    title: 'Container With Most Water',
    difficulty: 'Medium',
    description: 'Find the maximum area formed by two vertical lines and the x-axis.',
    hint: 'Move the pointer that gives the smaller height.',
    pattern: 'Two Pointers'
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Hard',
    description: 'Find the length of the longest substring without repeating characters.',
    hint: 'Use a sliding window and a hash set.',
    pattern: 'Sliding Window'
  }
]

function TopicPage() {
  const [activePattern, setActivePattern] = useState('Sliding Window')
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [arrayInput, setArrayInput] = useState('3,1,5,2,6,4')
  const [windowInput, setWindowInput] = useState('3')
  const [selectedProblemId, setSelectedProblemId] = useState(null)

  const parsedValues = useMemo(() => {
    const numbers = arrayInput
      .split(',')
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => Number.isFinite(value))

    return numbers.length > 0 ? numbers : [3, 1, 5, 2, 6, 4]
  }, [arrayInput])

  const windowSize = useMemo(() => {
    const size = Number.parseInt(windowInput, 10)
    if (!Number.isFinite(size) || size < 1) return 3
    return Math.min(Math.max(size, 1), parsedValues.length)
  }, [parsedValues, windowInput])

  const slidingWindowSteps = useMemo(() => {
    if (parsedValues.length === 0 || windowSize > parsedValues.length) {
      return []
    }

    const steps = []
    let windowSum = parsedValues.slice(0, windowSize).reduce((sum, value) => sum + value, 0)
    steps.push({
      start: 0,
      end: windowSize - 1,
      windowSum,
      reason: `We start with the first ${windowSize} values so the window is full.`
    })

    for (let start = 1; start <= parsedValues.length - windowSize; start += 1) {
      const leaving = parsedValues[start - 1]
      const entering = parsedValues[start + windowSize - 1]
      windowSum += entering - leaving
      steps.push({
        start,
        end: start + windowSize - 1,
        windowSum,
        reason: `The window moved right because ${leaving} left the window and ${entering} entered it.`
      })
    }

    return steps
  }, [parsedValues, windowSize])

  const twoPointerSteps = useMemo(() => {
    const values = [1, 2, 3, 4, 5, 6]
    const target = 10
    const steps = []
    let left = 0
    let right = values.length - 1

    while (left < right) {
      const total = values[left] + values[right]
      if (total < target) {
        steps.push({
          left,
          right,
          total,
          action: 'too-small',
          narration: `${values[left]} + ${values[right]} = ${total}, which is too small, so we move left forward to increase the sum.`
        })
        left += 1
      } else if (total > target) {
        steps.push({
          left,
          right,
          total,
          action: 'too-big',
          narration: `${values[left]} + ${values[right]} = ${total}, which is too big, so we move right backward to shrink the sum.`
        })
        right -= 1
      } else {
        steps.push({
          left,
          right,
          total,
          action: 'found',
          narration: `${values[left]} + ${values[right]} = ${target}. We found the pair!`
        })
        break
      }
    }

    return steps
  }, [])

  const codeSnippets = activePattern === 'Two Pointers' ? twoPointersCode : slidingWindowCode
  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java

  const visualSteps = activePattern === 'Two Pointers' ? twoPointerSteps : slidingWindowSteps
  const stepCount = visualSteps.length || 1
  const currentVisualStep = visualSteps[Math.min(currentStep, visualSteps.length - 1)] || visualSteps[0]
  const activeNarration = activePattern === 'Two Pointers'
    ? currentVisualStep?.narration || 'We use two pointers to shrink the search space from both ends.'
    : currentVisualStep?.reason || 'A sliding window keeps a continuous block of values in view.'

  useEffect(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [activePattern, arrayInput, windowInput])

  useEffect(() => {
    if (!isPlaying) return undefined

    const intervalMs = Math.max(250, Math.round(900 / playbackSpeed))
    const interval = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= stepCount - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, intervalMs)

    return () => window.clearInterval(interval)
  }, [isPlaying, playbackSpeed, stepCount])

  const stepForward = () => {
    setCurrentStep((prev) => Math.min(prev + 1, stepCount - 1))
  }

  const stepBackward = () => {
    setIsPlaying(false)
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    setIsPlaying(true)
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const selectedProblem = problems.find((problem) => problem.id === selectedProblemId)
  const focusMessage = selectedProblem
    ? `${selectedProblem.pattern} is the best fit here. ${selectedProblem.pattern === 'Sliding Window' ? 'Keep the window moving while you update the sum.' : 'Move the pointers from the ends based on the comparison result.'}`
    : activePattern === 'Two Pointers'
      ? 'Two Pointers works best when you want to compare values from both ends of a sorted array.'
      : 'Sliding Window works best when you need a moving block of values and a running sum.'

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <h1 className="mb-2 text-4xl font-black text-white">Arrays</h1>
        <p className="mb-8 text-gray-400">Master the most fundamental data structure</p>

        <div className="mb-8 rounded-3xl border border-gray-800 bg-gray-900 p-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">What is this?</p>
          <p className="text-base leading-relaxed text-gray-200">
            Arrays are simple containers that store data in order, one value after another. They help us quickly access values by position and make it easier to compare, slide, and search through data.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {['Sliding Window', 'Two Pointers'].map((pattern) => (
            <button
              key={pattern}
              onClick={() => {
                setActivePattern(pattern)
                setSelectedProblemId(null)
              }}
              className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                activePattern === pattern
                  ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div>{pattern}</div>
              <div className="mt-1 text-xs font-medium opacity-80">
                {pattern === 'Sliding Window'
                  ? 'Use when a moving block of values needs a running sum.'
                  : 'Use when you compare values from both ends of a sorted array.'}
              </div>
            </button>
          ))}
        </div>

        <div className={`mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 transition-all duration-300 ${currentStep > 0 ? 'shadow-[0_0_20px_rgba(139,92,246,0.25)]' : ''}`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">What&apos;s happening</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">{activeNarration}</p>
        </div>

        <div className={`mb-6 rounded-2xl border border-violet-500/20 bg-violet-600/10 px-4 py-3 text-sm text-violet-200 ${selectedProblem ? 'block' : 'hidden'}`}>
          <span className="font-semibold">Focus mode:</span> {focusMessage}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className={`rounded-3xl border border-gray-800 bg-gray-900 p-6 ${selectedProblem ? 'ring-2 ring-violet-500/40' : ''}`}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {activePattern === 'Two Pointers' ? 'Two Pointers' : 'Sliding Window'}
                </h2>
                <p className="text-sm text-gray-400">
                  {activePattern === 'Two Pointers'
                    ? 'We compare values from the ends and move the pointer that needs changing.'
                    : 'We keep a moving block of values and update the sum as it slides.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={reset} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">Reset</button>
                <button onClick={stepBackward} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">Prev</button>
                <button onClick={stepForward} className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500">Step</button>
                <button onClick={togglePlay} className="rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700">{isPlaying ? 'Pause' : 'Play'}</button>
                <label className="ml-1 flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-950/70 px-3 py-2 text-sm text-gray-300">
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Speed</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={playbackSpeed}
                    onChange={(event) => setPlaybackSpeed(Number(event.target.value))}
                    className="h-2 w-20 cursor-pointer appearance-none rounded-full bg-gray-800 accent-violet-500"
                  />
                  <span className="min-w-10 text-right text-xs font-semibold text-violet-300">{playbackSpeed.toFixed(1)}x</span>
                </label>
              </div>
            </div>

            {activePattern === 'Two Pointers' ? (
              <div className="flex flex-col gap-6 py-2">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((value, index) => {
                    const isLeft = index === currentVisualStep.left
                    const isRight = index === currentVisualStep.right
                    const isActive = isLeft || isRight

                    return (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <motion.div
                          animate={{ scale: isActive ? 1.1 : 1, backgroundColor: isLeft ? '#16a34a' : isRight ? '#dc2626' : '#111827' }}
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

                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-300">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-green-400">Left pointer</span>
                    <span className="text-red-400">Right pointer</span>
                  </div>
                  <p className="leading-relaxed">
                    {currentVisualStep.action === 'too-small' && 'The sum is too small, so we move the left pointer right to grow the total.'}
                    {currentVisualStep.action === 'too-big' && 'The sum is too big, so we move the right pointer left to shrink the total.'}
                    {currentVisualStep.action === 'found' && 'The two pointers meet on the target pair and we stop.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5 py-2">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {parsedValues.map((value, index) => {
                    const isInside = index >= currentVisualStep.start && index <= currentVisualStep.end
                    return (
                      <motion.div
                        key={`${value}-${index}`}
                        animate={{ scale: isInside ? 1.06 : 1, backgroundColor: isInside ? '#7c3aed' : '#111827' }}
                        transition={{ duration: 0.25 }}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 text-sm font-black text-white"
                      >
                        <span>{value}</span>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="rounded-2xl border border-violet-500/20 bg-violet-600/10 px-4 py-3 text-center text-sm font-semibold text-violet-200">
                  Current window sum: {currentVisualStep.windowSum}
                </div>
                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-300">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Why did we move?</p>
                  <p className="leading-relaxed">{currentVisualStep.reason}</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-800 bg-gray-950/70 px-4 py-3 text-sm text-gray-400">
              <span>Step {Math.min(currentStep + 1, stepCount)} of {stepCount}</span>
              <div className="flex gap-5">
                <span className="text-emerald-400">Array: {parsedValues.join(', ')}</span>
                {activePattern !== 'Two Pointers' && <span className="text-violet-400">Window size: {windowSize}</span>}
              </div>
            </div>

            {activePattern !== 'Two Pointers' && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="rounded-2xl border border-gray-800 bg-gray-950/70 p-3 text-sm text-gray-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">Array values</span>
                  <input value={arrayInput} onChange={(event) => setArrayInput(event.target.value)} className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500" />
                </label>
                <label className="rounded-2xl border border-gray-800 bg-gray-950/70 p-3 text-sm text-gray-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-500">Window size</span>
                  <input type="number" min="1" value={windowInput} onChange={(event) => setWindowInput(event.target.value)} className="w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-violet-500" />
                </label>
              </div>
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

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeLanguage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="overflow-auto rounded-2xl bg-gray-950 p-4 font-mono text-sm"
              >
                {codeLines.map((line, index) => {
                  const isActive = line.step === currentStep
                  return (
                    <div
                      key={`${activeLanguage}-${index}`}
                      className={`rounded-lg px-3 py-1 transition-all duration-300 ${
                        isActive
                          ? 'border-l-4 border-violet-500 bg-violet-600/40 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                          : 'text-gray-400'
                      }`}
                    >
                      <span className="mr-4 select-none text-gray-600">{index + 1}</span>
                      {line.code || ' '}
                    </div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-2 text-2xl font-black text-white">Practice Problems</h2>
          <p className="mb-6 text-gray-400">Apply what you just learned with beginner-friendly practice.</p>
          <div className="flex flex-col gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-5 transition-all duration-300 hover:border-violet-700"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-white">{problem.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActivePattern(problem.pattern)
                        setSelectedProblemId(problem.id)
                      }}
                      className="rounded-full bg-violet-600/20 px-3 py-1 text-xs font-semibold text-violet-300 transition hover:bg-violet-600/30"
                    >
                      See Pattern
                    </button>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
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