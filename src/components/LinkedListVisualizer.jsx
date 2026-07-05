import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const INITIAL_VALUES = [10, 20, 30]

function LinkedListVisualizer({ onStep }) {
  const [nodes, setNodes] = useState(INITIAL_VALUES)
  const [inputValue, setInputValue] = useState('')

  const insertNode = () => {
    const value = Number(inputValue)
    if (Number.isNaN(value)) return

    setNodes(prev => [...prev, value])
    setInputValue('')
    onStep?.(1)
  }

  const deleteNode = (index) => {
    setNodes(prev => prev.filter((_, i) => i !== index))
    onStep?.(2)
  }

  const reverseList = () => {
    setNodes(prev => [...prev].reverse())
    onStep?.(3)
  }

  const resetList = () => {
    setNodes(INITIAL_VALUES)
    setInputValue('')
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="w-32 rounded-xl border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-gray-500"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={insertNode}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Insert
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={reverseList}
          className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Reverse
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={resetList}
          className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Reset
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-2 overflow-x-auto rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
        <AnimatePresence initial={false} mode="popLayout">
          {nodes.map((value, index) => (
            <div key={`${value}-${index}`} className="flex items-center gap-2">
              <motion.button
                layout
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -12, scale: 0.95 }}
                transition={{ duration: 0.24 }}
                onClick={() => deleteNode(index)}
                className="flex flex-col items-center rounded-2xl border border-violet-500/40 bg-gray-900 px-4 py-3 text-white shadow-[0_0_18px_rgba(139,92,246,0.18)] transition hover:border-violet-400 hover:shadow-[0_0_24px_rgba(139,92,246,0.28)]"
              >
                <span className="text-lg font-black">{value}</span>
              </motion.button>

              {index < nodes.length - 1 ? (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold text-violet-400"
                >
                  →
                </motion.div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-xl font-bold text-violet-400">→</span>
                  <span className="font-medium">NULL</span>
                </div>
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>

      {nodes.length === 0 && (
        <p className="text-sm text-gray-500">The list is empty. Insert a value to get started.</p>
      )}
    </div>
  )
}

export default LinkedListVisualizer
