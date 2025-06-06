import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CatalogProducts = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState('catalog/products');
  const [expandedSubmenus, setExpandedSubmenus] = useState({ catalog: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    showWelcomeNotification();
  }, []);

  const showWelcomeNotification = () => {
    showNotification('Product catalog loaded successfully!');
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
        navigate('/sellerhome');
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
        showNotification('Opening Products...');
        break;
      case 'catalog/categories':
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
        navigate('/myshop');
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

  const handleAddProduct = () => {
    showNotification('Opening Add Product form...');
  };

  const handleSelectPlan = () => {
    showNotification('Opening plan selection...');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
            <li className={`nav-item ${activeNavItem.startsWith('catalog') ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('catalog'); }}>
                <span>📋</span> Catalog
                <span className={`expand-arrow ${expandedSubmenus.catalog ? 'expanded' : ''}`}>▶</span>
              </a>
              {expandedSubmenus.catalog && (
                <ul className="submenu">
                  <li className={`submenu-item ${activeNavItem === 'catalog/products' ? 'active' : ''}`}>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('catalog/products'); }}>
                      Products
                    </a>
                  </li>
                  <li className={`submenu-item ${activeNavItem === 'catalog/categories' ? 'active' : ''}`}>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('catalog/categories'); }}>
                      Category
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
        <div className="catalog-container">
          {/* Header */}
          <div className="catalog-header">
            <h1>Product Catalog</h1>
            <button className="add-product-btn" onClick={handleAddProduct}>
              Add Product
            </button>
          </div>

          {/* Content Area */}
          <div className="catalog-content">
            {/* Tab Navigation */}
            <div className="tab-navigation">
              <div className="tab active">All Product</div>
            </div>

            {/* Search Bar */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search product"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
            </div>

            {/* Empty State */}
            <div className="empty-state">
              <div className="empty-icon">
                <div className="box-icon">📦</div>
              </div>
              <h2>Your catalog is still empty</h2>
              <p>Add products and start selling in your tokko online store</p>
              <button className="add-product-btn-large" onClick={handleAddProduct}>
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Notification */}
        <div className="bottom-notification">
          <div className="notification-content">
            <span>Your Store has been created</span>
            <button className="select-plan-btn" onClick={handleSelectPlan}>
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
          position: fixed;
          height: 100vh;
          overflow-y: auto;
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
          text-decoration: none;
        }

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
          margin-left: 250px;
          padding: 0;
          background: white;
          min-height: 100vh;
          position: relative;
        }

        .catalog-container {
          padding: 20px 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .catalog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .catalog-header h1 {
          margin: 0;
          font-size: 1.8rem;
          color: #333;
          font-weight: 600;
        }

        .add-product-btn {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .add-product-btn:hover {
          background: #357abd;
        }

        .catalog-content {
          background: white;
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .tab-navigation {
          padding: 20px 30px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .tab {
          display: inline-block;
          padding: 12px 0;
          margin-right: 30px;
          color: #666;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-weight: 500;
        }

        .tab.active {
          color: #4a90e2;
          border-bottom-color: #4a90e2;
        }

        .search-container {
          padding: 20px 30px;
        }

        .search-input-wrapper {
          position: relative;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 0.9rem;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 45px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.9rem;
          background: #f8f9fa;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #4a90e2;
          background: white;
        }

        .empty-state {
          text-align: center;
          padding: 80px 30px;
        }

        .empty-icon {
          margin-bottom: 30px;
        }

        .box-icon {
          font-size: 4rem;
          opacity: 0.3;
          margin-bottom: 10px;
        }

        .empty-state h2 {
          margin: 0 0 15px 0;
          font-size: 1.5rem;
          color: #333;
          font-weight: 600;
        }

        .empty-state p {
          margin: 0 0 30px 0;
          color: #666;
          font-size: 1rem;
        }

        .add-product-btn-large {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .add-product-btn-large:hover {
          background: #357abd;
        }

        .bottom-notification {
          position: fixed;
          bottom: 0;
          left: 250px;
          right: 0;
          background: #1a1a1a;
          color: white;
          padding: 15px 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .notification-content {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 0.9rem;
        }

        .select-plan-btn {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .select-plan-btn:hover {
          background: #357abd;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: static;
            width: 100%;
            height: auto;
          }

          .main-content {
            margin-left: 0;
          }

          .catalog-container {
            padding: 15px;
          }

          .catalog-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .catalog-header h1 {
            font-size: 1.5rem;
          }

          .search-input-wrapper {
            max-width: 100%;
          }

          .empty-state {
            padding: 40px 20px;
          }

          .bottom-notification {
            left: 0;
            padding: 12px 15px;
          }

          .notification-content {
            flex-direction: column;
            gap: 10px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CatalogProducts;