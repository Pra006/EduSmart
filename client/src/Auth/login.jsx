import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState({
    email: '',
    password: '',
    role: 'student'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:3000/api/user/login', values, {
        withCredentials: true,
      });

      if (data.success) {
        console.log('Login successful:', data);

        // Update auth context with user data
        login(data.existingUser);

        // Navigate based on role
        if (data.existingUser.role === 'educator') {
          navigate('/educator/educator');
        } else if (data.existingUser.role === 'student') {
          navigate('/');
        } else if (data.existingUser.role === 'admin') {
          navigate('/admin/dashboard');
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center space-y-4'>
        <h1 className='text-gray-700 font-bold text-2xl'>Welcome Back</h1>
        <p className='text-gray-500 mb-4'>Please Login to your account</p>

        <form onSubmit={handleLogin} className='space-y-4'>
          <input
            required
            name='email'
            type='email'
            placeholder='Enter your email'
            value={values.email}
            onChange={handleChange}
            className='border border-gray-200 p-2 rounded-lg w-full'
          />
          <input
            required
            name='password'
            type='password'
            placeholder='Enter your password'
            value={values.password}
            onChange={handleChange}
            className='border border-gray-200 p-2 rounded-lg w-full'
          />

          <div className="flex justify-center gap-4">
            <label>
              <input type="radio" name="role" value="student" checked={values.role === 'student'} onChange={handleChange}/> Student
            </label>
            <label>
              <input type="radio" name="role" value="educator" checked={values.role === 'educator'} onChange={handleChange}/> Educator
            </label>
            <label>
              <input type="radio" name="role" value="admin" checked={values.role === 'admin'} onChange={handleChange}/> Admin
            </label>
          </div>

          <button className='bg-blue-500 text-white px-4 py-2 rounded-full w-full hover:bg-blue-600'>
            Login
          </button>
        </form>

        <p className='text-gray-500'>
          Don't have an account? <Link to='/signup' className='text-indigo-500'>Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
