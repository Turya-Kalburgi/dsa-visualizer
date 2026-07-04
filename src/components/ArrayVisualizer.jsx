import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

const ARRAY = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
const WINDOW_SIZE = 3

function ArrayVisualizer({ onStep }) {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(WINDOW_SIZE - 1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(800)
  const [maxSum, setMaxSum] = useState(0)
  const [currentSum, setCurrentSum] = useState(0)
  const intervalRef = useRef(null)

  const getSum = (l, r) => ARRAY.slice(l, r + 1).reduce((a, b) => a + b, 0)

  const notifyStep = (step) => {
    onStep?.(step)
  }

  const step = () => {
    setLeft(prev => {
      const newLeft = prev + 1
      const newRight = newLeft + WINDOW_SIZE - 1
      if (newRight >= ARRAY.length) {
        setIsPlaying(false)
        notifyStep(4)
        return prev
      }
      setRight(newRight)
      const sum = getSum(newLeft, newRight)
      setCurrentSum(sum)
      setMaxSum(max => Math.max(max, sum))
      notifyStep(2)
      return newLeft
    })
  }

  const reset = () => {
    setLeft(0)
    setRight(WINDOW_SIZE - 1)
    setIsPlaying(false)
    setCurrentSum(getSum(0, WINDOW_SIZE - 1))
    setMaxSum(getSum(0, WINDOW_SIZE - 1))
    notifyStep(0)
  }

  useEffect(() => {
    setCurrentSum(getSum(0, WINDOW_SIZE - 1))
    setMaxSum(getSum(0, WINDOW_SIZE - 1))
  }, [])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(step, speed)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, speed, left])

  return (
    <div className="flex flex-col items-center gap-6 py-6">

      {/* Array boxes */}
      <div className="flex gap-2">
        {ARRAY.map((val, i) => {
          const inWindow = i >= left && i <= right
          const isLeft = i === left
          const isRight = i === right

          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  scale: inWindow ? 1.15 : 1,
                  backgroundColor: inWindow ? '#7c3aed' : '#1f2937',
                }}
                transition={{ duration: 0.3 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base border-2"
                style={{
                  borderColor: isLeft
                    ? '#10b981'
                    : isRight
                    ? '#ef4444'
                    : inWindow
                    ? '#7c3aed'
                    : '#374151'
                }}
              >
                {val}
              </motion.div>
              <span className="text-xs text-gray-500">{i}</span>
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-sm">
        <span className="text-green-400 font-bold">● L = {left}</span>
        <span className="text-red-400 font-bold">● R = {right}</span>
        <span className="text-violet-400 font-bold">● Sum = {currentSum}</span>
        <span className="text-yellow-400 font-bold">● Max = {maxSum}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-gray-700 text-white font-bold text-sm hover:bg-gray-600"
        >
          ↺ Reset
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const newLeft = left - 1
            const newRight = newLeft + WINDOW_SIZE - 1
            if (newLeft < 0) return
            setLeft(newLeft)
            setRight(newRight)
            const sum = getSum(newLeft, newRight)
            setCurrentSum(sum)
            setMaxSum(prev => Math.max(prev, sum))
            notifyStep(1)
          }}
          className="px-4 py-2 rounded-xl bg-gray-700 text-white font-bold text-sm hover:bg-gray-600"
        >
          ◀ Prev
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={step}
          className="px-4 py-2 rounded-xl bg-gray-700 text-white font-bold text-sm hover:bg-gray-600"
        >
          ▶ Step
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(p => !p)}
          className={`px-6 py-2 rounded-xl font-bold text-sm text-white ${
            isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-violet-600 hover:bg-violet-500'
          }`}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </motion.button>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Speed</span>
          <input
            type="range"
            min="200"
            max="1500"
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-20 accent-violet-500"
          />
        </div>
      </div>
    </div>
  )
}

export default ArrayVisualizer