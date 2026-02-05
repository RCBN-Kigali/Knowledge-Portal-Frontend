import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary-600 text-sm">About Us</Link></li>
              <li><Link to="/schools" className="text-gray-600 hover:text-primary-600 text-sm">Our Schools</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary-600 text-sm">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Courses</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-600 hover:text-primary-600 text-sm">Browse Courses</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-primary-600 text-sm">Categories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-primary-600 text-sm">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-primary-600 text-sm">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary-600 text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary-600 text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} Paysannat L School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
