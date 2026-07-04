

import Editor from '@monaco-editor/react'
import { useState } from 'react'

const starterCode = {
  javascript: `function maxSlidingWindow(arr, k) {
  // Write your solution here
  
}`,
  python: `def max_sliding_window(arr, k):
    # Write your solution here
    pass`,
  java: `class Solution {
    public int maxSlidingWindow(int[] arr, int k) {
        // Write your solution here
        return 0;
    }
}`,
  cpp: `class Solution {
public:
    int maxSlidingWindow(vector<int>& arr, int k) {
        // Write your solution here
        return 0;
    }
};`
}

function CodeEditor() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(starterCode['javascript'])
  const [output, setOutput] = useState('')

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCode(starterCode[lang])
  }

  const handleRun = () => {
    setOutput('Code execution coming soon — Judge0 API integration on Day 11!')
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-black text-white mb-2">Try It Yourself</h2>
      <p className="text-gray-400 mb-6">Write your own solution and test it</p>

      <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden">
        {/* Language Selector */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
          {['javascript', 'python', 'java', 'cpp'].map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                language === lang
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
          <div className="ml-auto">
            <button
              onClick={handleRun}
              className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-1.5 rounded-lg text-sm transition-colors"
            >
              Run Code
            </button>
          </div>
        </div>

        {/* Editor */}
        <Editor
          height="300px"
          language={language === 'cpp' ? 'cpp' : language}
          value={code}
          onChange={(val) => setCode(val)}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            lineNumbers: 'on',
            roundedSelection: true,
          }}
        />

        {/* Output */}
        {output && (
          <div className="px-6 py-4 border-t border-gray-800 bg-gray-950">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Output</p>
            <p className="text-green-400 font-mono text-sm">{output}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeEditor