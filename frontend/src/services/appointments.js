// frontend/src/services/appointments.js
import api from './api';

export const appointmentService = {
  // Analyze patient symptoms
  analyzeSymptoms: async (symptoms) => {
    try {
      const response = await api.post('/appointments/analyze-symptoms', {
        symptoms,
        // patient_id will be automatically included from the authenticated user
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      throw error;
    }
  },

  // Get available doctors by specialty
  getAvailableDoctors: async (specialty = 'General Practice', date = null) => {
    try {
      const params = new URLSearchParams();
      if (specialty) params.append('specialty', specialty);
      if (date) params.append('date', date);
      
      const response = await api.get(`/appointments/available-doctors?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available doctors:', error);
      throw error;
    }
  },

  // Book an appointment
  bookAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments/book-appointment', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },

  // Get user's appointments
  getMyAppointments: async () => {
    try {
      const response = await api.get('/appointments/my-appointments');
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  // Get doctor's schedule (for doctor users)
  getDoctorSchedule: async (doctorId, date = null) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      
      const response = await api.get(`/appointments/doctor-schedule/${doctorId}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
      throw error;
    }
  }
};