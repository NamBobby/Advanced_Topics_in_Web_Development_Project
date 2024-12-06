import Content from '../../components/content';
import Artist from '../../components/artist';
import '../../assets/styles/home.css'
import Album from '../../components/album';

const HomePage = () => {
  return (
    <div>
      <h2 className="title">Popular Music</h2>
      <Content />
      <h2 className="title">Popular artists</h2>
      <Artist />
      <h2 className="title">Popular Album</h2>
      <Album />
    </div>
  );
};

export default HomePage;
