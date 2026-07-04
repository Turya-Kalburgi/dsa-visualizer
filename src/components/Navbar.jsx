import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-950 border-b border-gray-800">
      <Link to="/" className="text-2xl font-black text-white tracking-tight">
        DSA <span className="text-violet-500">Visualizer</span>
      </Link>
      <div className="flex gap-8">
        <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">
          Topics
        </Link>
        <Link to="/practice" className="text-gray-300 hover:text-white font-medium transition-colors">
          Practice
        </Link>
        <Link to="/playground" className="text-gray-300 hover:text-white font-medium transition-colors">
          Playground
        </Link>
      </div>
    </nav>
  )
}

export default Navbar   