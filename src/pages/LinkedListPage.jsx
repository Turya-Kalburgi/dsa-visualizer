import { useState } from 'react'
import Navbar from '../components/Navbar'
import LinkedListVisualizer from '../components/LinkedListVisualizer'
import CodeEditor from '../components/CodeEditor'

const codeSnippets = {
  Java: [
    'class Node {',
    '  int value;',
    '  Node next;',
    '}',
    '',
    'void traverse(Node head) {',
    '  Node current = head;',
    '  while (current != null) {',
    '    System.out.print(current.value + " -> ");',
    '    current = current.next;',
    '  }',
    '  System.out.println("null");',
    '}'
  ],
  Python: [
    'def traverse(head):',
    '    current = head',
    '    while current is not None:',
    '        print(current.value, end=" -> ")',
    '        current = current.next',
    '    print("None")'
  ],
  JavaScript: [
    'function traverse(head) {',
    '  let current = head;',
    '  while (current !== null) {',
    '    console.log(current.value);',
    '    current = current.next;',
    '  }',
    '}'
  ],
  'C++': [
    'void traverse(Node* head) {',
    '  Node* current = head;',
    '  while (current != nullptr) {',
    '    cout << current->value << " -> ";',
    '    current = current->next;',
    '  }',
    '  cout << "null" << endl;',
    '}'
  ]
}

const narrationSteps = [
  'Start with a linked list and inspect the current head node.',
  'Insert a new value at the end of the list and connect it to the tail.',
  'Delete a selected node by unlinking it from the list.',
  'Reverse the list by flipping each node connection in order.'
]

const problems = [
  {
    id: 1,
    title: 'Find the Middle of a Linked List',
    difficulty: 'Easy',
    description: 'Given a singly linked list, return the middle node using two pointers.',
    hint: 'Use a slow and fast pointer.'
  },
  {
    id: 2,
    title: 'Detect a Cycle in a Linked List',
    difficulty: 'Medium',
    description: 'Determine whether a linked list contains a cycle.',
    hint: 'Use Floyd’s tortoise and hare approach.'
  },
  {
    id: 3,
    title: 'Merge Two Sorted Linked Lists',
    difficulty: 'Hard',
    description: 'Merge two sorted linked lists into one sorted linked list.',
    hint: 'Compare nodes from both lists and build the result iteratively.'
  }
]

function LinkedListPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [activeLanguage, setActiveLanguage] = useState('Java')

  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java
  const highlightLineMap = {
    Java: [4, 5, 6, 7],
    Python: [1, 2, 3, 4],
    JavaScript: [1, 2, 3, 4],
    'C++': [1, 2, 3, 4]
  }
  const highlightedLine = highlightLineMap[activeLanguage]?.[currentStep] ?? 0

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-8 py-12">
        <h1 className="mb-2 text-4xl font-black text-white">Linked List</h1>
        <p className="mb-12 text-gray-400">Understand pointers, traversal, and list mutations</p>

        <div className={`mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 transition-all duration-300 ${currentStep > 0 ? 'shadow-[0_0_20px_rgba(139,92,246,0.25)]' : ''}`}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">What&apos;s happening</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">{narrationSteps[currentStep] || narrationSteps[0]}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Linked List Visualizer</h2>
            <LinkedListVisualizer onStep={setCurrentStep} />
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Traversal Code</h2>
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
          <p className="mb-6 text-gray-400">Apply what you just learned</p>
          <div className="flex flex-col gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-5 transition-all duration-300 hover:border-violet-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{problem.title}</h3>
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

export default LinkedListPage
