import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { format, parseISO, isSameDay } from 'date-fns';
import { Employee, Shift } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1pt solid #ccc',
    borderLeft: '1pt solid #ccc',
  },
  timeColumn: {
    width: 60,
    borderRight: '1pt solid #ccc',
  },
  dayColumn: {
    flex: 1,
    borderRight: '1pt solid #ccc',
  },
  cell: {
    padding: 5,
    borderBottom: '1pt solid #ccc',
    minHeight: 30,
    fontSize: 8,
  },
  dayHeader: {
    padding: 8,
    borderBottom: '1pt solid #ccc',
    backgroundColor: '#f3f4f6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeCell: {
    padding: 5,
    borderBottom: '1pt solid #ccc',
    fontSize: 8,
    textAlign: 'center',
  },
  shiftCell: {
    marginBottom: 2,
    padding: 2,
    borderRadius: 2,
  },
});

interface PDFCalendarProps {
  currentDate: Date;
  shifts: Shift[];
  employees: Employee[];
}

export function PDFCalendar({ currentDate, shifts, employees }: PDFCalendarProps) {
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - currentDate.getDay());
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>
          Week of {format(startDate, 'MMMM d, yyyy')}
        </Text>
        <View style={styles.grid}>
          <View style={styles.timeColumn}>
            <View style={styles.dayHeader}>
              <Text>Time</Text>
            </View>
            {hours.map((hour) => (
              <View key={hour} style={styles.timeCell}>
                <Text>{hour.toString().padStart(2, '0')}:00</Text>
              </View>
            ))}
          </View>
          {days.map((date) => (
            <View key={date.toISOString()} style={styles.dayColumn}>
              <View style={styles.dayHeader}>
                <Text>
                  {format(date, 'EEE')}\n{format(date, 'd')}
                </Text>
              </View>
              {hours.map((hour) => {
                const shiftsInHour = getShiftsForDateAndHour(date, hour);
                return (
                  <View key={hour} style={styles.cell}>
                    {shiftsInHour.map((shift) => {
                      const employee = employees.find(
                        (e) => e.id === shift.employeeId
                      );
                      if (!employee) return null;

                      const shiftStart = parseISO(shift.start);
                      const shiftEnd = parseISO(shift.end);
                      const isOvernight = !isSameDay(shiftStart, shiftEnd);

                      return (
                        <View
                          key={shift.id}
                          style={[
                            styles.shiftCell,
                            {
                              backgroundColor: `${employee.color}40`,
                              borderLeft: `2pt solid ${employee.color}`,
                            },
                          ]}
                        >
                          <Text>
                            {employee.name}
                            {isOvernight ? ' ↪' : ''}
                          </Text>
                          <Text style={{ fontSize: 6, color: '#666' }}>
                            {format(shiftStart, 'HH:mm')} - {format(shiftEnd, 'HH:mm')}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}