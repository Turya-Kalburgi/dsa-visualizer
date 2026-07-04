import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TopicGrid from './components/TopicGrid'
import TopicPage from './pages/TopicPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Hero />
            <TopicGrid />
          </>
        } />
        <Route path="/topic/:id" element={<TopicPage />} />
      </Routes>
    </div>
  )
}

export default App