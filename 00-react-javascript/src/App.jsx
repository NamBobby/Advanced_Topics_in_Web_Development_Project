import Header from './components/header';
import Footer from './components/footer';
import SiderBar from './components/sider';
import { Outlet } from 'react-router-dom';
import './global.css';

const MainLayout = () => {
  return (
    <div>
      <Header />
      <div className="app-container">
        {/* Sidebar luôn ở bên trái */}
        <SiderBar className="sider-bar" />

        {/* Main content on the right */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
