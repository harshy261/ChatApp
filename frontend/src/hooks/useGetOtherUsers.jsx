import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '..'; // Adjust the import based on your project structure

const useGetOtherUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const res = await axios.get(`${BASE_URL}/api/v1/user`, {
          headers: {
            'Authorization': `Bearer ${token}` // Attach the token to the Authorization header
          },
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherUsers();
  }, []);

  return { users, loading, error };
};

export default useGetOtherUsers;
