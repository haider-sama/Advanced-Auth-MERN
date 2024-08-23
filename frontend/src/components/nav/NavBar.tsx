import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from "../../context/AppContext";
import { useState } from 'react';
import * as authAPI from '../../api/auth';

const Navbar = () => {
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
    <nav className="mx-32 my-8 border-2 border-black p-4 flex justify-between items-center bg-white">
      <div className="flex items-center">
        <Link to="/" className="ml-2 text-2xl font-bold">myProfile</Link>
      </div>

      {isLoggedIn ? (
        <div className="flex space-x-4">
        <Link to="/account"
        className="text-gray-800 hover:bg-gray-200 focus:ring-4 
        focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 
        mr-2 focus:outline-none ">Account</Link>
        <button onClick={handleLogout}
        className="text-gray-800 bg-gray-200 focus:ring-4 
        focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 
        mr-2 focus:outline-none ">Log out</button>
        {error && <p className="text-red-500">{error}</p>}
  </div>
      ) : (
        <div className="flex space-x-4">
        <Link to="/login"
        className="text-gray-800 hover:bg-gray-200 focus:ring-4 
        focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 
        mr-2 focus:outline-none ">Login</Link>
        <Link to="/register"
        className="text-gray-800 hover:bg-gray-200 focus:ring-4 
        focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 
        mr-2 focus:outline-none ">Register</Link>
        </div>
      )}
    </nav>
  
  );
};

export default Navbar;
