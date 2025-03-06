import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/get-all-products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const navigateToUsers = () => {
    navigate('/admin/users');
  };

  return (
    <div className="products-page">
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
          <li onClick={navigateToUsers}>Users</li>
        </ul>
      </div>

      <div className="main-contentproducts">
        {/* Product List Section */}
        <div className="product-list-section">
          <h2 className="form-heading">All Products</h2>
          <ul className="product-list">
            {products.map((product) => (
              <li key={product._id}>
                <div className="product-info">
                  <strong>{product.productName}</strong>
                  <p>B2B Price: {product.b2bPrice}</p>
                  <p>MRP: {product.mrp}</p>
                  <p>Sample Type: {product.sampleType}</p>
                  <p>Fasting Required: {product.fastingRequired ? 'Yes' : 'No'}</p>
                  <p>Reporting TAT: {product.reportingTAT}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Products;