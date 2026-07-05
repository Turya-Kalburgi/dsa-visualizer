import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const coins = [1, 2, 5]
const amount = 11

const dpFacts = [
  { title: 'Overlapping Subproblems', detail: 'The same small states get recomputed many times in naive recursion.' },
  { title: 'Optimal Substructure', detail: 'A good solution can be built from the best solutions to smaller versions of the same problem.' },
  { title: 'Memoization', detail: 'Store answers for repeated states so each one is solved once.' },
  { title: 'Tabulation', detail: 'Build the solution from the bottom up in a table.' }
]

const patternCodeSnippets = {
  Fibonacci: {
    Java: [
      'int fib(int n) {',
      '  if (n <= 1) return n;',
      '  return fib(n - 1) + fib(n - 2);',
      '}'
    ],
    Python: [
      'def fib(n):',
      '    if n <= 1: return n',
      '    return fib(n - 1) + fib(n - 2)'
    ],
    JavaScript: [
      'function fib(n) {',
      '  if (n <= 1) return n;',
      '  return fib(n - 1) + fib(n - 2);',
      '}'
    ],
    'C++': [
      'int fib(int n) {',
      '  if (n <= 1) return n;',
      '  return fib(n - 1) + fib(n - 2);',
      '}'
    ]
  },
  'Coin Change': {
    Java: [
      'int coinChange(int[] coins, int amount) {',
      '  int[] dp = new int[amount + 1];',
      '  for (int a = 1; a <= amount; a++) {',
      '    dp[a] = Integer.MAX_VALUE;',
      '    for (int coin : coins) {',
      '      if (a >= coin) dp[a] = Math.min(dp[a], dp[a - coin] + 1);',
      '    }',
      '  }',
      '  return dp[amount];',
      '}'
    ],
    Python: [
      'def coin_change(coins, amount):',
      '    dp = [float("inf")] * (amount + 1)',
      '    for a in range(1, amount + 1):',
      '        for coin in coins:',
      '            if a >= coin:',
      '                dp[a] = min(dp[a], dp[a - coin] + 1)',
      '    return dp[amount]'
    ],
    JavaScript: [
      'function coinChange(coins, amount) {',
      '  const dp = Array(amount + 1).fill(Infinity);',
      '  for (let a = 1; a <= amount; a++) {',
      '    for (const coin of coins) {',
      '      if (a >= coin) dp[a] = Math.min(dp[a], dp[a - coin] + 1);',
      '    }',
      '  }',
      '  return dp[amount];',
      '}'
    ],
    'C++': [
      'int coinChange(vector<int> coins, int amount) {',
      '  vector<int> dp(amount + 1, INT_MAX);',
      '  for (int a = 1; a <= amount; a++) {',
      '    for (int coin : coins) {',
      '      if (a >= coin) dp[a] = min(dp[a], dp[a - coin] + 1);',
      '    }',
      '  }',
      '  return dp[amount];',
      '}'
    ]
  },
  'Climbing Stairs': {
    Java: [
      'int climbStairs(int n) {',
      '  int[] dp = new int[n + 1];',
      '  dp[0] = 1;',
      '  dp[1] = 1;',
      '  for (int i = 2; i <= n; i++) {',
      '    dp[i] = dp[i - 1] + dp[i - 2];',
      '  }',
      '  return dp[n];',
      '}'
    ],
    Python: [
      'def climb_stairs(n):',
      '    dp = [0] * (n + 1)',
      '    dp[0], dp[1] = 1, 1',
      '    for i in range(2, n + 1):',
      '        dp[i] = dp[i - 1] + dp[i - 2]',
      '    return dp[n]'
    ],
    JavaScript: [
      'function climbStairs(n) {',
      '  const dp = Array(n + 1).fill(0);',
      '  dp[0] = 1;',
      '  dp[1] = 1;',
      '  for (let i = 2; i <= n; i++) {',
      '    dp[i] = dp[i - 1] + dp[i - 2];',
      '  }',
      '  return dp[n];',
      '}'
    ],
    'C++': [
      'int climbStairs(int n) {',
      '  vector<int> dp(n + 1, 0);',
      '  dp[0] = 1;',
      '  dp[1] = 1;',
      '  for (int i = 2; i <= n; i++) {',
      '    dp[i] = dp[i - 1] + dp[i - 2];',
      '  }',
      '  return dp[n];',
      '}'
    ]
  }
}

