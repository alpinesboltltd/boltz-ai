'use client';

import { useState } from 'react';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface AppointmentBookingProps {
  availableDates: Date[];
  onDateSelected: (date: Date) => void;
  onTimeSelected: (time: string, date: Date) => void;
  onAppointmentConfirmed: (appointmentDetails: AppointmentDetails) => void;
}

export interface AppointmentDetails {
  date: Date;
  time: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export function AppointmentBooking({ 
  availableDates, 
  onDateSelected, 
  onTimeSelected,
  onAppointmentConfirmed
}: AppointmentBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Generate dates for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Create calendar days array
  const days = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  
  // Check if a date is available
  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.getDate() === date.getDate() &&
      availableDate.getMonth() === date.getMonth() &&
      availableDate.getFullYear() === date.getFullYear()
    );
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelected(date);
  };
  
  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onTimeSelected(time, selectedDate);
    }
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime && name && email) {
      onAppointmentConfirmed({
        date: selectedDate,
        time: selectedTime,
        name,
        email,
        phone,
        notes
      });
    }
  };
  
  // Mock available times for the selected date
  const getAvailableTimes = () => {
    return ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Book an Appointment
      </h3>
      
      {!selectedDate ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={prevMonth}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-sm font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button 
              onClick={nextMonth}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <div key={index} className="aspect-square">
                {date && isDateAvailable(date) ? (
                  <button
                    onClick={() => handleDateClick(date)}
                    className={`w-full h-full flex items-center justify-center text-sm rounded-md
                      ${isToday(date) ? 'bg-primary-100 font-bold' : 'font-bold hover:bg-primary-50'}`}
                  >
                    {date.getDate()}
                    {isToday(date) && <span className="absolute -mt-5 text-xs text-primary-600">•</span>}
                  </button>
                ) : date ? (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-300">
                    {date.getDate()}
                  </div>
                ) : (
                  <div className="w-full h-full"></div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : !selectedTime ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedDate(null)}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Calendar
            </button>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-1" />
              <span className="text-sm font-medium">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Select a Time
          </h4>
          
          <div className="grid grid-cols-3 gap-2">
            {getAvailableTimes().map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className="px-3 py-2 text-sm font-medium rounded-md bg-gray-50 border border-gray-200 text-gray-700 hover:bg-primary-50 hover:border-primary-300 flex items-center justify-center"
              >
                <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                {time}
              </button>
            ))}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-1" />
              <span className="text-sm font-medium">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
              <span className="text-sm font-medium">{selectedTime}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Any additional information..."
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      )}
    </div>
  );
}