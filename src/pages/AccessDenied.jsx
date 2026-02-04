import { useNavigate } from 'react-router-dom'
import { ShieldX, Home } from 'lucide-react'
import { Button, Card } from '../components/ui'

export function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-danger-100 flex items-center justify-center">
          <ShieldX className="w-10 h-10 text-danger-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. If you think this is a mistake, please contact your administrator.
        </p>
        
        <Button onClick={() => navigate('/dashboard')} leftIcon={<Home className="w-5 h-5" />}>
          Go to Dashboard
        </Button>
      </Card>
    </div>
  )
}

export default AccessDenied
