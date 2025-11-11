import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAgent } from '@/contexts/AgentContext';
import { MAJA_INFO, ROUTES } from '@/utils/constants';
import { formatCredits } from '@/utils/formatting';

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetAllState } = useAgent();
  
  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Foundation Space', path: ROUTES.FOUNDATION },
    { label: 'Analysis', path: ROUTES.ANALYSIS },
    { label: 'Timeline', path: ROUTES.TIMELINE },
    { label: 'Docs', path: ROUTES.DOCS },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-12">
            <Link to={ROUTES.DASHBOARD} className="text-xl font-light tracking-wider">
              ColliderLab
            </Link>
            
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-gray-900 border-b-2 border-gray-900 pb-[22px]'
                      : 'text-gray-500 hover:text-gray-900 pb-[22px]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <button
              onClick={resetAllState}
              className="flex items-center space-x-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors text-xs"
              title="Reset demo state"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
            <div className="flex items-center space-x-3">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200">
                HiLumi M.C.
              </span>
              <div className="text-right">
                <div className="text-gray-900 font-medium">{MAJA_INFO.name}</div>
                <div className="text-gray-500 text-xs">{formatCredits(MAJA_INFO.credits)} credits</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

