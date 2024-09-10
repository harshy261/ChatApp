import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '..';

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const navigate = useNavigate();

  const handleGenderChange = (gender) => {
    setUser({ ...user, gender });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate password match
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    console.log("Submitting user data:", user); // Debugging

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log("Response:", res);  // Debugging
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }

    // Reset form
    setUser({
      fullName: "",
      userName: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-bold text-center'>Signup</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Full Name</span>
            </label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Full Name'
              required
            />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Username</span>
            </label>
            <input
              value={user.userName}
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
              className='w-full input input-bordered h-10'
              type="text"
              placeholder='Username'
              required
            />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Password</span>
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Password'
              required
            />
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Confirm Password</span>
            </label>
            <input
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className='w-full input input-bordered h-10'
              type="password"
              placeholder='Confirm Password'
              required
            />
          </div>
          <div className='flex items-center my-4'>
            <div className='flex items-center'>
              <p>Male</p>
              <input
                type="radio"
                checked={user.gender === "male"}
                onChange={() => handleGenderChange("male")}
                className="radio mx-2"
                name="gender"
              />
            </div>
            <div className='flex items-center'>
              <p>Female</p>
              <input
                type="radio"
                checked={user.gender === "female"}
                onChange={() => handleGenderChange("female")}
                className="radio mx-2"
                name="gender"
              />
            </div>
          </div>
          <p className='text-center my-2'>Already have an account? <Link to="/login">login</Link></p>
          <div>
            <button type='submit' className='btn btn-block btn-sm mt-2 border border-slate-700'>Signup</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
