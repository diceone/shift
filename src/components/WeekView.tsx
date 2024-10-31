import React, { useState } from 'react';
import { Employee, Shift, Tag } from '../types';
import { format, parseISO, isSameDay } from 'date-fns';
import { X } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  shifts: Shift[];
  employees: Employee[];
  tags: Tag[];
  onAddShift: (shift: Omit<Shift, 'id'>, existingShiftId?: string) => void;
  onDeleteShift: (id: string) => void;
}

interface ShiftCardProps {
  shift: Shift;
  employees: Employee[];
  tags: Tag[];
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

function ShiftCard({ shift, employees, tags, onClick, onDelete }: ShiftCardProps) {
  const employee = employees.find((e) => e.id === shift.employeeId);
  if (!employee) return null;

  const shiftTags = shift.tagIds?.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) || [];
  const shiftStart = parseISO(shift.start);
  const shiftEnd = parseISO(shift.end);
  const isOvernight = !isSameDay(shiftStart, shiftEnd);

  return (
    <div 
      className={`text-xs p-1 rounded flex items-center justify-between gap-1 group relative`}
      style={{ 
        backgroundColor: `${employee.color}20`,
        borderLeft: `3px solid ${employee.color}` 
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <img
          src={employee.avatar}
          alt={employee.name}
          className="w-4 h-4 rounded-full flex-shrink-0"
        />
        <span className="truncate">{employee.name}</span>
        {isOvernight && <span className="text-gray-500">↪</span>}
        {shiftTags.length > 0 && (
          <div className="flex gap-1">
            {shiftTags.map(tag => tag && (
              <span
                key={tag.id}
                className="px-1 rounded-full text-xs"
                style={{ backgroundColor: tag.color + '40', color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded"
      >
        ×
      </button>
    </div>
  );
}

interface QuickShiftModalProps {
  date: Date;
  hour: number;
  employees: Employee[];
  tags: Tag[];
  existingShift?: Shift;
  onClose: () => void;
  onSave: (employeeId: string, start: string, end: string, comment: string, tagIds: string[]) => void;
}

function QuickShiftModal({
  date,
  hour,
  employees,
  tags,
  existingShift,
  onClose,
  onSave,
}: QuickShiftModalProps) {
  const [employeeId, setEmployeeId] = useState(existingShift?.employeeId || employees[0]?.id || '');
  const [startTime, setStartTime] = useState(
    existingShift ? format(parseISO(existingShift.start), 'HH:mm') :
    `${hour.toString().padStart(2, '0')}:00`
  );
  const [endTime, setEndTime] = useState(
    existingShift ? format(parseISO(existingShift.end), 'HH:mm') :
    `${(hour + 1).toString().padStart(2, '0')}:00`
  );
  const [comment, setComment] = useState(existingShift?.comment || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(existingShift?.tagIds || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shiftDate = format(date, 'yyyy-MM-dd');
    
    let startDateTime = `${shiftDate}T${startTime}`;
    let endDateTime = `${shiftDate}T${endTime}`;
    
    // Handle overnight shifts
    if (endTime <= startTime) {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      endDateTime = `${format(nextDay, 'yyyy-MM-dd')}T${endTime}`;
    }
    
    onSave(
      employeeId,
      startDateTime,
      endDateTime,
      comment.trim(),
      selectedTagIds
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">
            {existingShift ? 'Edit Shift' : 'Add Shift'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employee
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Add any notes about this shift..."
            />
          </div>
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedTagIds((prev) =>
                        prev.includes(tag.id)
                          ? prev.filter((id) => id !== tag.id)
                          : [...prev, tag.id]
                      );
                    }}
                    className="px-2 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: selectedTagIds.includes(tag.id)
                        ? tag.color
                        : tag.color + '40',
                      color: selectedTagIds.includes(tag.id)
                        ? '#fff'
                        : tag.color,
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {existingShift ? 'Update' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export function WeekView({ 
  currentDate, 
  shifts, 
  employees,
  tags = [],
  onAddShift,
  onDeleteShift 
}: WeekViewProps) {
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    hour: number;
    existingShift?: Shift;
  } | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const getShiftsForDateAndHour = (date: Date, hour: number) => {
    return shifts.filter((shift) => {
      const shiftStart = parseISO(shift.start);
      const shiftEnd = parseISO(shift.end);

      // Handle overnight shifts
      if (!isSameDay(shiftStart, shiftEnd)) {
        if (isSameDay(date, shiftStart)) {
          return shiftStart.getHours() <= hour;
        }
        if (isSameDay(date, shiftEnd)) {
          return hour < shiftEnd.getHours();
        }
        return false;
      }

      // Regular shift within same day
      return (
        isSameDay(date, shiftStart) &&
        shiftStart.getHours() <= hour &&
        shiftEnd.getHours() > hour
      );
    });
  };

  const handleCellClick = (date: Date, hour: number) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(hour);
    setSelectedSlot({ date: selectedDate, hour });
    setShowShiftModal(true);
  };

  const handleShiftClick = (shift: Shift, date: Date, hour: number) => {
    const selectedDate = new Date(date);
    selectedDate.setHours(hour);
    setSelectedSlot({ date: selectedDate, hour, existingShift: shift });
    setShowShiftModal(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-px bg-gray-200 dark:bg-gray-700 min-w-[800px]">
          <div className="bg-white dark:bg-gray-800 w-20">
            <div className="h-12"></div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-12 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400"
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {days.map((date) => (
            <div key={date.toISOString()} className="bg-white dark:bg-gray-800 flex-1">
              <div className="h-12 p-2 border-b border-gray-100 dark:border-gray-700 text-center">
                <div className="font-medium text-black dark:text-white">
                  {format(date, 'EEE')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {format(date, 'd')}
                </div>
              </div>
              {hours.map((hour) => {
                const shiftsInHour = getShiftsForDateAndHour(date, hour);
                return (
                  <div
                    key={hour}
                    onClick={() => handleCellClick(date, hour)}
                    className="h-12 border-b border-gray-100 dark:border-gray-700 p-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 relative group"
                  >
                    <div className="flex flex-col gap-1">
                      {shiftsInHour.map((shift) => (
                        <ShiftCard 
                          key={shift.id} 
                          shift={shift} 
                          employees={employees}
                          tags={tags}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShiftClick(shift, date, hour);
                          }}
                          onDelete={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this shift?')) {
                              onDeleteShift(shift.id);
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {showShiftModal && selectedSlot && (
        <QuickShiftModal
          date={selectedSlot.date}
          hour={selectedSlot.hour}
          employees={employees}
          tags={tags}
          existingShift={selectedSlot.existingShift}
          onClose={() => {
            setShowShiftModal(false);
            setSelectedSlot(null);
          }}
          onSave={(employeeId, start, end, comment, tagIds) => {
            onAddShift({
              employeeId,
              type: 'custom',
              start,
              end,
              comment,
              tagIds,
            }, selectedSlot.existingShift?.id);
            setShowShiftModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </>
  );
}