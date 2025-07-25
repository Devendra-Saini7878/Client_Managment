import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const navItems = [
  {
    label: "Add Data",
    path: "/add",
    icon: (
      <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: "Client",
    path: "/client",
    icon: (
      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" />
      </svg>
    ),
  },
  {
    label: "Channel",
    path: "/channel-summary",
    icon: (
      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M3 14h18M3 18h18" />
      </svg>
    ),
  },
  {
    label: "Payment History",
    path: "/payment-history",
    icon: (
      <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { email, setToken, setEmail } = useUserContext();

  const handleLogout = () => {
    setToken(null);
    setEmail('');
    navigate('/login');
  };

  return (
    <aside className="w-[16rem] min-w-[14rem] bg-gradient-to-b from-purple-50 via-white to-pink-50 shadow-2xl px-6 py-8 flex flex-col justify-between h-screen border-r border-purple-100 transition-all duration-300">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-purple-700 tracking-tight drop-shadow-sm">Dashboard</h2>
            <p className="text-xs text-gray-500 font-medium">Welcome!</p>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex items-center gap-2 bg-purple-100/60 rounded-lg px-3 py-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm text-purple-700 font-semibold break-all">{email}</span>
          </div>
        </div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className="flex items-center w-full text-left px-4 py-2 rounded-lg transition-all duration-150 font-medium text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:from-red-500 hover:to-pink-600 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
