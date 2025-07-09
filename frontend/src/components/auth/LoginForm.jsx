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
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData, userType, true); // true = isLogin
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const loginData = {
          email: formData.email,
          password: formData.password,
          user_type: userType
        };

        const response = await authService.login(loginData);
        
        // CRITICAL SECURITY CHECK: Validate user type matches selection
        const actualUserType = response.user?.user_type || response.user?.userType || response.user?.role;
        
        if (actualUserType && actualUserType !== userType) {
          // User type mismatch - prevent login
          const userTypeNames = {
            patient: 'Patient',
            doctor: 'Doctor', 
            admin: 'Admin'
          };

          setErrors({ 
            submit: `Access denied. This email is registered as a ${userTypeNames[actualUserType] || actualUserType}. Please select "${userTypeNames[actualUserType]}" to login, or use the correct email for ${userTypeNames[userType]} access.`
          });
          setLoading(false);
          return;
        }

        // If we get here, user type matches - proceed with login
        login(response.user, response.access_token);
        
      } catch (error) {
        // Handle different types of errors
        if (error.message?.includes('Invalid credentials') || error.message?.includes('unauthorized')) {
          setErrors({ submit: 'Invalid email or password. Please check your credentials.' });
        } else if (error.message?.includes('user_type') || error.message?.includes('role')) {
          setErrors({ submit: 'Access denied. Please select the correct user type for this account.' });
        } else {
          setErrors({ submit: error.message || 'Login failed. Please try again.' });
        }
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
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p>{errors.submit}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
          currentUserType.color
        } hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
      >
        {loading ? 'Verifying credentials...' : `Login as ${currentUserType.label}`}
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

      {/* Helpful hint */}
      <div className="text-center text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
        💡 <strong>Tip:</strong> Make sure to select the correct user type that matches your account registration.
      </div>
    </div>
  );
};

export default LoginForm;