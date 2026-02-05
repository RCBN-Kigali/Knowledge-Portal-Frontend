import { Link } from 'react-router-dom'
import { ShieldX, Home } from 'lucide-react'
import { Button } from '../../components/ui'

function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-danger-600" />
        </div>
        <div className="text-6xl font-bold text-gray-300 mb-4">403</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Forbidden</h1>
        <p className="text-gray-600 mb-8">
          You do not have permission to access this resource.
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

export default Forbidden
