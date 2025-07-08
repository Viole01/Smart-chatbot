// frontend/src/components/auth/AuthForm.jsx
import { useState } from 'react';
import { Mail, Eye, EyeOff, Phone, User, Stethoscope, FileText } from 'lucide-react';

const AuthForm = ({ 
  formData, 
  setFormData, 
  errors, 
  isLogin, 
  userType, 
  onSubmit 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  // CRITICAL LOGIC: Phone field should ONLY show during registration for doctors and patients
  const shouldShowPhone = !isLogin && (userType === 'doctor' || userType === 'patient');

  return (
    <div className="space-y-4">
      {/* Full Name - Registration only */}
      {!isLogin && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
      )}

      {/* Email Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Phone Number - ONLY during registration for doctors and patients */}
      {shouldShowPhone && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      )}

      {/* Doctor-specific fields - Registration only */}
      {!isLogin && userType === 'doctor' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization *
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="specialization"
                value={formData.specialization || ''}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.specialization ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Cardiology, Dermatology"
              />
            </div>
            {errors.specialization && (
              <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical License Number *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber || ''}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your license number"
              />
            </div>
            {errors.licenseNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>
            )}
          </div>
        </>
      )}

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password - Registration only */}
      {!isLogin && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthForm;