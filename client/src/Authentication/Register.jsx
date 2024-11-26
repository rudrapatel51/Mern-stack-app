import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmitForm = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/auth/register", { name, email, password })
            .then(res => {
                if (res.data.user && res.data.user._id) {
                    navigate('/login')
                } else {
                    setError('Registration failed. Please try again.')
                }
            })
            .catch(err => {
                console.log(err)
                setError('An error occurred. Please try again.')
            })
    }

    return (
        <div>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                        <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                        Mern Stack
                    </a>
                    <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Create an account
                            </h1>
                            <form onSubmit={handleSubmitForm} className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Your Name</label>
                                    <input onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " placeholder="name@company.com" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  " required />
                                </div>
                                <button type="submit" className="w-full text-black bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                                {error && <p className="text-sm font-light text-red-500 dark:text-red-400">{error}</p>}
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Register
