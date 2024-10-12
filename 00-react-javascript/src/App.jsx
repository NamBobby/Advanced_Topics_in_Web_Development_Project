import { useContext, useEffect } from 'react'
import axios from './util/axios.customize';
import Header from './components/layout/header';
import { Outlet } from 'react-router-dom';
import { AuthContext } from './components/layout/context/auth.context';
import { Spin } from 'antd';


function App() {

  const {setAuth, appLoading, setAppLoading} = useContext(AuthContext);
  useEffect(() => {
    const fetchAccount = async() => {
      setAppLoading(true);
      const res = await axios.get(`/v1/api/account`);
      if(res && !res.message) {
        setAuth({
          isAuthenticated: true,
          user: {
          email: res.email,
          name: res.name
          }
        })
      }
      setAppLoading(false);
    }

    fetchAccount()
  }, [])

  return (
    <div>
      {appLoading === true ?
        <div style={{
          position: 'fixed',
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}>
          <Spin></Spin>
        </div>
        :
        <>
          <Header/>
          <Outlet/>
        </>
      }
    </div>
  )
}

export default App
