

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import './Login.css';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; // For password visibility toggle

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false); // State for password visibility
//   const [error, setError] = useState(''); // State for error messages
//   const [loading, setLoading] = useState(false); // State for loading
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Form validation
//     if (!formData.email || !formData.password) {
//       setError('Please enter your email and password.');
//       return;
//     }

//     setLoading(true); // Start loading
//     setError(''); // Clear previous errors

//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', formData);

//       // Save the token and user data to localStorage
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.user)); // Save the user object
//       localStorage.setItem('userId', res.data.user._id); // Store userId

//       // Redirect to the dashboard
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.msg || 'Invalid credentials. Please try again.');
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h1>Login</h1>
//         {error && <p className="error-message">{error}</p>} {/* Display error message */}
//         <form onSubmit={handleSubmit} className="login-form">
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           />
//           <div className="password-input">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               placeholder="Password"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             />
//             <button
//               type="button"
//               className="toggle-password"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle password visibility */}
//             </button>
//           </div>
//           <button type="submit" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'} {/* Disable button during loading */}
//           </button>
//         </form>
//         <p className="register-link">
//           Don't have an account? <Link to="/register">Register here</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // For password visibility toggle
import './Login.css'; // Ensure this CSS file exists for styling

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading
  const [checkingAuth, setCheckingAuth] = useState(true); // New state to track initial auth check
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token) {
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/adminDashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setCheckingAuth(false); // Mark auth check as complete
    }
  }, [navigate]); // Only run when `navigate` changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic form validation
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      // Store token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userId', response.data.user._id); // Store userId

      // Redirect based on user role
      if (response.data.user.role === 'admin') {
        navigate('/adminDashboard');
      } else {
        // Additional check for approval status
        if (!response.data.user.isApproved) {
          setError('Your account is pending approval. Please contact admin.');
          localStorage.clear(); // Clear storage as they can't login yet
          setLoading(false);
          return;
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Show loading indicator while checking authentication
  if (checkingAuth) {
    return <div className="loading">Checking authentication...</div>;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit} className="login-form">
          
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
        
           
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle password visibility */}
              </button>
            </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'} {/* Disable button during loading */}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;