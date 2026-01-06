import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        fullname: '',
        email: '',
        password: '',
        role: 'student',
        document: null
    });
      const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "document") {
            setValues({ ...values, document: files[0] });
        } else {
            setValues({ ...values, [name]: value });
        }
    };

   const signup = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', values.fullname);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('role', values.role);
    if(values.document) formData.append('document', values.document);

    try {
        const resp = await fetch('http://localhost:3000/api/user/signup', {
            method: 'POST',
            body: formData, 
            credentials: 'include'
        });

        const data = await resp.json();
        console.log(data);
        if (data.success) {
            alert('Signup successful please login');
            navigate('/login');
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log(error);
        alert('An error occurred during signup');
    }
}
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center space-y-4 '>
                <h1 className='text-gray-700 font-bold text-2xl'>Create your account</h1>
                <p className='text-gray-500 mb-4'>Join us today! it's quick and easy</p>
                {/* Signup Form*/}
                <form onSubmit={signup} className='space-y-4'>
                    <div className='flex flex-col'>
                        <label className='mt-1.5 flex'>Full Name</label>
                        <input
                            required
                            onChange={handleChange}
                            name='fullname'
                            type="text"
                            placeholder='Enter your full name'
                            className='border border-gray-200 p-1 rounded-lg' />
                    </div>
                    <div className='flex flex-col'>
                        <label className='mt-1.5 flex'>Email</label>
                        <input
                            required
                            onChange={handleChange}
                            name='email'
                            type="email"
                            placeholder='Enter your email'
                            className='border border-gray-200 p-1 rounded-lg' />
                    </div>
                    <div className='flex flex-col'>
                        <label className='mt-1.5 flex'>Password</label>
                        <input
                            required
                            onChange={handleChange}
                            name='password'
                            type="text"
                            placeholder='Enter your Password'
                            className='border border-gray-200 p-1 rounded-lg' />
                    </div>
                    <div className="mb-4">
                        {/* Role label aligned left */}
                        <h1 className="text-gray-800 text-left font-medium mb-2">Role</h1>

                        {/* Radio options centered */}
                        <div className="flex items-center gap-4 justify-center mt-0">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="role" value="student" checked={values.role === 'student'} className="cursor-pointer" onChange={handleChange} />
                                <span className="text-gray-700">Student</span>
                            </label>

                            <label className="flex gap-2 cursor-pointer">
                                <input type="radio" name="role" value="educator" checked={values.role === 'educator'} className="cursor-pointer" onChange={handleChange} />
                                <span className="text-gray-700">Educator</span>
                            </label>

                            <label className="flex gap-2 cursor-pointer">
                                <input type="radio" name="role" value="admin" checked={values.role === 'admin'} className="cursor-pointer" onChange={handleChange} />
                                <span className="text-gray-700">Admin</span>
                            </label>
                        </div>
                    </div>
                    {
                        values.role === 'educator' &&(
                            <div className='flex flex-col'>
                                <label className='mt-1.5 flex'><h1 className='font-semibold'>Educator Certificate Document</h1></label>
                                <input
                                required
                                onChange={handleChange}
                                name='document'
                                type="file"
                                className='border border-gray-200 p-1 rounded-lg' />
                            </div>
                        )
                    }
                    <button className='bg-linear-to-r from-indigo-400 via-blue-500 to-indigo-500 text-white
               hover:scale-105 transition-transform duration-300 w-full px-4 py-1.5 rounded-full'>Signup</button>
                </form>
                {/* divider */}
                <div className='flex justify-center gap-2 mt-4'>
                    <hr className='grow w-full border-gray-300' />
                    <span className='text-gray-400'>OR</span>
                    <hr className='grow w-full border-gray-300' />
                </div>
                <p className='text-gray-500' >Already have an account? <span className='text-indigo-500'>
                    <Link to='/login'>Login</Link></span></p>
            </div>
        </div>
    )
}

export default Signup