import {createContext, useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, validateUsername } from './utils/validation'


import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState(null);

  const register = (email, password, confirmPassword, username) => {
    if (!validateEmail(email)) {
      setError('Invalid email')
      return
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!validateUsername(username)) {
      setError('Username must be at least 3 characters long and contain only letters, numbers, and underscores')
      return
    }

    axios.post('http://localhost:8080/auth/register', {
      "Email": email,
      "Password": password,
      "Username": username,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res.data)
        alert('Registration successful')
      })
      .catch((err) => {
        console.error(err)
        setError('Registration failed')
      })
  }

  const login = (email, password) => {
    if (!validateEmail(email)) {
      setError('Invalid email')
      return
    }
    axios
      .post('http://localhost:8080/auth/login', { email, password }, { headers: { 'Content-Type': 'application/json' } })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        navigate('/');
      })
      .catch((err) => setError(err.response.data.error));
  };

  const logout = () => {
    localStorage.removeItem('token') 
    window.location.reload();
  };

  // First define the helper function
const getToken = () => localStorage.getItem('token');

// Then your authentication functions
const isAuthenticated = async () => {
  if (!getToken()) return false;
  try {
    const res = await axios.get('http://localhost:8080/auth/verify', { 
      headers: { Authorization: `Bearer ${getToken()}` } 
    });
    console.log(res.data.auth)
    return res.data.auth;
  } catch (err) {
    logout();
    return false;
  }
};

const getAuthenticatedUser = async () => {
  try {
    const res = await axios.get('http://localhost:8080/auth/data', { 
      headers: { Authorization: `Bearer ${getToken()}` } 
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const edit = (username, bio, pfpPath,) => {
        const token = localStorage.getItem('token');
        axios.put('http://localhost:8080/auth/edit', {
          "Username": username,
          "Bio": bio,
          "PfpPath": null
        }, {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
}

// Use a proper React hook to handle the asynchronous calls
useEffect(() => {
  const checkAuthAndGetUser = async () => {
    const isAuth = await isAuthenticated();
    setAuth(isAuth);
    
    if (isAuth) {
      const userData = await getAuthenticatedUser();
      setUser(userData);
    }
  };
  
  checkAuthAndGetUser();
}, [getToken()]); // Run when token changes (i.e. on login/logout)

  return (
    <AuthContext.Provider value={{ user, auth, error, register, login, logout, edit }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext)
}

