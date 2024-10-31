import React from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Shift, CalendarView, Employee, Tag } from '../types';
import { WeekView } from './WeekView';
import { startOfWeek, format, parseISO, isSameDay } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFCalendar } from './PDFCalendar';

interface CalendarProps {
  shifts: Shift[];
  view: CalendarView;
  currentDate: Date;
  employees: Employee[];
  tags: Tag[];
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onAddShift: (shift: Omit<Shift, 'id'>, existingShiftId?: string) => void;
  onDeleteShift: (shiftId: string) => void;
}

export function Calendar({
  shifts,
  view,
  currentDate,
  employees,
  tags,
  onDateChange,
  onViewChange,
  onAddShift,
  onDeleteShift,
}: CalendarProps) {
  const handleDayClick = (date: Date) => {
    onDateChange(date);
    onViewChange('week');
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => view === 'week' ? navigateWeek('prev') : onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-black dark:text-white">
          {view === 'week'
            ? `Week of ${startOfWeek(currentDate).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}`
            : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => view === 'week' ? navigateWeek('next') : onDateChange(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onViewChange('month')}
          className={`px-4 py-2 rounded-lg ${
            view === 'month' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onViewChange('week')}
          className={`px-4 py-2 rounded-lg ${
            view === 'week' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          Week
        </button>
        <PDFDownloadLink
          document={<PDFCalendar currentDate={currentDate} shifts={shifts} employees={employees} />}
          fileName={`calendar-${currentDate.toISOString().split('T')[0]}.pdf`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          {({ loading }) => (
            <>
              <Download className="w-5 h-5" />
              {loading ? 'Generating PDF...' : 'Export PDF'}
            </>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange(newDate);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {renderHeader()}
      {view === 'week' ? (
        <WeekView
          currentDate={currentDate}
          shifts={shifts}
          employees={employees}
          onAddShift={onAddShift}
          onDeleteShift={onDeleteShift}
          tags={tags}
        />
      ) : (
        <MonthView
          currentDate={currentDate}
          shifts={shifts}
          employees={employees}
          tags={tags}
          onDayClick={handleDayClick}
        />
      )}
    </div>
  );
}

interface MonthViewProps {
  currentDate: Date;
  shifts: Shift[];
  employees: Employee[];
  tags: Tag[];
  onDayClick: (date: Date) => void;
}

function MonthView({
  currentDate,
  shifts,
  employees,
  tags,
  onDayClick,
}: MonthViewProps) {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const weeks = Math.ceil((daysInMonth + firstDayOfMonth) / 7);

  const getShiftDisplayInfo = (shift: Shift) => {
    const employee = employees.find((e) => e.id === shift.employeeId);
    const shiftTags = tags.filter(tag => shift.tagIds?.includes(tag.id));
    const start = parseISO(shift.start);
    const end = parseISO(shift.end);
    const isOvernight = !isSameDay(start, end);

    return {
      employee,
      shiftTags,
      isOvernight,
      startTime: format(start, 'HH:mm'),
      endTime: format(end, 'HH:mm')
    };
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-white dark:bg-gray-800 p-4 text-center text-sm font-semibold text-black dark:text-white"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {Array.from({ length: weeks * 7 }).map((_, index) => {
          const dayNumber = index - firstDayOfMonth + 1;
          const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
          const dayShifts = shifts.filter((shift) => {
            const shiftDate = parseISO(shift.start);
            return (
              shiftDate.getDate() === dayNumber &&
              shiftDate.getMonth() === currentDate.getMonth() &&
              shiftDate.getFullYear() === currentDate.getFullYear()
            );
          });

          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && onDayClick(date)}
              className={`min-h-[120px] bg-white dark:bg-gray-800 p-2 ${
                isCurrentMonth ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900'
              }`}
            >
              {isCurrentMonth && (
                <>
                  <div className="font-medium text-sm mb-2 text-black dark:text-white">
                    {dayNumber}
                  </div>
                  <div className="space-y-1">
                    {dayShifts.map((shift) => {
                      const { employee, shiftTags, isOvernight, startTime, endTime } = getShiftDisplayInfo(shift);
                      if (!employee) return null;

                      return (
                        <div
                          key={shift.id}
                          className="flex items-center gap-2 p-1 rounded bg-gray-50 dark:bg-gray-700 group hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                                {employee.name}
                              </span>
                              {isOvernight && (
                                <span className="text-xs text-amber-600 dark:text-amber-400">↪</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {startTime} - {endTime}
                            </div>
                          </div>
                          {shiftTags.length > 0 && (
                            <div className="flex gap-1">
                              {shiftTags.map(tag => (
                                <span
                                  key={tag.id}
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: tag.color }}
                                  title={tag.name}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}