import Header from './components/header';
import Footer from './components/footer';
import SiderBar from './components/sider';
import { Outlet } from 'react-router-dom';
import './global.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <div className="app-container">
        <SiderBar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
