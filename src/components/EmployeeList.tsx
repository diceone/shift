import React, { useState } from 'react';
import { User, Pencil, Trash2, X } from 'lucide-react';
import { Employee } from '../types';
import { AddEmployeeForm } from './AddEmployeeForm';

interface EmployeeListProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (id: string, employee: Omit<Employee, 'id'>) => void;
  onDeleteEmployee: (id: string) => void;
}

export function EmployeeList({
  employees,
  onSelectEmployee,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}: EmployeeListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="grid gap-4">
        {employees.map((employee) => (
          <div key={employee.id}>
            {editingId === employee.id ? (
              <EditEmployeeForm
                employee={employee}
                onSave={(updates) => {
                  onUpdateEmployee(employee.id, updates);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="group relative flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {employee.avatar ? (
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-black dark:text-white">{employee.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{employee.role}</p>
                  <div 
                    className="mt-2 w-6 h-6 rounded-full border-2 border-white dark:border-gray-600"
                    style={{ backgroundColor: employee.color }}
                    title="Employee color"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(employee.id)}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Edit employee"
                  >
                    <Pencil className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to remove this team member?')) {
                        onDeleteEmployee(employee.id);
                      }
                    }}
                    className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    aria-label="Delete employee"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <AddEmployeeForm onAdd={onAddEmployee} />
      </div>
    </div>
  );
}

interface EditEmployeeFormProps {
  employee: Employee;
  onSave: (updates: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
}

function EditEmployeeForm({ employee, onSave, onCancel }: EditEmployeeFormProps) {
  const [name, setName] = useState(employee.name);
  const [role, setRole] = useState(employee.role);
  const [avatar, setAvatar] = useState(employee.avatar);
  const [color, setColor] = useState(employee.color);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, role, avatar, color });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-black dark:text-white">Edit Team Member</h4>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Avatar URL
          </label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}