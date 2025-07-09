// frontend/src/components/doctor/AvailabilityManager.jsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Save } from 'lucide-react';

const AvailabilityManager = () => {
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  // Removed unused editingSlot state variables
  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    duration: 30, // minutes per appointment
    isRecurring: false,
    recurringDays: []
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/doctor/availability', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAvailability(data.availability || {});
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  const saveAvailability = async (dateKey, slots) => {
    try {
      const response = await fetch('/api/doctor/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: dateKey,
          slots: slots
        })
      });
      
      if (response.ok) {
        setAvailability(prev => ({
          ...prev,
          [dateKey]: slots
        }));
      }
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  };

  const generateTimeSlots = (startTime, endTime, duration) => {
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    let current = new Date(start);
    while (current < end) {
      const timeSlot = current.toTimeString().slice(0, 5);
      slots.push({
        id: Date.now() + Math.random(),
        time: timeSlot,
        duration: duration,
        isBooked: false,
        patientId: null
      });
      current.setMinutes(current.getMinutes() + duration);
    }
    
    return slots;
  };

  const addTimeSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) return;
    
    const slots = generateTimeSlots(newSlot.startTime, newSlot.endTime, newSlot.duration);
    const dateKey = selectedDate;
    
    const updatedSlots = [...(availability[dateKey] || []), ...slots];
    saveAvailability(dateKey, updatedSlots);
    
    // Handle recurring appointments
    if (newSlot.isRecurring && newSlot.recurringDays.length > 0) {
      const selectedDateObj = new Date(selectedDate);
      for (let i = 1; i <= 8; i++) { // Next 8 weeks
        const futureDate = new Date(selectedDateObj);
        futureDate.setDate(futureDate.getDate() + (i * 7));
        const futureDateKey = futureDate.toISOString().split('T')[0];
        
        if (newSlot.recurringDays.includes(futureDate.getDay())) {
          const futureSlots = generateTimeSlots(newSlot.startTime, newSlot.endTime, newSlot.duration);
          saveAvailability(futureDateKey, [...(availability[futureDateKey] || []), ...futureSlots]);
        }
      }
    }
    
    setNewSlot({
      startTime: '',
      endTime: '',
      duration: 30,
      isRecurring: false,
      recurringDays: []
    });
    setIsAddingSlot(false);
  };

  const deleteSlot = (slotId) => {
    const dateKey = selectedDate;
    const updatedSlots = availability[dateKey].filter(slot => slot.id !== slotId);
    saveAvailability(dateKey, updatedSlots);
  };

  const toggleRecurringDay = (dayIndex) => {
    const updatedDays = newSlot.recurringDays.includes(dayIndex)
      ? newSlot.recurringDays.filter(d => d !== dayIndex)
      : [...newSlot.recurringDays, dayIndex];
    
    setNewSlot(prev => ({
      ...prev,
      recurringDays: updatedDays
    }));
  };

  const currentSlots = availability[selectedDate] || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-600" />
          Manage Availability
        </h2>
        <button
          onClick={() => setIsAddingSlot(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </button>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add Time Slot Form */}
      {isAddingSlot && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Time Slot</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <select
                value={newSlot.duration}
                onChange={(e) => setNewSlot(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </div>

          {/* Recurring Options */}
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newSlot.isRecurring}
                onChange={(e) => setNewSlot(prev => ({ ...prev, isRecurring: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Make this recurring</span>
            </label>
            
            {newSlot.isRecurring && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Select recurring days:</p>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => toggleRecurringDay(index + 1)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        newSlot.recurringDays.includes(index + 1)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setIsAddingSlot(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addTimeSlot}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Slot
            </button>
          </div>
        </div>
      )}

      {/* Current Slots */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Available Slots for {new Date(selectedDate).toLocaleDateString()}
        </h3>
        
        {currentSlots.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No time slots available for this date</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-lg border-2 ${
                  slot.isBooked 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-medium">{slot.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!slot.isBooked && (
                      <button
                        onClick={() => deleteSlot(slot.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Duration: {slot.duration} minutes
                </div>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    slot.isBooked 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityManager;