// frontend/src/components/auth/UserTypeSelector.jsx
// import React from 'react';
import { USER_TYPES } from '../../utils/constants';

const UserTypeSelector = ({ userType, setUserType, isLogin }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {isLogin ? 'Login as' : 'Register as'}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {USER_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setUserType(type.id)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                userType === type.id
                  ? `${type.color} border-transparent text-white`
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-medium">{type.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserTypeSelector;