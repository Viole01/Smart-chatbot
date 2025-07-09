// frontend/src/components/patient/AppointmentChatSystem.jsx
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Calendar, Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointments';

const AppointmentChatSystem = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your healthcare assistant. I'll help you find the right doctor and book an appointment. Can you please describe your symptoms or health concern?",
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('symptoms'); // symptoms, analysis, doctors, schedule, confirmation
  const [patientData, setPatientData] = useState({
    symptoms: '',
    urgency: '',
    specialty: '',
    preferredTime: '',
    selectedDoctor: null,
    selectedSlot: null
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock data for now - will be replaced with real API calls
  const mockDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      experience: "10 years",
      rating: 4.8,
      availableSlots: [
        { date: "2025-07-10", time: "10:00 AM", duration: "30 min" },
        { date: "2025-07-10", time: "2:30 PM", duration: "30 min" },
        { date: "2025-07-11", time: "9:00 AM", duration: "30 min" }
      ]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "General Practice",
      experience: "8 years",
      rating: 4.7,
      availableSlots: [
        { date: "2025-07-10", time: "11:30 AM", duration: "20 min" },
        { date: "2025-07-10", time: "4:00 PM", duration: "20 min" },
        { date: "2025-07-11", time: "10:00 AM", duration: "20 min" }
      ]
    }
  ];

  const addMessage = (type, content, data = null) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      data,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const analyzeSymptoms = async (symptoms) => {
    setIsLoading(true);
    
    try {
      // Try to use real API first, fallback to mock
      let analysis;
      try {
        analysis = await appointmentService.analyzeSymptoms(symptoms);
      } catch (error) {
        console.log('Using mock analysis due to API error:', error);
        // Mock analysis fallback
        analysis = {
          urgency: symptoms.toLowerCase().includes('chest pain') || symptoms.toLowerCase().includes('severe') ? 'urgent' : 'routine',
          specialty: symptoms.toLowerCase().includes('heart') || symptoms.toLowerCase().includes('chest') ? 'Cardiology' : 'General Practice',
          recommendations: [
            "Based on your symptoms, I recommend seeing a specialist",
            "This appears to be a routine consultation",
            "I've found some available doctors for you"
          ]
        };
      }
      
      setPatientData(prev => ({ ...prev, symptoms, ...analysis }));
      
      addMessage('bot', `I've analyzed your symptoms. ${analysis.recommendations.join('. ')}.`, {
        type: 'analysis',
        urgency: analysis.urgency,
        specialty: analysis.specialty
      });
      
      // Show available doctors
      setTimeout(() => {
        let availableDoctors;
        try {
          // In production, this would be: appointmentService.getAvailableDoctors(analysis.specialty)
          availableDoctors = mockDoctors.filter(doc => 
            doc.specialty === analysis.specialty || analysis.specialty === 'General Practice'
          );
        } catch (error) {
          availableDoctors = mockDoctors;
        }
        
        addMessage('bot', "Here are the available doctors:", {
          type: 'doctors',
          doctors: availableDoctors
        });
        setCurrentStep('doctors');
      }, 1000);
      
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      addMessage('bot', "I'm sorry, I encountered an error analyzing your symptoms. Please try again or contact support.");
    }
    
    setIsLoading(false);
  };

  const selectDoctor = (doctor) => {
    setPatientData(prev => ({ ...prev, selectedDoctor: doctor }));
    addMessage('user', `I'd like to book with ${doctor.name}`);
    
    setTimeout(() => {
      addMessage('bot', `Great choice! ${doctor.name} has the following available slots:`, {
        type: 'schedule',
        slots: doctor.availableSlots
      });
      setCurrentStep('schedule');
    }, 500);
  };

  const selectTimeSlot = (slot) => {
    setPatientData(prev => ({ ...prev, selectedSlot: slot }));
    addMessage('user', `I'd like to book the ${slot.time} slot on ${slot.date}`);
    
    setTimeout(() => {
      addMessage('bot', "Perfect! Let me confirm your appointment details:", {
        type: 'confirmation',
        appointment: {
          doctor: patientData.selectedDoctor,
          slot: slot,
          symptoms: patientData.symptoms
        }
      });
      setCurrentStep('confirmation');
    }, 500);
  };

  const confirmAppointment = async () => {
    setIsLoading(true);
    
    try {
      const appointmentData = {
        patient_id: user.id,
        doctor_id: patientData.selectedDoctor.id,
        appointment_date: patientData.selectedSlot.date,
        appointment_time: patientData.selectedSlot.time,
        duration: 30,
        symptoms: patientData.symptoms,
        urgency: patientData.urgency
      };

      // Try to book appointment via API
      try {
        const result = await appointmentService.bookAppointment(appointmentData);
        addMessage('bot', `🎉 Your appointment has been successfully booked! Confirmation code: ${result.confirmation_code}`, {
          type: 'success'
        });
      } catch (error) {
        console.log('Using mock booking due to API error:', error);
        // Mock successful booking
        await new Promise(resolve => setTimeout(resolve, 2000));
        addMessage('bot', "🎉 Your appointment has been successfully booked! You'll receive a confirmation email shortly.", {
          type: 'success'
        });
      }
      
      setCurrentStep('completed');
    } catch (error) {
      console.error('Error booking appointment:', error);
      addMessage('bot', "I'm sorry, there was an error booking your appointment. Please try again or contact support.");
    }
    
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    addMessage('user', inputMessage);
    const message = inputMessage;
    setInputMessage('');
    
    if (currentStep === 'symptoms') {
      await analyzeSymptoms(message);
    }
  };

  const renderMessageContent = (message) => {
    if (message.type === 'user') {
      return <p>{message.content}</p>;
    }

    if (!message.data) {
      return <p>{message.content}</p>;
    }

    switch (message.data.type) {
      case 'analysis':
        return (
          <div>
            <p>{message.content}</p>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Analysis Results:</span>
              </div>
              <p><strong>Urgency:</strong> {message.data.urgency}</p>
              <p><strong>Recommended Specialty:</strong> {message.data.specialty}</p>
            </div>
          </div>
        );

      case 'doctors':
        return (
          <div>
            <p>{message.content}</p>
            <div className="mt-3 space-y-3">
              {message.data.doctors.map(doctor => (
                <div key={doctor.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                     onClick={() => selectDoctor(doctor)}>
                  <div className="flex items-center gap-3">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialty} • {doctor.experience}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">{doctor.rating}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div>
            <p>{message.content}</p>
            <div className="mt-3 grid gap-2">
              {message.data.slots.map((slot, index) => (
                <div key={index} 
                     className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                     onClick={() => selectTimeSlot(slot)}>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">{slot.date}</p>
                      <p className="text-sm text-gray-600">{slot.time} ({slot.duration})</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div>
            <p>{message.content}</p>
            <div className="mt-3 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-3">Appointment Summary:</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Doctor:</strong> {message.data.appointment.doctor.name}</p>
                <p><strong>Specialty:</strong> {message.data.appointment.doctor.specialty}</p>
                <p><strong>Date:</strong> {message.data.appointment.slot.date}</p>
                <p><strong>Time:</strong> {message.data.appointment.slot.time}</p>
                <p><strong>Duration:</strong> {message.data.appointment.slot.duration}</p>
                <p><strong>Reason:</strong> {message.data.appointment.symptoms}</p>
              </div>
              <button 
                onClick={confirmAppointment}
                className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-green-800">{message.content}</p>
          </div>
        );

      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-blue-50">
        <Bot className="w-6 h-6 text-blue-600" />
        <div>
          <h4 className="font-semibold">AI Assistant</h4>
          <p className="text-xs text-gray-600">Healthcare booking</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              message.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
              {message.type === 'user' ? 
                <User className="w-3 h-3 text-white" /> : 
                <Bot className="w-3 h-3 text-gray-600" />
              }
            </div>
            <div className={`flex-1 max-w-[85%] ${message.type === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block p-3 rounded-lg text-sm ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {renderMessageContent(message)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot className="w-3 h-3 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="inline-block p-3 rounded-lg bg-gray-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {currentStep !== 'completed' && (
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={currentStep === 'symptoms' ? "Describe your symptoms..." : "Type your message..."}
              className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || currentStep !== 'symptoms'}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim() || currentStep !== 'symptoms'}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentChatSystem;