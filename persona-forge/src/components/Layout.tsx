import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useStore } from '../store/useStore';
import { Home, PlusSquare, LayoutGrid, GitCompare, Users, BarChart3, Heart } from 'lucide-react';
import { Check, X, Info } from 'lucide-react';
import { useEffect, useRef } from 'react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/builder', label: 'Builder', icon: PlusSquare },
  { path: '/templates', label: 'Templates', icon: LayoutGrid },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/team', label: 'Team', icon: Users },
  { path: '/compare', label: 'Compare', icon: GitCompare },
];

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const toast = useStore((s) => s.toast);
  const hideToast = useStore((s) => s.hideToast);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (toast) {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        hideToast();
      }, 3000);
    }
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [toast, hideToast]);

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg)' }}>
      <div className="animated-bg fixed inset-0 pointer-events-none overflow-hidden" />
      <nav className="sticky top-0 z-50" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1
                onClick={() => navigate('/')}
                className="cursor-pointer flex items-center"
              >
                <span className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '28px' }}>
                  <span className="text-[var(--accent)]">Persona</span>
                  <span style={{ color: 'var(--text)' }}>Forge</span>
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                      style={{
                        background: isActive ? 'var(--accent)' : 'transparent',
                        color: isActive ? 'white' : 'var(--text-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'var(--bg-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl transition-colors"
                aria-label="Toggle theme"
                style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg" style={{ background: 'var(--card-bg)' }}>
          {toast.type === 'success' && <Check className="w-4 h-4 text-green-500" />}
          {toast.type === 'error' && <X className="w-4 h-4 text-red-500" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{toast.message}</span>
          <button onClick={hideToast} className="ml-1 hover:opacity-70">
            <X className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      )}

<nav className="md:hidden fixed bottom-0 left-0 right-0 border-t" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center p-3`}
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <footer className="py-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p className="flex items-center justify-center gap-1">
            <span>&copy; {new Date().getFullYear()} PersonaForge.</span>
            <span>Powered by</span>
            <a 
              href="https://venkateshcreations.github.io/portfolio/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold hover:opacity-80"
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
            >
              Venkatesh Ammireddy
            </a>
          </p>
        </footer>
      </div>
    );
  };