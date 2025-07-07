// frontend/src/components/admin/AdminDashboard.jsx
// import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, UserCheck, Shield, Settings, BarChart3, Database, LogOut } from 'lucide-react';

const AdminDashboard = () => {
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
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">M+</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin: {user?.full_name}</span>
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
        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-gray-600">
            Manage users, monitor system performance, and configure platform settings.
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">1,247</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-gray-800">89</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold text-gray-800">1,158</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-green-600">98%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Users className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">User Management</h3>
            <p className="text-sm text-gray-600">Add, edit, or remove users from the system</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <UserCheck className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Doctor Verification</h3>
            <p className="text-sm text-gray-600">Review and approve doctor registrations</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <BarChart3 className="w-8 h-8 text-purple-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">View system usage and performance metrics</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Settings className="w-8 h-8 text-gray-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">System Settings</h3>
            <p className="text-sm text-gray-600">Configure platform settings and preferences</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Database className="w-8 h-8 text-indigo-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Data Management</h3>
            <p className="text-sm text-gray-600">Backup, restore, and manage system data</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Shield className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Security</h3>
            <p className="text-sm text-gray-600">Monitor security logs and manage permissions</p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Approvals */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Pending Approvals</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Dr. Emily Wilson</p>
                    <p className="text-sm text-gray-600">Cardiology • License: MC12345</p>
                  </div>
                  <button className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Approve
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Dr. James Rodriguez</p>
                    <p className="text-sm text-gray-600">Dermatology • License: MC67890</p>
                  </div>
                  <button className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Approve
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Dr. Sarah Chen</p>
                    <p className="text-sm text-gray-600">Pediatrics • License: MC11111</p>
                  </div>
                  <button className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System Activity */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">System Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">New patient registered</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Doctor profile updated</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">System backup completed</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Security scan completed</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Database optimization complete</p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Failed login attempt blocked</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;