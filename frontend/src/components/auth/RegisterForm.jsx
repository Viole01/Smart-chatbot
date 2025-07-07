// frontend/src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth';
import { validateForm } from '../../utils/validation';
import { USER_TYPES } from '../../utils/constants';
import UserTypeSelector from './UserTypeSelector';
import AuthForm from './AuthForm';

const RegisterForm = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    specialization: '',
    licenseNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData, userType, false);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const registrationData = {
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          phone: formData.phone,
          user_type: userType,
          ...(userType === 'doctor' && {
            specialization: formData.specialization,
            license_number: formData.licenseNumber
          })
        };

        const response = await authService.register(registrationData);
        
        // Auto-login after successful registration
        login(response.user, response.access_token);
        // Redirect will be handled by the router
      } catch (error) {
        setErrors({ submit: error.message || 'Registration failed' });
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
        isLogin={false} 
      />
      
      <AuthForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        isLogin={false}
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
        {loading ? 'Creating account...' : `Register as ${currentUserType.label}`}
      </button>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          Login here
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;