import Header from './components/header';
import Footer from './components/footer';
import SiderBar from './components/sider';
import Content from './components/content';
import SongContent from './components/songContent';
import './global.css';

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