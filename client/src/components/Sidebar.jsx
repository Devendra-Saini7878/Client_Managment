import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';


export default function Sidebar() {
  const navigate = useNavigate();
  const { email, setToken, setEmail } = useUserContext(); // ✅ from your context

  const handleLogout = () => {
    setToken(null);
    setEmail('');
    navigate('/login');
  };
  
  return (
    <div className="w-1/7 bg-white shadow-lg p-4 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-xl font-bold mb-2">Dashboard</h2>
        <p className="text-sm text-gray-600 mb-4 break-words">{email}</p>

        <ul className="space-y-3">
          <li>
            <button onClick={() => navigate('/add')} className="w-full text-left hover:bg-gray-200 p-2 rounded">
              Add Data
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/client')} className="w-full text-left hover:bg-gray-200 p-2 rounded">
              Client
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/channel-summary')} className="w-full text-left hover:bg-gray-200 p-2 rounded">
              Channel
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/payment-history')} className="w-full text-left hover:bg-gray-200 p-2 rounded">
              Payment History
            </button>
          </li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-400 to-pink-500  text-white mt-6 px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
