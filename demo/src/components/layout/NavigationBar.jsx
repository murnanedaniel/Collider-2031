import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAgent } from '@/contexts/AgentContext';
import { CHARACTERS, CHARACTER_ORDER, ROUTES } from '@/utils/constants';
import { formatCredits } from '@/utils/formatting';

// Nav links shown for each character. Maja keeps the full platform nav;
// the others get their single flow plus shared destinations.
function navItemsFor(characterId) {
  if (characterId === 'maja') {
    return [
      { label: 'Dashboard', path: ROUTES.DASHBOARD },
      { label: 'Foundation Space', path: ROUTES.FOUNDATION },
      { label: 'Analysis', path: ROUTES.ANALYSIS },
      { label: 'Timeline', path: ROUTES.TIMELINE },
      { label: 'Docs', path: ROUTES.DOCS },
    ];
  }
  const flowLabels = {
    erik: 'AutoAna',
    sofia: 'Validation',
    elena: 'MACE Workspace',
  };
  return [
    { label: flowLabels[characterId] ?? 'Workspace', path: CHARACTERS[characterId].route },
    { label: 'Docs', path: ROUTES.DOCS },
  ];
}

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('');
}

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetAllState, activeCharacter, activeInfo, enterCharacter } = useAgent();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navItems = navItemsFor(activeCharacter);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    navigate(ROUTES.LOGIN);
  };

  const switchRole = (id) => {
    setRoleMenuOpen(false);
    enterCharacter(id);
    navigate(CHARACTERS[id].route);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-12">
            <Link to={activeInfo.route} className="text-xl font-light tracking-wider">
              ColliderLab
            </Link>

            <div className="flex space-x-8 h-full items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors h-full flex items-center ${isActive(item.path)
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
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

            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200">
              {activeInfo.affiliation}
            </span>

            {/* Role switcher — click the avatar/identity to change protagonist */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen((o) => !o)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg pl-2 pr-1 py-1 transition-colors"
                title="Switch role"
              >
                <div className="text-right">
                  <div className="text-gray-900 font-medium leading-tight">{activeInfo.name}</div>
                  <div className="text-gray-500 text-xs leading-tight">{formatCredits(activeInfo.credits)} credits</div>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: activeInfo.color }}
                >
                  {initials(activeInfo.name)}
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {roleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                      Switch role
                    </div>
                    {CHARACTER_ORDER.map((id) => {
                      const c = CHARACTERS[id];
                      const active = id === activeCharacter;
                      return (
                        <button
                          key={id}
                          onClick={() => switchRole(id)}
                          className={`w-full text-left px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${active ? 'bg-gray-50' : ''}`}
                        >
                          <span
                            className="w-7 h-7 mt-0.5 rounded-full flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0"
                            style={{ backgroundColor: c.color }}
                          >
                            {initials(c.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{c.name}</span>
                              <span className="text-xs text-gray-400">· {c.startYear}</span>
                              {active && <span className="text-[10px] text-green-600">● active</span>}
                            </span>
                            <span className="block text-xs text-gray-500 truncate">{c.tagline}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
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
