import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateForm } from '../utils/authUtils';

export const useLoginSignup = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const logout = queryParams.get('logout');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (logout) {
      sessionStorage.removeItem('username');
      setSuccessMsg('Successfully logged out.');
      setErrorMsg('');
    }
  }, [logout]);

  const toggleForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLogin(prevState => !prevState);
  };

  const handleLogin = async (email) => {
    try {
      const response = await axios.post('/users/login', { email });
      setSuccessMsg('Successfully logged in');
      sessionStorage.setItem('username', response.data.username);
      navigate('/Home');
    } catch (error) {
      setErrorMsg(error.response.data.message);
    }
  };

  const handleSignup = async (formData) => {
    const error = validateForm(formData);
    if (error) {
      setErrorMsg(error);
    } else {
      try {
        await axios.post('/users/signup', formData);
        setSuccessMsg('Successfully signed up');
        setErrorMsg('');
      } catch (error) {
        setErrorMsg('Error signing up. Please try again');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const email = e.target.elements.logEmail.value;
      handleLogin(email);
    } else {
      const formData = {
        name: e.target.elements.name.value,
        email: e.target.elements.email.value,
        username: e.target.elements.username.value,
        dob: e.target.elements.dob.value,
        mobile: e.target.elements.mobile.value,
      };
      handleSignup(formData);
    }
  };

  return {
    errorMsg,
    successMsg,
    isLogin,
    toggleForm,
    handleSubmit,
  };
};