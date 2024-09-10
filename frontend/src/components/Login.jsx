import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '..';

const Login = () => {
  const [user, setUser] = useState({
    userName: "", // Updated field name
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include cookies with requests
      });

      if (res.data._id) { // Check for the presence of the user ID
        // Save the token if needed
        localStorage.setItem('token', res.data.token); // Example: storing in local storage
        dispatch(setAuthUser(res.data)); // Set the user in the Redux store if applicable
        navigate("/dashboard"); // Redirect to the dashboard or another protected route
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.log(error);
    }
  };

  return (
    <div className="min-w-96 mx-auto">
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100'>
        <h1 className='text-3xl font-bold text-center'>Login</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>Username</span>
            </label>
            <input
              value={user.userName} // Updated field name
              onChange={(e) => setUser({ ...user, userName: e.target.value })} // Updated field name
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
          <p className='text-center my-2'>Don't have an account? <Link to="/signup">Signup</Link></p>
          <div>
            <button type="submit" className='btn btn-block btn-sm mt-2 border border-slate-700'>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
