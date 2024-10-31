// Replace useLocalStorage with useServerStorage
import { useServerStorage } from './hooks/useServerStorage';
// ... rest of imports remain the same

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'roster' | 'team' | 'admin' | 'stats'>('roster');
  
  // Use server storage instead of localStorage
  const [adminSettings, setAdminSettings] = useServerStorage<AdminSettingsType>('adminSettings', {
    username: 'admin',
    password: 'admin',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    companyName: 'TimeShifter Inc.'
  });

  const [employees, setEmployees] = useServerStorage<Employee[]>('employees', [
    {
      id: '1',
      name: 'John Doe',
      role: 'Manager',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      color: '#3b82f6'
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Team Lead',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      color: '#10b981'
    }
  ]);

  const [shifts, setShifts] = useServerStorage<Shift[]>('shifts', []);
  const [tags, setTags] = useServerStorage<Tag[]>('tags', [
    { id: '1', name: 'Training', color: '#3b82f6' },
    { id: '2', name: 'Meeting', color: '#10b981' },
    { id: '3', name: 'Overtime', color: '#ef4444' }
  ]);

  // Rest of the component remains the same
}