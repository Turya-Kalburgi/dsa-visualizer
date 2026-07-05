import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TopicGrid from './components/TopicGrid'
import TopicPage from './pages/TopicPage'
import LinkedListPage from './pages/LinkedListPage'
import StackPage from './pages/StackPage'
import QueuePage from './pages/QueuePage'
import RecursionPage from './pages/RecursionPage'
import BinarySearchPage from './pages/BinarySearchPage'
import SortingPage from './pages/SortingPage'
import TreesPage from './pages/TreesPage'
import GraphsPage from './pages/GraphsPage'
import HeapsPage from './pages/HeapsPage'
import DPPage from './pages/DPPage'
import TriesPage from './pages/TriesPage'

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
        <Route path="/topic/arrays" element={<TopicPage />} />
        <Route path="/topic/linked-list" element={<LinkedListPage />} />
        <Route path="/topic/stacks" element={<StackPage />} />
        <Route path="/topic/queues" element={<QueuePage />} />
        <Route path="/topic/recursion" element={<RecursionPage />} />
        <Route path="/topic/binary-search" element={<BinarySearchPage />} />
        <Route path="/topic/sorting" element={<SortingPage />} />
        <Route path="/topic/trees" element={<TreesPage />} />
        <Route path="/topic/graphs" element={<GraphsPage />} />
        <Route path="/topic/heaps" element={<HeapsPage />} />
        <Route path="/topic/dp" element={<DPPage />} />
        <Route path="/topic/tries" element={<TriesPage />} />
        <Route path="/topic/:id" element={<TopicPage />} />
      </Routes>
    </div>
  )
}

export default App