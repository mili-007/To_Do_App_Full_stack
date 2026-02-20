import { Outlet } from 'react-router-dom';


const AuthRouteLayout = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthRouteLayout;
