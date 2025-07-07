// frontend/src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth';
import { validateForm } from '../../utils/validation';
import { USER_TYPES } from '../../utils/constants';
import UserTypeSelector from './UserTypeSelector';
import AuthForm from './AuthForm';

const LoginForm = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData, userType, true);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await authService.login({
          email: formData.email,
          password: formData.password,
          user_type: userType
        });
        
        login(response.user, response.access_token);
        // Redirect will be handled by the router
      } catch (error) {
        setErrors({ submit: error.message || 'Login failed' });
      } finally {
        setLoading(false);
      }
    }
  };

  const currentUserType = USER_TYPES.find(type => type.id === userType);

  return (
    <div className="space-y-6">
      <UserTypeSelector 
        userType={userType} 
        setUserType={setUserType} 
        isLogin={true} 
      />
      
      <AuthForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        isLogin={true}
        userType={userType}
        onSubmit={handleSubmit}
      />

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
          currentUserType.color
        } hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
      >
        {loading ? 'Logging in...' : `Login as ${currentUserType.label}`}
      </button>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          Register here
        </button>
      </div>
    </div>
  );
};

export default LoginForm;