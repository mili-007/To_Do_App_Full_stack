import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

const MAIN_CLASS = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6';

const Layout = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <AppHeader />
    <main className={MAIN_CLASS}>
      <Outlet />
    </main>
  </div>
);

export default Layout;
