import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const codeSnippets = {
  Java: [
    'class Stack {',
    '  private int[] data = new int[100];',
    '  private int top = -1;',
    '  void push(int value) {',
    '    data[++top] = value;',
    '  }',
    '  int pop() {',
    '    return data[top--];',
    '  }',
    '}'
  ],
  Python: [
    'class Stack:',
    '    def __init__(self):',
    '        self.items = []',
    '    def push(self, value):',
    '        self.items.append(value)',
    '    def pop(self):',
    '        return self.items.pop()'
  ],
  JavaScript: [
    'class Stack {',
    '  constructor() {',
    '    this.items = [];',
    '  }',
    '  push(value) {',
    '    this.items.push(value);',
    '  }',
    '  pop() {',
    '    return this.items.pop();',
    '  }',
    '}'
  ],
  'C++': [
    'class Stack {',
    'public:',
    '  vector<int> data;',
    '  void push(int value) {',
    '    data.push_back(value);',
    '  }',
    '  int pop() {',
    '    int value = data.back();',
    '    data.pop_back();',
    '    return value;',
    '  }',
    '};'
  ]
}

const problems = [
  {
    id: 1,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Use a stack to check whether a string of brackets is balanced.',
    hint: 'Push opening brackets and pop on closing ones.'
  },
  {
    id: 2,
    title: 'Min Stack',
    difficulty: 'Medium',
    description: 'Design a stack that returns the minimum element in O(1) time.',
    hint: 'Track the minimum alongside each push.'
  },
  {
    id: 3,
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    description: 'Find the largest rectangle area using a monotonic stack.',
    hint: 'Use indices to keep track of increasing bar heights.'
  }
]

function StackPage() {
  const [stack, setStack] = useState(['10', '20', '30'])
  const [inputValue, setInputValue] = useState('')
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [lastAction, setLastAction] = useState('idle')

  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java
  const highlightLineMap = {
    Java: lastAction === 'push' ? 3 : 5,
    Python: lastAction === 'push' ? 3 : 5,
    JavaScript: lastAction === 'push' ? 3 : 5,
    'C++': lastAction === 'push' ? 2 : 4
  }
  const highlightedLine = highlightLineMap[activeLanguage] ?? 0

  const handlePush = () => {
    const value = inputValue.trim() || '42'
    setStack((prev) => [...prev, value])
    setInputValue('')
    setLastAction('push')
  }

  const handlePop = () => {
    setStack((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev))
    setLastAction('pop')
  }

  const topValue = stack[stack.length - 1] ?? '∅'
  const narration = lastAction === 'push'
    ? `Pushed ${topValue} to the stack. It now sits on top and will be removed first.`
    : lastAction === 'pop'
      ? stack.length === 0
        ? 'Popped the last element and the stack is now empty.'
        : `Popped ${topValue} from the stack. The next element is now at the top.`
      : 'Stacks follow LIFO: the last item pushed is the first one popped.'

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <h1 className="mb-2 text-4xl font-black text-white">Stacks</h1>
        <p className="mb-8 text-gray-400">Last In First Out — the simplest yet most powerful structure</p>

        <div className="mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 shadow-[0_0_25px_rgba(139,92,246,0.16)]">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Narration</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">{narration}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Stack Visualizer</h2>
                <p className="text-sm text-gray-400">Push values in and watch the top element glow.</p>
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Enter a value"
                className="flex-1 rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-violet-500"
              />
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handlePush}
                className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Push
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handlePop}
                className="rounded-xl bg-gray-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Pop
              </motion.button>
            </div>

            <div className="flex min-h-[320px] flex-col items-center justify-end rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
              <div className="flex w-full flex-col-reverse items-center gap-2">
                <AnimatePresence initial={false}>
                  {stack.map((item, index) => {
                    const isTop = index === stack.length - 1
                    return (
                      <motion.div
                        key={`${item}-${index}`}
                        layout
                        initial={{ y: -24, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 24, opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                        className={`flex h-14 w-44 items-center justify-center rounded-2xl border text-sm font-black shadow-lg ${
                          isTop
                            ? 'border-violet-400 bg-violet-600 text-white shadow-violet-500/30'
                            : 'border-gray-700 bg-gray-900 text-gray-200'
                        }`}
                      >
                        {item}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>

              {stack.length === 0 ? (
                <p className="mt-6 text-sm text-gray-500">The stack is empty. Push a value to begin.</p>
              ) : (
                <p className="mt-6 text-sm text-violet-400">
                  Top element: <span className="font-semibold text-white">{topValue}</span>
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Stack Operations</h2>
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
          <p className="mb-6 text-gray-400">Train your intuition with these stack-based challenges.</p>
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

export default StackPage
