import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'

const codeSnippets = {
  Java: [
    'class TrieNode {',
    '  TrieNode[] children = new TrieNode[26];',
    '  boolean endOfWord;',
    '}',
    'void insert(String word) {',
    '  TrieNode node = root;',
    '  for (char c : word.toCharArray()) {',
    '    if (node.children[c - \"a\"] == null) node.children[c - \"a\"] = new TrieNode();',
    '    node = node.children[c - \"a\"];',
    '  }',
    '  node.endOfWord = true;',
    '}'
  ],
  Python: [
    'class TrieNode:',
    '    def __init__(self):',
    '        self.children = {}',
    '        self.end = False',
    'def insert(root, word):',
    '    node = root',
    '    for ch in word:',
    '        node = node.children.setdefault(ch, TrieNode())',
    '    node.end = True'
  ],
  JavaScript: [
    'class TrieNode {',
    '  constructor() { this.children = {}; this.end = false; }',
    '}',
    'function insert(root, word) {',
    '  let node = root;',
    '  for (const ch of word) {',
    '    if (!node.children[ch]) node.children[ch] = new TrieNode();',
    '    node = node.children[ch];',
    '  }',
    '  node.end = true;',
    '}'
  ],
  'C++': [
    'struct TrieNode {',
    '  unordered_map<char, TrieNode*> children;',
    '  bool end = false;',
    '};',
    'void insert(TrieNode* root, string word) {',
    '  TrieNode* node = root;',
    '  for (char ch : word) {',
    '    if (!node->children.count(ch)) node->children[ch] = new TrieNode();',
    '    node = node->children[ch];',
    '  }',
    '  node->end = true;',
    '}'
  ]
}

const problems = [
  { id: 1, title: 'Longest Common Prefix', difficulty: 'Easy', description: 'Find the longest common prefix among a list of strings.', hint: 'Build a trie and walk down the shared path.' },
  { id: 2, title: 'Implement Trie', difficulty: 'Medium', description: 'Build insert, search, and prefix operations for a trie.', hint: 'Each node should store child links and whether it ends a word.' },
  { id: 3, title: 'Word Search II', difficulty: 'Hard', description: 'Find all words that can be formed from a board using trie pruning.', hint: 'Use the trie to prune search branches early.' }
]

function TriesPage() {
  const [activeLanguage, setActiveLanguage] = useState('Java')
  const [insertWord, setInsertWord] = useState('')
  const [searchWord, setSearchWord] = useState('')
  const [history, setHistory] = useState(['cat', 'car'])
  const [message, setMessage] = useState('Insert a word to grow the trie character by character.')

  const codeLines = codeSnippets[activeLanguage] || codeSnippets.Java
  const highlightedLine = 2

  const insert = () => {
    const word = insertWord.trim().toLowerCase()
    if (!word) return
    setHistory((prev) => [...prev, word])
    setMessage(`Inserted "${word}" into the trie.`)
    setInsertWord('')
  }

  const search = () => {
    const word = searchWord.trim().toLowerCase()
    if (!word) return
    const found = history.includes(word)
    setMessage(found ? `Found "${word}" in the trie.` : `"${word}" was not found in the trie.`)
  }

  const trieWords = useMemo(() => history, [history])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <h1 className="mb-2 text-4xl font-black text-white">Tries</h1>
        <p className="mb-8 text-gray-400">Build a prefix tree one character at a time.</p>

        <div className="mb-8 rounded-2xl border-l-4 border-violet-500 bg-gray-900 px-6 py-4 shadow-[0_0_25px_rgba(139,92,246,0.16)]">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Narration</p>
          <p className="text-base font-medium leading-relaxed text-gray-200">{message}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Trie Visualizer</h2>
                <p className="text-sm text-gray-400">Insert and search words through the prefix tree.</p>
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <input value={insertWord} onChange={(event) => setInsertWord(event.target.value)} placeholder="Insert word" className="flex-1 rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500" />
              <button onClick={insert} className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500">Insert</button>
            </div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <input value={searchWord} onChange={(event) => setSearchWord(event.target.value)} placeholder="Search word" className="flex-1 rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500" />
              <button onClick={search} className="rounded-xl bg-gray-800 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700">Search</button>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
              <div className="flex flex-wrap gap-3">
                {trieWords.map((word, index) => (
                  <motion.span key={`${word}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-full bg-violet-600/20 px-3 py-1 text-sm font-semibold text-violet-300">{word}</motion.span>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/70 p-4 text-sm text-gray-400">
                <p>Words stored in the trie: {trieWords.join(', ') || 'none'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Trie Code</h2>
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
          <p className="mb-6 text-gray-400">Challenge yourself with trie-based problems.</p>
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

export default TriesPage
