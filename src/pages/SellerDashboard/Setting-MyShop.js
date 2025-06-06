import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingMyShop = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState('settings/account'); // Set to My Shop by default
  const [expandedSubmenus, setExpandedSubmenus] = useState({ settings: true });
  const [shopDetails, setShopDetails] = useState({
    shopName: 'DEMO SHOP',
    businessType: 'basic',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    showWelcomeNotification();
  }, []);

  const showWelcomeNotification = () => {
    showNotification('Shop settings loaded successfully!');
  };

  const showNotification = (message, duration = 3000) => {
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 1000;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 100);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, duration);
  };

  const handleNavigation = (routeName) => {
    setActiveNavItem(routeName);
    
    switch(routeName) {
      case 'home':
        navigate('/sellerhome'); // Navigate to SellerHome component
        break;
      case 'shop':
        navigate('/shop');
        break;
      case 'orders':
      case 'orders/pending':
      case 'orders/completed':
        showNotification('Navigating to Orders...');
        break;
      case 'catalog':
      case 'catalog/products':
        navigate('/productscatalog');
        break;
      case 'catalog/categories':
        showNotification('Opening Catalog...');
        break;
      case 'settings/plan':
        navigate('/plan');
        break;
      case 'settings/delivery':
        showNotification('Opening Delivery Settings...');
        break;
      case 'settings/payment':
        showNotification('Opening Payment Settings...');
        break;
      case 'settings/account':
        showNotification('Opening My Shop...');
        break;
      default:
        break;
    }
  };

  const toggleSubmenu = (menuKey) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleInputChange = (field, value) => {
    setShopDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    showNotification('Shop details saved successfully!');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveChanges();
    } else {
      setIsEditing(true);
      showNotification('Edit mode enabled');
    }
  };

  const handleGetMobileApp = () => {
    showNotification('Redirecting to mobile app download...');
  };

  const handleUpgradePlan = () => {
    showNotification('Opening plan upgrade options...');
  };

  const handleHelpCenter = () => {
    showNotification('Opening Help Center...');
  };

  const handleCommunity = () => {
    showNotification('Opening Thriftorium Community...');
  };

  const handlePrivacyPolicy = () => {
    showNotification('Opening Privacy Policy...');
  };

  const handleChooseAnotherPlan = () => {
    showNotification('Opening plan selection...');
  };

  return (
    <div className="seller-dashboard">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo-icon">🛒</span>
            <h2>Thriftorium</h2>
          </div>
          <div className="plan-badge">BASIC</div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={`nav-item ${activeNavItem === 'home' ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('home'); }}>
                <span>🏠</span> Dashboard
              </a>
            </li>
            <li className={`nav-item ${activeNavItem === 'orders' ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('orders'); }}>
                <span>📦</span> Orders
                <span className={`expand-arrow ${expandedSubmenus.orders ? 'expanded' : ''}`}>▶</span>
              </a>
              {expandedSubmenus.orders && (
                <ul className="submenu">
                  <li className="submenu-item">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('orders/pending'); }}>
                      Pending Orders
                    </a>
                  </li>
                  <li className="submenu-item">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('orders/completed'); }}>
                      Completed Orders
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li className={`nav-item ${activeNavItem === 'catalog' ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('catalog'); }}>
                <span>📋</span> Catalog
                <span className={`expand-arrow ${expandedSubmenus.catalog ? 'expanded' : ''}`}>▶</span>
              </a>
              {expandedSubmenus.catalog && (
                <ul className="submenu">
                  <li className="submenu-item">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('catalog/products'); }}>
                      Products
                    </a>
                  </li>
                  <li className="submenu-item">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('catalog/categories'); }}>
                      Categories
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li className={`nav-item ${activeNavItem.startsWith('settings/') ? 'active' : ''}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('settings'); }}>
                    <span>⚙️</span> Settings
                    <span className={`expand-arrow ${expandedSubmenus.settings ? 'expanded' : ''}`}>▶</span>
                </a>
                {expandedSubmenus.settings && (
                    <ul className="submenu">
                    <li className={`submenu-item ${activeNavItem === 'settings/plan' ? 'active' : ''}`}>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('settings/plan'); }}>
                        Plan upgrade
                        </a>
                    </li>
                    <li className={`submenu-item ${activeNavItem === 'settings/delivery' ? 'active' : ''}`}>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('settings/delivery'); }}>
                        Delivery Settings
                        </a>
                    </li>
                    <li className={`submenu-item ${activeNavItem === 'settings/payment' ? 'active' : ''}`}>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('settings/payment'); }}>
                        Payment Settings
                        </a>
                    </li>
                    <li className={`submenu-item ${activeNavItem === 'settings/account' ? 'active' : ''}`}>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('settings/account'); }}>
                        My Shop
                        </a>
                    </li>
                    </ul>
                )}
                </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="settings-container">
          {/* Shop Details Card */}
          <div className="settings-card">
            <div className="card-header">
              <div className="shop-info">
                <div className="shop-icon">🏪</div>
                <div className="shop-details">
                  <h2>{shopDetails.shopName}</h2>
                  <span className="business-type">{shopDetails.businessType.toUpperCase()}</span>
                  <p className="edit-link" onClick={handleEditToggle}>
                    {isEditing ? 'Save changes' : 'Edit your business details'}
                  </p>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="edit-form">
                <div className="form-group">
                  <label>Shop Name</label>
                  <input
                    type="text"
                    value={shopDetails.shopName}
                    onChange={(e) => handleInputChange('shopName', e.target.value)}
                    placeholder="Enter shop name"
                  />
                </div>
                <div className="form-group">
                  <label>Business Description</label>
                  <textarea
                    value={shopDetails.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your business"
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={shopDetails.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={shopDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={shopDetails.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Business address"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Settings Options */}
          <div className="settings-options">
            <div className="option-item" onClick={handleGetMobileApp}>
              <div className="option-icon">📱</div>
              <div className="option-content">
                <h3>Get your mobile app</h3>
              </div>
              <div className="option-arrow">›</div>
            </div>

            <div className="option-item" onClick={handleUpgradePlan}>
              <div className="option-icon">💳</div>
              <div className="option-content">
                <h3>Subscription Plan</h3>
                <button className="upgrade-btn">Upgrade now</button>
              </div>
              <div className="option-status">
                <span className="plan-status">Basic</span>
                <div className="option-arrow">›</div>
              </div>
            </div>

            <div className="option-item" onClick={handleHelpCenter}>
              <div className="option-icon">🎧</div>
              <div className="option-content">
                <h3>Help Center</h3>
              </div>
              <div className="option-arrow">›</div>
            </div>

            <div className="option-item" onClick={handleCommunity}>
              <div className="option-icon">👥</div>
              <div className="option-content">
                <h3>Thriftorium Community</h3>
                <span className="new-badge">New</span>
              </div>
              <div className="option-arrow">›</div>
            </div>

            <div className="option-item" onClick={handlePrivacyPolicy}>
              <div className="option-icon">🔒</div>
              <div className="option-content">
                <h3>Privacy Policy</h3>
              </div>
              <div className="option-arrow">›</div>
            </div>
          </div>

          {/* Bottom Notification */}
          <div className="bottom-notification">
            <div className="notification-content">
              <h3>Your Store has been created!</h3>
              <p>Get Thriftorium Premium now and take your business to another level</p>
            </div>
            <button className="choose-plan-btn" onClick={handleChooseAnotherPlan}>
              Choose another plan
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`
        .seller-dashboard {
          display: flex;
          min-height: 100vh;
          background-color: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .sidebar {
          width: 250px;
          background: #1a1a2e;
          color: white;
          padding: 0;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #4a90e2;
          font-weight: 600;
        }

        .plan-badge {
          background: #28a745;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .sidebar-nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          border-bottom: 1px solid #333;
        }

        .nav-item a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          color: #ccc;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .nav-item:hover a,
        .nav-item.active a {
          background: #4a90e2;
          color: white;
        }

        .nav-item span:first-child {
          margin-right: 10px;
          font-size: 0.9rem;
        }

        .expand-arrow {
          transition: transform 0.3s ease;
          font-size: 0.8rem;
        }

        .expand-arrow.expanded {
          transform: rotate(90deg);
        }

        .submenu {
          background: #0f0f23;
          padding-left: 0;
        }

        .submenu-item a {
          padding: 10px 20px 10px 50px;
          font-size: 0.85rem;
        }


        /* Active state for submenu items */
        .submenu-item.active a {
          background: #4a90e2;
          color: white;
        }

        .submenu-item:hover a {
          background: #3a7bd5;
          color: white;
        }

        .main-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .settings-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .settings-card {
          background: white;
          border-radius: 12px;
          padding: 0;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .card-header {
          padding: 30px;
          border-bottom: 1px solid #f0f0f5;
        }

        .shop-info {
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .shop-icon {
          font-size: 3rem;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 15px;
          border: 1px solid #e9ecef;
        }

        .shop-details h2 {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          color: #333;
          font-weight: 600;
        }

        .business-type {
          background: #28a745;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .edit-link {
          color: #007bff;
          margin: 10px 0 0 0;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .edit-link:hover {
          text-decoration: underline;
        }

        .edit-form {
          padding: 30px;
          background: #f8f9fa;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        .settings-options {
          background: white;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .option-item {
          display: flex;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 1px solid #f0f0f5;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .option-item:hover {
          background: #f8f9fa;
        }

        .option-item:last-child {
          border-bottom: none;
        }

        .option-icon {
          font-size: 1.5rem;
          margin-right: 20px;
          width: 24px;
          text-align: center;
        }

        .option-content {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .option-content h3 {
          margin: 0;
          font-size: 1rem;
          color: #333;
          font-weight: 500;
        }

        .upgrade-btn {
          background: #6f42c1;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
        }

        .new-badge {
          background: #28a745;
          color: white;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .option-status {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .plan-status {
          color: #666;
          font-size: 0.9rem;
        }

        .option-arrow {
          color: #999;
          font-size: 1.2rem;
          font-weight: 300;
        }

        .bottom-notification {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .notification-content h3 {
          margin: 0 0 10px 0;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .notification-content p {
          margin: 0 0 25px 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .choose-plan-btn {
          background: white;
          color: #5b4fb8;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .choose-plan-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .seller-dashboard {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
          }

          .settings-container {
            padding: 20px 15px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .option-item {
            padding: 15px 20px;
          }

          .card-header,
          .edit-form {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default SettingMyShop;