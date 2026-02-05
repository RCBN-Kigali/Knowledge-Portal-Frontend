import { Link } from 'react-router-dom'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui'

function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-danger-600" />
        </div>
        <div className="text-6xl font-bold text-gray-300 mb-4">500</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Server Error</h1>
        <p className="text-gray-600 mb-8">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<RefreshCw className="w-5 h-5" />}
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
          <Link to="/">
            <Button variant="secondary" size="lg" leftIcon={<Home className="w-5 h-5" />}>
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ServerError
