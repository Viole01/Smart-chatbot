// frontend/src/components/doctor/DoctorDashboard.jsx
// import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, FileText, Stethoscope, LogOut, Clock } from 'lucide-react';

const DoctorDashboard = () => {
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
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">M+</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Doctor Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">Dr. {user?.full_name}</p>
                <p className="text-xs text-gray-600">{user?.specialization}</p>
              </div>
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
        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, Dr. {user?.full_name}
          </h2>
          <p className="text-gray-600">
            Manage your patients, appointments, and medical records from your dashboard.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">24</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-800">5</p>
              </div>
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hours Today</p>
                <p className="text-2xl font-bold text-gray-800">6.5</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Users className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Patient List</h3>
            <p className="text-sm text-gray-600">View and manage your patients</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Calendar className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Schedule</h3>
            <p className="text-sm text-gray-600">Manage your appointments and availability</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <FileText className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Medical Records</h3>
            <p className="text-sm text-gray-600">Access patient records and histories</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Stethoscope className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Consultations</h3>
            <p className="text-sm text-gray-600">Start or continue patient consultations</p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">John Smith</p>
                  <p className="text-sm text-gray-600">Regular Checkup</p>
                </div>
                <span className="text-sm font-medium text-blue-600">09:00 AM</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Follow-up Consultation</p>
                </div>
                <span className="text-sm font-medium text-green-600">10:30 AM</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Michael Brown</p>
                  <p className="text-sm text-gray-600">Cardiology Consultation</p>
                </div>
                <span className="text-sm font-medium text-orange-600">02:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;