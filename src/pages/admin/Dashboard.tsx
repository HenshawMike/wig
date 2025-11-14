import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-card text-card-foreground border-r transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b h-16 flex items-center justify-between">
          <h1 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>Admin Panel</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-auto"
          >
            {isSidebarOpen ? '«' : '»'}
          </Button>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Dashboard</span>}
          </NavLink>
          
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`
            }
          >
            <Package className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Products</span>}
          </NavLink>
          
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`
            }
          >
            <Users className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Users</span>}
          </NavLink>
          
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`
            }
          >
            <Settings className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Settings</span>}
          </NavLink>
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
