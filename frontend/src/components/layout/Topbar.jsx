import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

const Topbar = () => {
  const { user, logout } = useAuth(); // Destructure 'user' from the context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-6"> {/* Increased gap for better spacing */}
          
          {/* Display Welcome message if user data is available */}
          {user && user.name && (
            <span className="text-slate-300 font-medium">
              Welcome, {user.name}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          {/* The user avatar/initials circle is removed as per the new design. */}
          {/* If you want to keep it, you can place it here. */}
        </div>
      </div>
    </header>
  );
};

export default Topbar;