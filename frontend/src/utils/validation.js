// frontend/src/utils/validation.js

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateForm = (formData, userType, isLogin) => {
  const errors = {};

  // Email validation
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation (required for doctor and patient)
  if (!isLogin || (userType === 'doctor' || userType === 'patient')) {
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!isLogin && !validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  // Registration-specific validations
  if (!isLogin) {
    if (!validateRequired(formData.fullName)) {
      errors.fullName = 'Full name is required';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (userType === 'doctor' && !validateRequired(formData.specialization)) {
      errors.specialization = 'Specialization is required';
    }

    if (userType === 'doctor' && !validateRequired(formData.licenseNumber)) {
      errors.licenseNumber = 'License number is required';
    }
  }

  return errors;
};