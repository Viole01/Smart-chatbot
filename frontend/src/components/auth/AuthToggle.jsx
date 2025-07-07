// frontend/src/components/auth/AuthToggle.jsx
// import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';

const AuthToggle = ({ isLogin, setIsLogin }) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      <button
        onClick={() => setIsLogin(true)}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          isLogin 
            ? 'bg-white text-gray-800 shadow-sm' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <LogIn className="w-4 h-4 inline mr-2" />
        Login
      </button>
      <button
        onClick={() => setIsLogin(false)}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          !isLogin 
            ? 'bg-white text-gray-800 shadow-sm' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <UserPlus className="w-4 h-4 inline mr-2" />
        Register
      </button>
    </div>
  );
};

export default AuthToggle;