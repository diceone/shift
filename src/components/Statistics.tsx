import React, { useMemo } from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { Employee, Shift, Tag } from '../types';
import { Clock, Calendar, Users, Download, Tag as TagIcon } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { StatisticsPDF } from './StatisticsPDF';

interface StatisticsProps {
  employees: Employee[];
  shifts: Shift[];
  tags: Tag[];
}

export function Statistics({ employees, shifts, tags }: StatisticsProps) {
  const yearlyStats = useMemo(() => {
    const stats = new Map<string, { total: number; months: { [key: string]: number } }>();
    const currentYear = new Date().getFullYear();
    const yearStart = startOfYear(new Date());
    const yearEnd = endOfYear(new Date());
    
    employees.forEach(employee => {
      stats.set(employee.id, { total: 0, months: {} });
      eachMonthOfInterval({ start: yearStart, end: yearEnd }).forEach(date => {
        const monthKey = format(date, 'yyyy-MM');
        stats.get(employee.id)!.months[monthKey] = 0;
      });
    });

    shifts.forEach(shift => {
      const startTime = new Date(shift.start);
      const endTime = new Date(shift.end);
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const monthKey = format(startTime, 'yyyy-MM');
      
      if (startTime.getFullYear() === currentYear) {
        const employeeStats = stats.get(shift.employeeId);
        if (employeeStats) {
          employeeStats.total += hours;
          employeeStats.months[monthKey] = (employeeStats.months[monthKey] || 0) + hours;
        }
      }
    });

    return stats;
  }, [employees, shifts]);

  const tagStats = useMemo(() => {
    const stats = new Map<string, number>();
    
    tags.forEach(tag => {
      stats.set(tag.id, 0);
    });

    shifts.forEach(shift => {
      if (!shift.tags?.length) return;
      
      const startTime = new Date(shift.start);
      const endTime = new Date(shift.end);
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      shift.tags.forEach(tagId => {
        stats.set(tagId, (stats.get(tagId) || 0) + hours);
      });
    });

    return stats;
  }, [shifts, tags]);

  const totalYearlyHours = useMemo(() => {
    return Array.from(yearlyStats.values()).reduce((sum, stats) => sum + stats.total, 0);
  }, [yearlyStats]);

  const currentMonthKey = format(new Date(), 'yyyy-MM');
  const totalMonthlyHours = useMemo(() => {
    return Array.from(yearlyStats.values()).reduce(
      (sum, stats) => sum + (stats.months[currentMonthKey] || 0),
      0
    );
  }, [yearlyStats, currentMonthKey]);

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <PDFDownloadLink
          document={<StatisticsPDF employees={employees} shifts={shifts} tags={tags} />}
          fileName={`statistics-${format(new Date(), 'yyyy-MM-dd')}.pdf`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {({ loading }) => (
            <>
              <Download className="w-5 h-5" />
              {loading ? 'Generating PDF...' : 'Export as PDF'}
            </>
          )}
        </PDFDownloadLink>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-black dark:text-white">Team Size</h3>
          </div>
          <p className="text-3xl font-bold text-black dark:text-white">{employees.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-black dark:text-white">Monthly Hours</h3>
          </div>
          <p className="text-3xl font-bold text-black dark:text-white">
            {totalMonthlyHours.toFixed(1)}h
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-black dark:text-white">Yearly Hours</h3>
          </div>
          <p className="text-3xl font-bold text-black dark:text-white">
            {totalYearlyHours.toFixed(1)}h
          </p>
        </div>
      </div>

      {/* Tag Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <TagIcon className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Hours by Tag
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {tags.map(tag => (
            <div
              key={tag.id}
              className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4"
              style={{ borderLeftColor: tag.color }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{tag.name}</p>
              <p className="text-2xl font-semibold text-black dark:text-white">
                {(tagStats.get(tag.id) || 0).toFixed(1)}h
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 text-black dark:text-white">
          Monthly Hours by Team Member
        </h3>
        <div className="space-y-6">
          {employees.map(employee => {
            const stats = yearlyStats.get(employee.id);
            if (!stats) return null;

            return (
              <div key={employee.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-black dark:text-white">{employee.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{employee.role}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {stats.total.toFixed(1)}h
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(stats.months).map(([month, hours]) => (
                    <div
                      key={month}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(month), 'MMM yyyy')}
                      </p>
                      <p className="text-lg font-medium text-black dark:text-white">
                        {hours.toFixed(1)}h
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}