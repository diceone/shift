import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Employee, Shift, Tag } from '../types';

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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 8,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
  },
  tag: {
    padding: 4,
    marginBottom: 4,
    borderRadius: 2,
  },
});

interface StatisticsPDFProps {
  employees: Employee[];
  shifts: Shift[];
  tags: Tag[];
}

export function StatisticsPDF({ employees, shifts, tags }: StatisticsPDFProps) {
  // Calculate total hours per employee
  const employeeHours = employees.reduce((acc, employee) => {
    const employeeShifts = shifts.filter(shift => shift.employeeId === employee.id);
    const totalHours = employeeShifts.reduce((sum, shift) => {
      const start = new Date(shift.start);
      const end = new Date(shift.end);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
    return { ...acc, [employee.id]: totalHours };
  }, {} as Record<string, number>);

  // Calculate hours per tag
  const tagHours = tags.reduce((acc, tag) => {
    const taggedShifts = shifts.filter(shift => shift.tags?.includes(tag.id));
    const totalHours = taggedShifts.reduce((sum, shift) => {
      const start = new Date(shift.start);
      const end = new Date(shift.end);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
    return { ...acc, [tag.id]: totalHours };
  }, {} as Record<string, number>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>
          Work Hours Statistics - {format(new Date(), 'MMMM yyyy')}
        </Text>

        {/* Employee Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee Hours</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Employee</Text>
              <Text style={styles.tableCell}>Role</Text>
              <Text style={styles.tableCell}>Total Hours</Text>
            </View>
            {employees.map(employee => (
              <View key={employee.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{employee.name}</Text>
                <Text style={styles.tableCell}>{employee.role}</Text>
                <Text style={styles.tableCell}>
                  {employeeHours[employee.id].toFixed(1)}h
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tag Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hours by Tag</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Tag</Text>
              <Text style={styles.tableCell}>Total Hours</Text>
            </View>
            {tags.map(tag => (
              <View key={tag.id} style={styles.tableRow}>
                <Text style={styles.tableCell}>{tag.name}</Text>
                <Text style={styles.tableCell}>
                  {tagHours[tag.id].toFixed(1)}h
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}