import Header from './components/layout/header/header';
import Footer from './components/layout/footer/footer';
import SiderBar from './components/layout/sider/sider';
import Content from './components/layout/content/content';
import SongContent from './components/layout/content/songContent';
import './styles/global.css';

function App() {

  return (
    <div>
      <>
        <Header />
        <div className="app-container">
          {/* Sidebar on the left */}
          <SiderBar className="sider-bar" />

          {/* Main content on the right */}
          <div className="main-content">
            <Content className="content" />
            <Footer />
          </div>
        </div>
      </>
    </div>
  );
}

export default App;
