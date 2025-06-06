'use client';

import { useState } from 'react';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ModifiedCalendarWidgetProps {
  availableTimes: string[];
  onTimeSelected: (time: string, date: Date) => void;
  onClose: () => void;
}

export function ModifiedCalendarWidget({ availableTimes, onTimeSelected, onClose }: ModifiedCalendarWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
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
  
  // Check if a date is available (mock implementation)
  const isDateAvailable = (date: Date) => {
    // In a real app, this would check against backend data
    // For now, let's say weekends are not available
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleTimeClick = (time: string) => {
    if (selectedDate) {
      onTimeSelected(time, selectedDate);
    }
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
      {!selectedDate ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Select a Date
            </h3>
            <div className="flex space-x-2">
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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <button
                onClick={() => setSelectedDate(null)}
                className="mr-2 p-1 rounded-md hover:bg-gray-100"
              >
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-lg font-medium text-gray-900">
                Select a Time
              </h3>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-1" />
              <span className="text-sm font-medium">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
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
      )}
    </div>
  );
}