// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import AuthToggle from '../components/auth/AuthToggle';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <div className="text-white text-2xl font-bold">M+</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">MedConnect</h1>
          <p className="text-gray-600">Your healthcare management portal</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <AuthToggle isLogin={isLogin} setIsLogin={setIsLogin} />
          
          {isLogin ? (
            <LoginForm onToggleMode={handleToggleMode} />
          ) : (
            <RegisterForm onToggleMode={handleToggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;