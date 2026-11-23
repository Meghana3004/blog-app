import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateForm } from '../utils/authUtils';
import { useAuth } from '../contexts/AuthContext';

export const useLoginSignup = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const toggleForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsLogin(prevState => !prevState);
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      setSuccessMsg('Successfully logged in');
      setUser(response.data.user);
      navigate('/Home');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Unable to log in. Please try again.');
    }
  };

  const handleSignup = async (formData) => {
    const error = validateForm(formData);
    if (error) {
      setErrorMsg(error);
    } else {
      try {
        const response = await axios.post('/users/signup', formData);
        setSuccessMsg('Successfully signed up');
        setErrorMsg('');
        setUser(response.data.user);
        navigate('/Home');
      } catch (error) {
        setErrorMsg(error.response?.data?.message || 'Unable to sign up. Please try again.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const email = e.target.elements.logEmail.value;
      const password = e.target.elements.logPassword.value;
      handleLogin(email, password);
    } else {
      const formData = {
        name: e.target.elements.name.value,
        email: e.target.elements.email.value,
        username: e.target.elements.username.value,
        dob: e.target.elements.dob.value,
        mobile: e.target.elements.mobile.value,
        password: e.target.elements.password.value,
        confirmPassword: e.target.elements.confirmPassword.value,
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