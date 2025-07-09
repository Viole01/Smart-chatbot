// frontend/src/services/appointments.js
const API_BASE_URL = '/api/v1';

export const appointmentService = {
  // Collect patient demographics
  collectDemographics: async (age, gender) => {
    const response = await fetch(`${API_BASE_URL}/appointments/collect-demographics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ age, gender })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to collect demographics');
    }
    
    return response.json();
  },

  // Analyze symptoms with demographics
  analyzeSymptoms: async (symptoms, age, gender) => {
    const response = await fetch(`${API_BASE_URL}/appointments/analyze-symptoms-enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ symptoms, age, gender })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to analyze symptoms');
    }
    
    return response.json();
  },

  // Get available doctors by specialty
  getAvailableDoctors: async (specialty) => {
    const response = await fetch(`${API_BASE_URL}/availability/doctors/by-specialty/${encodeURIComponent(specialty)}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get available doctors');
    }
    
    return response.json();
  },

  // Get doctor's public availability
  getDoctorAvailability: async (doctorId) => {
    const response = await fetch(`${API_BASE_URL}/availability/doctor/${doctorId}/availability`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get doctor availability');
    }
    
    return response.json();
  },

  // Book appointment with demographics
  bookAppointment: async (appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments/book-appointment-enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(appointmentData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to book appointment');
    }
    
    return response.json();
  },

  // Get user's appointments
  getMyAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/my-appointments`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get appointments');
    }
    
    return response.json();
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    const response = await fetch(`${API_BASE_URL}/appointments/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to cancel appointment');
    }
    
    return response.json();
  }
};