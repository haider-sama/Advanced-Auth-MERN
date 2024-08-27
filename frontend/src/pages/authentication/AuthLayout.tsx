import { Link, useNavigate  } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useState } from 'react';
import * as authAPI from '../../api/auth';


interface Props {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  const { isLoggedIn, setIsLoggedIn } = useAppContext();
  const [error, setError] = useState<string>('');
  const navigate = useNavigate(); // For navigation after logout

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn(false); // Update context state
      navigate('/login'); // Redirect to login page after logout
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
        <nav className="flex justify-between items-center bg-black w-full p-4">
        <Link to="/">
            <div className="px-8 font-semibold text-white text-xl">
                Decon
                <span className="text-yellow-400">Eats</span>
            </div>
        </Link>

        {isLoggedIn ? (
        <div className="flex space-x-4">
          <Link to="/account"
          className="text-white hover:bg-gray-200 focus:ring-4 hover:text-gray-600
        focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 
          mr-2 focus:outline-none ">Account</Link>
        <button onClick={handleLogout}
        className="text-gray-600 bg-gray-200 focus:ring-4 hover:text-gray-600
        focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 
        mr-2 focus:outline-none ">Log out</button>
        {error && <p className="text-red-500">{error}</p>}
  </div>
      ) : (
        <div className="flex space-x-4">
        <Link to="/login"
        className="text-white hover:bg-gray-200 focus:ring-4 hover:text-gray-600
        focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 
        mr-2 focus:outline-none ">Login</Link>
        <Link to="/register"
        className="text-white hover:bg-gray-200 focus:ring-4 hover:text-gray-600 
        focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 
        mr-2 focus:outline-none ">Register</Link>
        </div>
      )}
        </nav>
        <div className="mx-auto flex-1">{children}</div>
    </div>
  );
};

export default AuthLayout;
