import React from 'react';
import { Clock } from 'lucide-react';
import { Employee, Shift } from '../types';
import { differenceInHours, differenceInMinutes } from 'date-fns';

interface WorkHoursSummaryProps {
  employees: Employee[];
  shifts: Shift[];
  currentDate: Date;
}

export function WorkHoursSummary({ employees, shifts, currentDate }: WorkHoursSummaryProps) {
  const calculateMonthlyHours = (employeeId: string) => {
    const monthShifts = shifts.filter((shift) => {
      const shiftDate = new Date(shift.start);
      return (
        shiftDate.getMonth() === currentDate.getMonth() &&
        shiftDate.getFullYear() === currentDate.getFullYear() &&
        shift.employeeId === employeeId
      );
    });

    return monthShifts.reduce((total, shift) => {
      const startTime = new Date(shift.start);
      const endTime = new Date(shift.end);
      
      // Calculate the exact difference in minutes, then convert to hours
      const diffInMinutes = differenceInMinutes(endTime, startTime);
      const hours = diffInMinutes / 60;
      
      return total + hours;
    }, 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black dark:text-white">
        <Clock className="w-5 h-5" />
        Monthly Work Hours
      </h2>
      <div className="space-y-4">
        {employees.map((employee) => {
          const hours = calculateMonthlyHours(employee.id);
          return (
            <div
              key={employee.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center gap-3">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-black dark:text-white">{employee.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{employee.role}</p>
                </div>
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {hours.toFixed(1)}h
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}