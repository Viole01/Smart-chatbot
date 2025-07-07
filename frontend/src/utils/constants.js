// frontend/src/utils/constants.js
import { User, Stethoscope, Shield } from 'lucide-react';

export const USER_TYPES = [
  { 
    id: 'patient', 
    label: 'Patient', 
    icon: User, 
    color: 'bg-blue-500', 
    bgColor: 'bg-blue-50' 
  },
  { 
    id: 'doctor', 
    label: 'Doctor', 
    icon: Stethoscope, 
    color: 'bg-green-500', 
    bgColor: 'bg-green-50' 
  },
  { 
    id: 'admin', 
    label: 'Admin', 
    icon: Shield, 
    color: 'bg-purple-500', 
    bgColor: 'bg-purple-50' 
  }
];

export const FORM_MODES = {
  LOGIN: 'login',
  REGISTER: 'register'
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PATIENT_DASHBOARD: '/patient/dashboard',
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard'
};

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Please enter a valid phone number',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  FULL_NAME_REQUIRED: 'Full name is required',
  SPECIALIZATION_REQUIRED: 'Specialization is required',
  LICENSE_REQUIRED: 'License number is required'
};