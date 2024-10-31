import { useState, useEffect } from 'react';

export function useServerStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // Load initial data
  useEffect(() => {
    fetch(`/api/storage/${key}`)
      .then(res => res.json())
      .then(data => setValue(data))
      .catch(error => {
        console.error('Error loading data:', error);
        setValue(initialValue);
      });
  }, [key]);

  // Update server data when value changes
  const updateValue = async (newValue: T | ((prev: T) => T)) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    
    try {
      await fetch(`/api/storage/${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(valueToStore),
      });
      setValue(valueToStore);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return [value, updateValue] as const;
}