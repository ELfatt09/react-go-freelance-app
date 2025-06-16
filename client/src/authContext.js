import {createContext, useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, validateFullname } from './utils/validation'


import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(true);
  const [verified, setVerified] = useState(true);
  const [loading, setLoading] = useState(false);

  const register = (email, password, confirmPassword, fullname) => {
    setLoading(true);
    if (!validateEmail(email)) {
      setError('Invalid email');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!validateFullname(fullname)) {
      setError('Fullname must be at least 3 characters long and contain only letters, numbers, and underscores');
      return;
    }

    axios.post('http://localhost:8080/auth/register', {
      "Email": email,
      "Password": password,
      "Fullname": fullname,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('register response', res.data);
        setMessage('Registration successful');
      })
      .catch((err) => {
        console.error('register error', err);
        setError('Registration failed');
      });
    setLoading(false);
    return [error, message];
  };

  const login = (email, password) => {
    setLoading(true);
    if (!validateEmail(email)) {
      setError('Invalid email');
      return;
    }
    const res = axios
      .post('http://localhost:8080/auth/login', { email, password }, { headers: { 'Content-Type': 'application/json' } })
      .then((res) => {
        console.log('login response', res.data);
        localStorage.setItem('token', res.data.token);
        setAuth(true);
        navigate('/');
        getAuthenticatedUser(); // Fetch user data after login
      })
      .catch((err) => {
        console.error('login error', err);
        setError(err.response.data.error);
      });
    setLoading(false);
    return error;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setUser(null);
    window.location.reload();
  };

  const verifyEmail = (VerificationToken) => { 
    axios
      .post('http://localhost:8080/auth/verification', { 'Token': VerificationToken }, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` } })
      .then((res) => { 
        console.log('verifyEmail response', res.data);
        if (res.data) {
          setMessage(res.data.message);
          localStorage.setItem('token', res.data.token);
        }
      })
      .catch((err) => {
        console.error('verifyEmail error', err);
        if (err.response && err.response.data) {
          setError(err.response.data.error);
        }
      });
      return [error, message];
  }
  const changePassword = (OldPassword, NewPassword, NewPasswordConfirmation) => {
    if (!validatePassword(NewPassword)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }
    if (NewPassword !== NewPasswordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    const res = axios.put('http://localhost:8080/auth/password', {
      'OldPassword': OldPassword,
      'NewPassword': NewPassword,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => {
        console.log('changePassword response', res.data);
        if (res.data) {
          setMessage(res.data.message);
        }
      })
      .catch((err) => {
        console.error('changePassword error', err);
        if (err.response && err.response.data) {
          setError(err.response.data.error);
        }
      });

  }
  const getToken = () => localStorage.getItem('token');

  // Dalam AuthContext.js
const isAuthenticated = async () => {
  const token = getToken();
  setLoading(true); // Mulai loading
  if (!token) {
    await setAuth(false);
    setLoading(false); // Selesai loading
    return false;
  }
  try {
    const res = await axios.get('http://localhost:8080/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('isAuthenticated response', res.data);
    setAuth(res.data.auth);
    setLoading(false); // Selesai loading
    return res.data.auth;
  } catch (err) {
    logout();
    setLoading(false); // Selesai loading
    return false;
  }
  };
  
  const isVerified = async () => {
    const token = getToken();
    setLoading(true); // Mulai loading
    if (!token) {
      await setVerified(false);
      setLoading(false); // Selesai loading
      return false;
    }
    try {
      const res = await axios.get('http://localhost:8080/auth/verified', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('isVerified response', res.data);
      setVerified(res.data.verified);
      setLoading(false); // Selesai loading
      
      return res.data.verified;
    } catch (err) {
      setLoading(false); // Selesai loading
      return false;
    }
  };

  const getAuthenticatedUser = async () => {
    try {
      const res = await axios.get('http://localhost:8080/auth/data', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      console.log('getAuthenticatedUser response', res.data);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error('getAuthenticatedUser error', err);
      return err.response.data;
    }
  };

  const edit = (fullname, subTitle, description, pfpPath, address, phone, gender) => {
    const token = localStorage.getItem('token');
    const res = axios.put('http://localhost:8080/profile/edit', {
      "Fullname": fullname,
      "SubTitle": subTitle,
      "Description": description,
      "PfpPath": pfpPath,
      "Address": address,
      "Phone": phone,
      "Gender": gender
    }, {
      
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => getAuthenticatedUser()) // Update user data after editing
      .catch(err => console.error(err));
  };

  useEffect(() => {
    isAuthenticated().then((authStatus) => {
      if (authStatus) {
        isVerified();
        setToken(getToken());
        getAuthenticatedUser();
      }
    });
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, auth, verified, loading, error, token, register, login, logout, edit, verifyEmail, changePassword}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext)
}