const problems = [
  { id: 1, title: 'Climbing Stairs', difficulty: 'Easy', description: 'Count the number of ways to reach the top.', hint: 'Use a simple recurrence with a 1D DP array.' },
  { id: 2, title: 'Coin Change', difficulty: 'Medium', description: 'Find the minimum number of coins to make an amount.', hint: 'Use dp[a] = min(dp[a], dp[a - coin] + 1).' },
  { id: 3, title: 'Edit Distance', difficulty: 'Hard', description: 'Transform one string to another with minimum edits.', hint: 'Use a 2D DP table over prefixes.' }
]

function buildFibonacciSteps() {
  const steps = []
  const memo = new Map([[0, 0], [1, 1]])
  const repeated = new Set()
  const queue = [5]

  while (queue.length) {
    const value = queue.shift()
    if (memo.has(value)) continue
    repeated.add(value)
    const left = value - 1
    const right = value - 2
    queue.push(left, right)
    steps.push({
      type: 'tree',
      current: value,
      memo,
      repeated: [...repeated],
      narration: `${value} splits into ${left} and ${right}. That creates overlapping work.`
    })
  }

  memo.set(2, 1)
  memo.set(3, 2)
  memo.set(4, 3)
  memo.set(5, 5)
  steps.push({
    type: 'memo',
    current: 5,
    memo,
    repeated: [],
    narration: 'Memoization stores each result so we solve the repeated subproblems only once.'
  })
  return steps
}

function buildCoinChangeSteps() {
  const steps = []
  const dp = Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let target = 1; target <= amount; target += 1) {
    let best = Infinity
    let formula = ''
    for (const coin of coins) {
      if (target >= coin) {
        const candidate = dp[target - coin] + 1
        if (candidate < best) {
          best = candidate
          formula = `dp[${target}] = min(dp[${target - coin}] + 1, ...)`
        }
      }
    }
    dp[target] = best
    steps.push({
      type: 'coin',
      target,
      dp: [...dp],
      formula: `dp[${target}] = min(dp[${target - 1}] + 1, dp[${target - 2}] + 1, dp[${target - 5}] + 1)`,
      narration: `We compute the best answer for ${target} by checking the previous amounts that can reach it.`
    })
  }
  return steps
}

