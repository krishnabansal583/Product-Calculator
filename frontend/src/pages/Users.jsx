import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/get-all-users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleApproveUser = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve-user/${id}`);
      alert('User approved successfully!');
      fetchAllUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleLogout = () => {
    alert('Logged out successfully!');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigateToDashboard = () => {
    navigate('/admindashboard');
  };

  const navigateToProducts = () => {
    navigate('/admin/products');
  };

  return (
    <div className="users-page">
      {/* Navbar */}
      <div className="admin-navbar">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          &#9776;
        </button>
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>
          &times;
        </button>
        <ul>
          <li onClick={navigateToDashboard}>Dashboard</li>
          <li onClick={navigateToProducts}>Products</li>
        </ul>
      </div>

      <div className="main-conten">
        {/* User List Section */}
        <div className="user-list-section">
          <h2 className="form-heading">All Users</h2>
          <ul className="user-list">
            {users.map((user) => (
              <li key={user._id}>
                <div className="user-info">
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  <p>{user.isApproved ? 'Approved' : 'Not Approved'}</p>
                </div>
                <div className="user-actions">
                  {!user.isApproved && (
                    <button onClick={() => handleApproveUser(user._id)}>Approve</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Users;