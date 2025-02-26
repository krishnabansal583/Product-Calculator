import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userName, setUserName] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err.response?.data?.msg || "Failed to fetch products");
      }
    };
    fetchProducts();

    
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.name) {
          setUserName(user.name); 
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCheckboxChange = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.find((p) => p._id === product._id);
      if (isSelected) {
        return prev.filter((p) => p._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const handleProductNameClick = (product) => {
    setSelectedProduct({
      ...product,
      productImage: product.productImage || "https://via.placeholder.com/150",
    });
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedProduct(null);
  };

  const handleWhatsAppShare = (product) => {
    if (!product) {
      alert("Please select a product to share.");
      return;
    }

    let message = `*Product Details:*\n`;
    message += `Name: ${product.productName}\n`;
    message += `B2B Price: $${product.b2bPrice}\n`;
    message += `MRP Price: $${product.mrp}\n`;
    message += `Sample Type: ${product.sampleType || "N/A"}\n`;
    message += `Fasting Required: ${product.fastingRequired ? "Yes" : "No"}\n`;
    message += `Reporting TAT: ${product.reportingTAT || "N/A"}\n`;
    message += `Product Image: ${product.productImage || "N/A"}\n\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappLink, "_blank");
  };

  const totalB2BPrice = selectedProducts.reduce(
    (sum, p) => sum + parseFloat(p.b2bPrice),
    0
  );
  const totalMRPPrice = selectedProducts.reduce(
    (sum, p) => sum + parseFloat(p.mrp),
    0
  );

  return (
    <div className="dashboard-container">
      <div className="heading">
        {userName && <span className="user-name">Welcome, {userName}</span>}
        <h1>Product Price Calculator</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main-content">
        {/* Left Section - Price Calculator */}
        <div className="price-calculator">
          <div className="calculator-header">
            <h3>Product Name</h3>
            <h3>B2B Price</h3>
            <h3>MRP Price</h3>
          </div>
          <div className="calculator-content">
            {selectedProducts.map((product) => (
              <div key={product._id} className="selected-product">
                <p>{product.productName}</p>
                <p>${product.b2bPrice}</p>
                <p>${product.mrp}</p>
              </div>
            ))}
            <div className="total-price">
              <p>
                <strong>Total B2B Price:</strong> ${totalB2BPrice.toFixed(2)}
              </p>
              <p>
                <strong>Total MRP Price:</strong> ${totalMRPPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        {/* Right Section - Product List */}
        <div className="product-section">
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for products"
              className="search-bar"
            />
            <FaSearch className="search-icon" />
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>B2B Price</th>
                <th>MRP Price</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-name-container">
                      <input
                        className="checkbox"
                        type="checkbox"
                        onChange={() => handleCheckboxChange(product)}
                        checked={selectedProducts.some(
                          (p) => p._id === product._id
                        )}
                      />
                      <span
                        className="product-name"
                        onClick={() => handleProductNameClick(product)}
                      >
                        {product.productName}
                      </span>
                    </div>
                  </td>
                  <td>${product.b2bPrice}</td>
                  <td>${product.mrp}</td>
                  <td>
                    <button
                      className="whatsapp-btn"
                      onClick={() => handleWhatsAppShare(product)}
                    >
                      <FaWhatsapp size={20} color="#25D366" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Section */}
      {isPopupVisible && selectedProduct && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={closePopup}>
              &times;
            </button>
            <h2>{selectedProduct.productName}</h2>
            <p>
              <strong>B2B Price:</strong> ${selectedProduct.b2bPrice}
            </p>
            <p>
              <strong>MRP Price:</strong> ${selectedProduct.mrp}
            </p>
            <p>
              <strong>Sample Type:</strong> {selectedProduct.sampleType}
            </p>
            <p>
              <strong>Fasting Required:</strong>{" "}
              {selectedProduct.fastingRequired ? "Yes" : "No"}
            </p>
            <p>
              <strong>Reporting TAT:</strong> {selectedProduct.reportingTAT}
            </p>
            <p>
              <strong>Product Image:</strong>
            </p>
            <img
              src={selectedProduct.productImage}
              alt="Product"
              style={{ width: "150px", height: "150px", borderRadius: "8px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
