import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faMobile, faUsers, faUser, faList, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext.jsx';
import './Layout.css';
const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Prevenir scroll quando menu está aberto
  React.useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  return (
    
    <div className="layout">
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">LocaFácil</h1>
          <button className={`menu-toggle ${menuOpen ? 'menu-toggle-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <div className="nav-header">
              <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
              <div className="user-info">
                <div className="user-name">{user?.name || 'Usuário'}</div>
                <div className="user-email">{user?.email || ''}</div>
              </div>
            </div>
            <div className="nav-divider"></div>
            <div className="nav-links">
              {user?.is_admin ? (
                <>
                  <NavLink to="/admin/vehicles" className="nav-link" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faCar} />
                    <span>Veículos</span>
                  </NavLink>
                  <NavLink to="/admin/electronics" className="nav-link" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faMobile} />
                    <span>Eletrônicos</span>
                  </NavLink>
                  <NavLink to="/admin/users" className="nav-link" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Usuários</span>
                  </NavLink>
                  <NavLink to="/profile" className="nav-link" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faUser} />
                    <span>Perfil</span>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/vehicles" className="nav-link" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faCar} />
                    <span>Veículos</span>
                  </NavLink>
                  <NavLink to="/electronics" className="nav-link" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faMobile} />
                    <span>Eletrônicos</span>
                  </NavLink>
                  <NavLink to="/my-rentals" className="nav-link" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faList} />
                    <span>Meus Aluguéis</span>
                  </NavLink>
                  <NavLink to="/profile" className="nav-link" onClick={closeMenu}>
                    <FontAwesomeIcon icon={faUser} />
                    <span>Perfil</span>
                  </NavLink>
                </>
              )}
            </div>
            <div className="nav-footer">
              <button onClick={handleLogout} className="nav-button">
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                <span>Sair</span>
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
