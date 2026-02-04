import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const LoginPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="card max-w-md w-full text-center">
      <h1 className="mb-2">Knowledge Portal</h1>
      <p className="text-gray-600">Login page coming soon</p>
    </div>
  </div>
)

const DashboardPage = () => (
  <div className="min-h-screen bg-gray-50 p-4">
    <div className="page-container">
      <h1 className="mb-4">Dashboard</h1>
      <div className="card">
        <p className="text-gray-600">Dashboard content coming soon</p>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<div className="p-8 text-center"><h1>404 - Not Found</h1></div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
