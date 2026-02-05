import { Link } from 'react-router-dom'
import { ShieldX, Home } from 'lucide-react'
import { Button } from '../components/ui'

function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-danger-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You do not have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="lg" leftIcon={<Home className="w-5 h-5" />}>
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default AccessDenied
