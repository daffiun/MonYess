import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'accounts': return <Accounts />;
      case 'transactions': return <Transactions />;
      default: return <Dashboard />;
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* 
        NOTE: Since we haven't set up React Router yet for this static prototype, 
        we'll use a simple state to switch pages for visual confirmation. 
        The MainLayout needs to be updated to handle this navigation.
      */}
      <MainLayout onNavigate={setCurrentPage} currentPage={currentPage}>
        {renderPage()}
      </MainLayout>
    </div>
  )
}

export default App
