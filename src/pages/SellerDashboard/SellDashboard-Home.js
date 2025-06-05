import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    storeViews: 0,
    orderCount: 0
  });
  
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [expandedSubmenus, setExpandedSubmenus] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    // Initialize stats with animation
    animateStats();
    showWelcomeNotification();
    updateGreeting();
  }, []);

  const animateStats = () => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalSales: 1250,
        totalOrders: 45,
        storeViews: 1876,
        orderCount: 12
      });
    }, 500);
  };

  const showWelcomeNotification = () => {
    showNotification('Welcome to Thriftorium! Your store is ready.');
  };

  const showNotification = (message, duration = 3000) => {
    // Create notification element
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

    // Show notification
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 100);

    // Hide notification
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

  const updateGreeting = () => {
    const hours = new Date().getHours();
    let timeGreeting;

    if (hours < 12) {
      timeGreeting = 'Good morning';
    } else if (hours < 17) {
      timeGreeting = 'Good afternoon';
    } else {
      timeGreeting = 'Good evening';
    }

    return `${timeGreeting}, Toko Baju Saya!`;
  };

  const handleNavigation = (routeName) => {
    setActiveNavItem(routeName);
    
    // Handle internal navigation within dashboard
    switch(routeName) {
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
      case 'catalog/categories':
        showNotification('Opening Catalog...');
        break;
      case 'settings':
      case 'settings/plan':
        showNotification('Opening Plan Upgrade...');
        break;
      case 'settings/delivery':
        showNotification('Opening Delivery Settings...');
        break;
      case 'settings/payment':
        showNotification('Opening Payment Settings...');
        break;
      case 'settings/account':
        // Navigate to My Shop page
        navigate('/myshop');
        break;
      default:
        setActiveNavItem('home');
    }
  };

  const toggleSubmenu = (menuKey) => {
    setExpandedSubmenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleTaskToggle = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleSetupClick = (type) => {
    const messages = {
      delivery: 'Setting up delivery method...',
      products: 'Adding new products...',
      bank: 'Setting up bank account...',
      general: 'Opening setup...'
    };
    
    showNotification(messages[type] || messages.general);
  };

  const handleButtonClick = (action) => {
    switch(action) {
      case 'preview':
        showNotification('Opening store preview...');
        break;
      case 'share':
        showNotification('Generating store share link...');
        break;
      case 'orders':
        handleNavigation('orders');
        break;
      case 'products':
        handleNavigation('catalog');
        break;
      default:
        showNotification(`${action} clicked`);
    }
  };

  return (
    <div className="seller-dashboard">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Thriftorium</h2>
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
                <span>🛍️</span> Catalog
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
            <li className={`nav-item ${activeNavItem === 'settings' ? 'active' : ''}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu('settings'); }}>
                <span>⚙️</span> Settings
                <span className={`expand-arrow ${expandedSubmenus.settings ? 'expanded' : ''}`}>▶</span>
              </a>
              {expandedSubmenus.settings && (
                <ul className="submenu">
                  <li className="submenu-item">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('settings/plan'); }}>
                      Plan upgrade
                    </a>
                  </li>
                  <li className="submenu-item">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('settings/delivery'); }}>
                      Delivery Settings
                    </a>
                  </li>
                  <li className="submenu-item">
                    <a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('settings/payment'); }}>
                      Payment Settings
                    </a>
                  </li>
                  <li className="submenu-item">
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
        <header className="dashboard-header">
          <h1 className="greeting">{updateGreeting()}</h1>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => handleButtonClick('preview')}>
              Preview Store
            </button>
            <button className="btn btn-secondary" onClick={() => handleButtonClick('share')}>
              Share Store Link
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Sales</h3>
              <p className="stat-number" id="totalSales">${stats.totalSales}</p>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-number" id="totalOrders">{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Store Views</h3>
              <p className="stat-number" id="storeViews">{stats.storeViews}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Orders</h3>
              <p className="stat-number" id="orderCount">{stats.orderCount}</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <div className="action-card" onClick={() => handleButtonClick('orders')}>
              <span>📦</span>
              <h3>View Orders</h3>
              <p>Manage your recent orders</p>
            </div>
            <div className="action-card" onClick={() => handleButtonClick('products')}>
              <span>🛍️</span>
              <h3>Manage Products</h3>
              <p>Add or edit your products</p>
            </div>
          </div>
        </section>

        {/* Setup Tasks */}
        <section className="setup-section">
          <h2>Store Setup</h2>
          <div className="setup-tasks">
            <div className="setup-item" onClick={() => handleSetupClick('delivery')}>
              <span className={`task-icon ${completedTasks.delivery ? 'checked' : ''}`} 
                    onClick={(e) => { e.stopPropagation(); handleTaskToggle('delivery'); }}>
                ✓
              </span>
              <div>
                <h4>Set up delivery method</h4>
                <p>Configure how you'll deliver products to customers</p>
              </div>
            </div>
            <div className="setup-item" onClick={() => handleSetupClick('products')}>
              <span className={`task-icon ${completedTasks.products ? 'checked' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleTaskToggle('products'); }}>
                ✓
              </span>
              <div>
                <h4>Add your first products</h4>
                <p>Start by adding some products to your catalog</p>
              </div>
            </div>
            <div className="setup-item" onClick={() => handleSetupClick('bank')}>
              <span className={`task-icon ${completedTasks.bank ? 'checked' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleTaskToggle('bank'); }}>
                ✓
              </span>
              <div>
                <h4>Set up bank account</h4>
                <p>Connect your bank account for payments</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .seller-dashboard {
          display: flex;
          min-height: 100vh;
          background-color: #f5f5f5;
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
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #4a90e2;
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
        }

        .nav-item:hover a,
        .nav-item.active a {
          background: #4a90e2;
          color: white;
        }

        .nav-item span:first-child {
          margin-right: 10px;
        }

        .expand-arrow {
          transition: transform 0.3s ease;
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
          font-size: 0.9rem;
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

        .greeting {
          font-size: 2rem;
          margin: 0;
          color: #333;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #4a90e2;
          color: white;
        }

        .btn-primary:hover {
          background: #357abd;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }

        .stats-section {
          margin-bottom: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 0.9rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #4a90e2;
          margin: 0;
        }

        .quick-actions,
        .setup-section {
          margin-bottom: 30px;
        }

        .quick-actions h2,
        .setup-section h2 {
          margin-bottom: 20px;
          color: #333;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .action-card:hover {
          transform: translateY(-5px);
        }

        .action-card span {
          font-size: 2rem;
          display: block;
          margin-bottom: 10px;
        }

        .action-card h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .action-card p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
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

        .setup-tasks {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .setup-item {
          display: flex;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .setup-item:hover {
          background: #f8f9fa;
        }

        .setup-item:last-child {
          border-bottom: none;
        }

        .task-icon {
          width: 30px;
          height: 30px;
          border: 2px solid #ddd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: transparent;
        }

        .task-icon.checked {
          background: #4a90e2;
          border-color: #4a90e2;
          color: white;
        }

        .setup-item h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .setup-item p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .seller-dashboard {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
          }
          
          .dashboard-header {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }
          
          .stats-grid,
          .action-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SellerHome;