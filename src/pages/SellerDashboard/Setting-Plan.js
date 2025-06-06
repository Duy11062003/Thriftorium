import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPlan = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState('settings/plan');
  const [expandedSubmenus, setExpandedSubmenus] = useState({ settings: true });
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    showWelcomeNotification();
  }, []);

  const showWelcomeNotification = () => {
    showNotification('Plan settings loaded successfully!');
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
        navigate('/productscatalog');
        break;
      case 'catalog/categories':
        break;
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

  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
  };

  const handleUpgrade = () => {
    if (selectedPlan === 'basic') {
      showNotification('You are already on the Basic plan!');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmUpgrade = () => {
    setIsUpgrading(true);
    setShowConfirmModal(false);
    
    // Simulate upgrade process
    setTimeout(() => {
      setIsUpgrading(false);
      showNotification('Successfully upgraded to Premium plan!', 4000);
    }, 2000);
  };

  const cancelUpgrade = () => {
    setShowConfirmModal(false);
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$14',
      period: 'month',
      current: true,
      features: [
        'Up to 20 products',
        'Basic analytics',
        'Email support',
        'Standard templates',
        '1 GB storage'
      ],
      limitations: [
        'Limited customization',
        'Basic SEO tools',
        'Advertising support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$29',
      period: '/month',
      current: false,
      popular: true,
      features: [
        'Unlimited products',
        'Advanced analytics',
        'Priority support',
        'Premium templates',
        '10 GB storage',
        'Custom domain',
        'Advanced SEO tools',
        'Marketing automation',
        'Inventory management',
        'Multi-currency support'
      ],
      limitations: []
    }
  ];

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
        <div className="plan-container">
          {/* Header */}
          <div className="plan-header">
            <h1>Plan Upgrade</h1>
            <p>Choose the plan that best fits your business needs</p>
          </div>

          {/* Plans Grid */}
          <div className="plans-grid">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.current ? 'current' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                {plan.current && <div className="current-badge">Current Plan</div>}
                
                <div className="plan-header-info">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                </div>

                <div className="plan-features">
                  <h4>Features included:</h4>
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div className="plan-limitations">
                    <h4>Limitations:</h4>
                    <ul>
                      {plan.limitations.map((limitation, index) => (
                        <li key={index}>
                          <span className="cross-icon">×</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="plan-actions">
            <button 
              className="upgrade-btn"
              onClick={handleUpgrade}
              disabled={isUpgrading}
            >
              {isUpgrading ? 'Upgrading...' : selectedPlan === 'basic' ? 'Current Plan' : 'Upgrade to Premium'}
            </button>
          </div>

          {/* Plan Comparison */}
          <div className="plan-comparison">
            <h2>Why upgrade to Premium?</h2>
            <div className="comparison-grid">
              <div className="comparison-item">
                <span className="comparison-icon">🚀</span>
                <h3>Unlimited Products</h3>
                <p>Expand your catalog without limits and grow your business</p>
              </div>
              <div className="comparison-item">
                <span className="comparison-icon">📊</span>
                <h3>Advanced Analytics</h3>
                <p>Get detailed insights into sales, customers, and performance</p>
              </div>
              <div className="comparison-item">
                <span className="comparison-icon">💎</span>
                <h3>Premium Support</h3>
                <p>Priority customer support with faster response times</p>
              </div>
              <div className="comparison-item">
                <span className="comparison-icon">🎨</span>
                <h3>Custom Branding</h3>
                <p>Use your own domain and customize your store design</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Plan Upgrade</h3>
            <p>Are you sure you want to upgrade to the Premium plan for $29/month?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={cancelUpgrade}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmUpgrade}>
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

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
        }

        .plan-container {
          padding: 30px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .plan-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .plan-header h1 {
          margin: 0 0 10px 0;
          font-size: 2.2rem;
          color: #333;
          font-weight: 600;
        }

        .plan-header p {
          margin: 0;
          font-size: 1.1rem;
          color: #666;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .plan-card {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .plan-card:hover {
          border-color: #4a90e2;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(74, 144, 226, 0.15);
        }

        .plan-card.selected {
          border-color: #4a90e2;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }

        .plan-card.current {
          border-color: #28a745;
          background: #f8fff9;
        }

        .popular-badge, .current-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
        }

        .popular-badge {
          background: #ff6b35;
        }

        .current-badge {
          background: #28a745;
        }

        .plan-header-info {
          text-align: center;
          margin-bottom: 30px;
        }

        .plan-header-info h3 {
          margin: 0 0 15px 0;
          font-size: 1.8rem;
          color: #333;
          font-weight: 600;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 5px;
        }

        .price {
          font-size: 2.5rem;
          font-weight: 700;
          color: #4a90e2;
        }

        .period {
          font-size: 1rem;
          color: #666;
        }

        .plan-features {
          margin-bottom: 20px;
        }

        .plan-features h4, .plan-limitations h4 {
          margin: 0 0 15px 0;
          font-size: 1.1rem;
          color: #333;
          font-weight: 600;
        }

        .plan-features ul, .plan-limitations ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .plan-features li, .plan-limitations li {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .check-icon {
          color: #28a745;
          font-weight: bold;
          margin-right: 10px;
          font-size: 1.2rem;
        }

        .cross-icon {
          color: #dc3545;
          font-weight: bold;
          margin-right: 10px;
          font-size: 1.2rem;
        }

        .plan-limitations {
          border-top: 1px solid #e9ecef;
          padding-top: 20px;
        }

        .plan-actions {
          text-align: center;
          margin-bottom: 50px;
        }

        .upgrade-btn {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
          min-width: 200px;
        }

        .upgrade-btn:hover:not(:disabled) {
          background: #357abd;
        }

        .upgrade-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .plan-comparison {
          background: #f8f9fa;
          padding: 40px;
          border-radius: 12px;
          text-align: center;
        }

        .plan-comparison h2 {
          margin: 0 0 40px 0;
          font-size: 1.8rem;
          color: #333;
          font-weight: 600;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .comparison-item {
          background: white;
          padding: 30px 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .comparison-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 15px;
        }

        .comparison-item h3 {
          margin: 0 0 10px 0;
          font-size: 1.2rem;
          color: #333;
          font-weight: 600;
        }

        .comparison-item p {
          margin: 0;
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .modal h3 {
          margin: 0 0 15px 0;
          font-size: 1.5rem;
          color: #333;
          font-weight: 600;
        }

        .modal p {
          margin: 0 0 30px 0;
          color: #666;
          font-size: 1rem;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .cancel-btn, .confirm-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
        }

        .cancel-btn {
          background: #f8f9fa;
          color: #666;
          border: 1px solid #ddd;
        }

        .cancel-btn:hover {
          background: #e9ecef;
        }

        .confirm-btn {
          background: #4a90e2;
          color: white;
        }

        .confirm-btn:hover {
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

          .plan-container {
            padding: 20px 15px;
          }

          .plan-header h1 {
            font-size: 1.8rem;
          }

          .plans-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .plan-card {
            padding: 20px;
          }

          .comparison-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .plan-comparison {
            padding: 30px 20px;
          }

          .modal {
            margin: 20px;
            padding: 25px;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsPlan;