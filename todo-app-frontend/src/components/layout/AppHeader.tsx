import { Link, NavLink, useNavigate } from 'react-router-dom';
import { NAV_LINKS, getNavLinkClassName } from '../../constants/nav';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';

const AppHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 text-gray-900 hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg leading-none" aria-hidden>✓</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Todo App
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5" aria-label="Main">
              {NAV_LINKS?.map(({ to, label }) => (
                <NavLink key={to} to={to} end className={getNavLinkClassName}>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-8 h-8 shrink-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm"
                aria-hidden
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm text-gray-700 font-medium truncate max-w-[120px]">
                {user?.name}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
