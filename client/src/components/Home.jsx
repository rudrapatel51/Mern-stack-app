import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [message,setMessage]= useState()
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:3001/")
    .then(res => {
      if(res.data.valid){
        setMessage(res.data.message)
      }
      else{
        navigate('/login')
      }
    })
    .catch(err => console.log(err))
  })
  return (
    <div>
    <div className='flex justify-center'>
      This is the home page {message}
      </div>
      <div className='text-black text-center'>
      <a href='/register'>Register</a>
      <br/>
      <a href='/login'>Login</a>
      </div>
    </div>
  )
}

export default Home
