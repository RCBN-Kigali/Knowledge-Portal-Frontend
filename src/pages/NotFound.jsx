import { useNavigate } from 'react-router-dom'
import { FileQuestion, Home } from 'lucide-react'
import { Button, Card } from '../components/ui'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <FileQuestion className="w-10 h-10 text-gray-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <Button onClick={() => navigate('/dashboard')} leftIcon={<Home className="w-5 h-5" />}>
          Go to Dashboard
        </Button>
      </Card>
    </div>
  )
}

export default NotFound
