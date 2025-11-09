import { Link, Outlet } from 'react-router-dom'
import SocialLinks from './SocialLinks'
import { socialConfig } from '../config/social'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 font-medium hover:text-blue-600"
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-blue-600"
              >
                Blog
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-blue-600"
              >
                Services
              </Link>
              <a
                href={socialConfig.cal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-blue-600"
              >
                Cal.com
              </a>
            </div>
            <div>
              <SocialLinks size="sm" />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