function buildClimbingSteps() {
  const steps = []
  const dp = [1, 1]
  steps.push({
    current: 0,
    dp: [...dp],
    narration: 'Start with one way to be on step 0 and one way to be on step 1.'
  })
  for (let i = 2; i <= 8; i += 1) {
    dp[i] = dp[i - 1] + dp[i - 2]
    steps.push({
      current: i,
      dp: [...dp],
      narration: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}.`
    })
  }
  return steps
}

function DPPage() {
  const [activePattern, setActivePattern] = useState('Fibonacci')
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(900)

  const patternSteps = useMemo(() => {
    if (activePattern === 'Coin Change') return buildCoinChangeSteps()
    if (activePattern === 'Climbing Stairs') return buildClimbingSteps()
    return buildFibonacciSteps()
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
  const codeLines = patternCodeSnippets[activePattern][activeLanguage] || patternCodeSnippets.Fibonacci.Java

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
        <h1 className="mb-2 text-4xl font-black text-white">Dynamic Programming</h1>
        <p className="mb-8 text-gray-400">Turn repeated work into smarter solutions with DP.</p>

        <div className="mb-8 rounded-3xl border border-gray-800 bg-gray-900 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">What is DP?</p>
          <p className="mb-4 text-base leading-relaxed text-gray-200">
            Dynamic programming is a way to solve problems by breaking them into smaller subproblems and reusing the answers instead of recomputing them.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {dpFacts.map((fact) => (
              <div key={fact.title} className="rounded-2xl border border-gray-800 bg-gray-950/70 p-3">
                <p className="mb-1 text-sm font-semibold text-violet-300">{fact.title}</p>
                <p className="text-sm text-gray-400">{fact.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {['Fibonacci', 'Coin Change', 'Climbing Stairs'].map((pattern) => (
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

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{activePattern} Visualization</h2>
                <p className="text-sm text-gray-400">
                  {activePattern === 'Fibonacci'
                    ? 'See how repeated subproblems create wasted work before memoization fixes it.'
                    : activePattern === 'Coin Change'
                      ? 'A table fills one state at a time using smaller amounts.'
                      : 'Each stair count depends on the two previous stairs.'}
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

            {activePattern === 'Fibonacci' && (
              <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-300">Subproblems solved</span>
                  <span className="text-lg font-black text-violet-300">{(currentStep?.repeated || []).length + 1}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }, (_, idx) => idx).map((value) => {
                    const repeated = (currentStep?.repeated || []).includes(value)
                    return (
                      <motion.div key={value} animate={{ scale: repeated ? 1.04 : 1 }} className={`rounded-xl px-3 py-2 text-sm font-semibold ${repeated ? 'bg-red-500/20 text-red-200' : 'bg-gray-800 text-gray-300'}`}>
                        F({value})
                      </motion.div>
                    )
                  })}
                </div>
                <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-300">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Memo</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(currentStep?.memo || []).map(([value, answer]) => (
                      <span key={value} className="rounded-full bg-violet-600/20 px-2.5 py-1 text-sm font-semibold text-violet-200">F({value}) = {answer}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePattern === 'Coin Change' && (
              <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-300">Subproblems solved</span>
                  <span className="text-lg font-black text-violet-300">{step + 1}</span>
                </div>
                <div className="overflow-auto rounded-2xl border border-gray-800 bg-gray-900/70 p-4">
                  <div className="grid grid-cols-[70px_repeat(12,minmax(52px,1fr))] gap-2 text-sm">
                    <div className="text-gray-500">Coins</div>
                    {Array.from({ length: amount + 1 }, (_, value) => value).map((value) => (
                      <div key={value} className="rounded-lg bg-gray-800 px-2 py-2 text-center text-gray-300">{value}</div>
                    ))}
                    {coins.map((coin) => (
                      <>
                        <div key={`coin-${coin}`} className="rounded-lg bg-gray-900 px-2 py-2 text-center text-violet-300">{coin}</div>
                        {Array.from({ length: amount + 1 }, (_, value) => value).map((value) => {
                          const active = value === currentStep?.target
                          return (
                            <div key={`${coin}-${value}`} className={`rounded-lg border px-2 py-2 text-center text-sm ${active ? 'border-violet-400 bg-violet-600/30 text-violet-200' : 'border-gray-800 bg-gray-950 text-gray-300'}`}>
                              {value === 0 ? 0 : value}
                            </div>
                          )
                        })}
                      </>
                    ))}
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-300">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gray-500">Formula</p>
                  <p className="text-violet-200">{currentStep?.formula}</p>
                </div>
              </div>
            )}

            {activePattern === 'Climbing Stairs' && (
              <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-300">Subproblems solved</span>
                  <span className="text-lg font-black text-violet-300">{currentStep?.current ?? 0}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(currentStep?.dp || []).map((value, index) => (
                    <motion.div key={`${value}-${index}`} animate={{ scale: index === currentStep?.current ? 1.06 : 1 }} className={`rounded-xl px-3 py-2 text-sm font-semibold ${index === currentStep?.current ? 'bg-violet-600/30 text-violet-200' : 'bg-gray-800 text-gray-300'}`}>
                      dp[{index}] = {value}
                    </motion.div>
                  ))}
                </div>
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
          <p className="mb-6 text-gray-400">Explore dynamic programming patterns with these challenges.</p>
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

export default DPPage
