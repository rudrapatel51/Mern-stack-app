import React, { useEffect, useState } from 'react'
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
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
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

  return (
    <div>
      
      <div>
        {error ? (
          <p>{error}</p>  
        ) : (
          user && (
            <div>
              <h1>User Profile</h1>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
            </div>
          )
        )}
      </div>
      <div className='text-black text-center'>
        <a href='/register'>Register</a>
        <br />
        <a href='/login'>Login</a>
      </div>
    </div>
  );
}
export default UserDashboard
