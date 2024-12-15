import axios from './axios.customize';

// User APIs
const createUserApi = (name, email, password) => {
  const URL_API = '/v1/api/register';
  const data = {
    name,
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const LoginApi = (email, password) => {
  const URL_API = '/v1/api/login';
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = '/v1/api/user'; 
  return axios.get(URL_API);
};

// Music APIs
const getMusicsApi = () => {
  const URL_API = '/v1/api/musics';
  return axios.get(URL_API);
};

// Album APIs
const getUserAlbumsApi = () => {
  const URL_API = '/v1/api/albums/artist';
  return axios.post(URL_API);
};

// Playlist APIs
const getPlaylistsApi = () => {
  const URL_API = '/v1/api/playlists';
  return axios.get(URL_API);
};

export {
  createUserApi,
  LoginApi,
  getUserApi,
  getMusicsApi,
  getUserAlbumsApi,
  getPlaylistsApi
};
