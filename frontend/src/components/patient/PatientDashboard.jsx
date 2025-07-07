// frontend/src/components/patient/PatientDashboard.jsx
// import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, User, FileText, Phone, LogOut } from 'lucide-react';

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">M+</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Patient Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.full_name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to your Patient Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your appointments, view medical records, and stay connected with your healthcare providers.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Calendar className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Appointments</h3>
            <p className="text-sm text-gray-600">Schedule and manage your appointments</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Medical Records</h3>
            <p className="text-sm text-gray-600">View your medical history and reports</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <User className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Profile</h3>
            <p className="text-sm text-gray-600">Update your personal information</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Phone className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
            <p className="text-sm text-gray-600">Get in touch with your care team</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity to display</p>
              <p className="text-sm">Your appointments and medical updates will appear here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;