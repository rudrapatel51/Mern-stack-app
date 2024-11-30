import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/admin/login', { username, password }, { withCredentials: true });
            if (response.data) {
                localStorage.setItem('adminToken', response.data.adminToken);
                console.log(response.data.adminToken)
                navigate('/admin/dashboard');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className=' bg justify-center flex p-16'>
            <div class=" w-full max-w-xs">
                <h2 className='text-4xl p-5 font-bold'>Admin Login</h2>
                <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={handleLogin}>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                            Username
                        </label>
                    </div>
                    <input
                        className='shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                            Password
                        </label>
                        <input
                            className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type="submit">Login</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;
