import { Link, useNavigate, useLocation } from 'react-router-dom';

function DashboardIcon({ active }) {
  const color = active ? 'white' : '#9ca3af';
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
      <rect x="10" y="1" width="7" height="4" rx="1.5" stroke={color} strokeWidth="1.6" />
      <rect x="10" y="7" width="7" height="10" rx="1.5" stroke={color} strokeWidth="1.6" />
      <rect x="1" y="10" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

function MedicineIcon({ active }) {
  const color = active ? 'white' : '#9ca3af';
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="6" width="16" height="9" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M1 9h16" stroke={color} strokeWidth="1.6" />
      <path d="M6 1v5M12 1v5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 1H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 13l4-4-4-4M16 9H6" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded ${
      location.pathname === path ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-slate-700'
    }`;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-800 flex flex-col">
        <div className="flex items-center gap-2 p-5 text-white font-bold text-lg">
          <img src="https://fadj-ma-api.onrender.com/images/logo-fadjma.png" alt="Fadj-Ma" className="w-8 h-8" />
          Fadj-Ma
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-y border-slate-700">
          <div className="w-9 h-9 rounded-full bg-slate-500 flex items-center justify-center text-white text-sm">
            KC
          </div>
          <div>
            <p className="text-white text-sm font-medium">Kaka Correa </p>
            <p className="text-teal-400 text-xs">Administrateur</p>
          </div>
        </div>

        <nav className="flex-1 px-3 pt-3 space-y-1">
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            <DashboardIcon active={location.pathname === '/dashboard'} /> Tableau de bord
          </Link>
          <Link to="/medicines" className={linkClass('/medicines')}>
            <MedicineIcon active={location.pathname === '/medicines'} /> Medicaments
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-4 text-gray-300 hover:bg-slate-700 border-t border-slate-700"
        >
          <LogoutIcon /> Deconnexion
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Recherchez n'importe quoi ici."
            className="border rounded px-4 py-2 w-96"
          />
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Francais (France)</span>
            <span>☀️ Bonjour</span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}