import React from 'react'
import { ChevronRight, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

const Breadcrumb = ({ currentPath, toggleSidebar }) => {
    const pathSegments = currentPath.split('/').filter(Boolean)

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200">
            <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <Link to="/" className="text-xs text-gray-600 hover:text-[var(--primary-color)]">
                Home
            </Link>

            {pathSegments.map((segment, index) => (
                <React.Fragment key={segment}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <Link
                        to={`/${pathSegments.slice(0, index + 1).join('/')}`}
                        className={`text-xs ${index === pathSegments.length - 1
                                ? 'text-[var(--primary-color)] font-semibold'
                                : 'text-gray-600 hover:text-[var(--primary-color)]'
                            }`}
                    >
                        {segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')}
                    </Link>
                </React.Fragment>
            ))}
        </div>
    )
}

export default Breadcrumb