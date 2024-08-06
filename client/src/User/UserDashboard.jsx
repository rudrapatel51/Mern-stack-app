import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;  // Fixed template literal
      axios.get("http://localhost:3001/user")
        .then(response => {
          console.log('Response:', response.data);  // Debugging line
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            setError('User not authenticated');
            // console.log(setError);
            // navigate('/login');  // Redirect to login if not authenticated
          }
        })
        .catch(err => {
          setError('Error fetching user data');
          console.error(err);
        });
    } else {
      setError('No access token found');
      // navigate('/login');  // Redirect to login if no access token
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      // Optionally, clear any local state or context related to user authentication
      navigate('/login'); // Redirect to login page or any other appropriate route
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <div>
        {error ? (
          <div>
            <p className='text-center text-2xl font-semibold '>Please Login To access</p>
            <div className='text-black text-center font-bold p-5'>
              <a href='/register'>Register</a>
              <br />
              <a href='/login'>Login</a>
            </div>
          </div>
        ) : (
          user && (
            <div className='text-center'>
              <h1 className='p-5 font-bold text-4xl'>User Profile</h1>
              <p className='font-semibold text-xl py-2'>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <button className='text-black bg-red-600 ' onClick={handleLogout}>Logout</button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
