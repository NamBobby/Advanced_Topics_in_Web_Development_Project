import axios from './axios.customize';

// User APIs
const createUserApi = (name, email, password) => {
  const URL_API = '/v1/api/register';
  const data = { name, email, password };
  return axios.post(URL_API, data);
};

const LoginApi = (email, password) => {
  const URL_API = '/v1/api/login';
  const data = { email, password };
  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = '/v1/api/user';
  return axios.get(URL_API);
};

const updateUserApi = (id, userData) => {
  const URL_API = `/v1/api/profile`;
  return axios.patch(URL_API, userData);
};

const updatePasswordApi = (id, passwordData) => {
  const URL_API = `/v1/api/password`;
  return axios.patch(URL_API, passwordData);
};

const getAccountApi = () => {
  const URL_API = '/v1/api/account';
  return axios.get(URL_API);
};

const sendOtpApi = () => {
  const URL_API = '/v1/api/sendotp';
  return axios.post(URL_API);
};

const verifyOtpApi = (otpData) => {
  const URL_API = '/v1/api/verifyotp';
  return axios.post(URL_API, otpData);
};

const sendEmailApi = (emailData) => {
  const URL_API = '/v1/api/sendemail';
  return axios.post(URL_API, emailData);
};

// Playlist APIs
const createPlaylistApi = (playlistData) => {
  const URL_API = '/v1/api/create-playlist';
  return axios.post(URL_API, playlistData);
};

const getPlaylistsApi = () => {
  const URL_API = '/v1/api/playlists';
  return axios.get(URL_API);
};

const addMusicToPlaylistApi = (data) => {
  const URL_API = '/v1/api/add-music-to-playlist';
  return axios.post(URL_API, data);
};

const removeMusicFromPlaylistApi = (data) => {
  const URL_API = '/v1/api/remove-music-from-playlist';
  return axios.post(URL_API, data);
};

const deletePlaylistApi = (id) => {
  const URL_API = `/v1/api/delete-playlist/${id}`;
  return axios.delete(URL_API);
};

const getMusicInPlaylistApi = (data) => {
  const URL_API = '/v1/api/playlists/music';
  return axios.post(URL_API, data);
};

// Music APIs
const getMusicsApi = () => {
  const URL_API = '/v1/api/musics';
  return axios.get(URL_API);
};

// Album APIs
const createAlbumApi = (albumData) => {
  const URL_API = '/v1/api/create-album';
  return axios.post(URL_API, albumData);
};

const addMusicToAlbumApi = (data) => {
  const URL_API = '/v1/api/add-music-to-album';
  return axios.post(URL_API, data);
};

const removeMusicFromAlbumApi = (data) => {
  const URL_API = '/v1/api/remove-music-from-album';
  return axios.post(URL_API, data);
};

const deleteAlbumApi = (id) => {
  const URL_API = `/v1/api/delete-album/${id}`;
  return axios.delete(URL_API);
};

const getUserAlbumsApi = () => {
  const URL_API = '/v1/api/albums/artist';
  return axios.post(URL_API);
};

const getMusicInAlbumApi = (data) => {
  const URL_API = '/v1/api/albums/music';
  return axios.post(URL_API, data);
};

// Search API
const searchMusicApi = (query) => {
  const URL_API = '/v1/api/search/music';
  return axios.post(URL_API, query);
};

// Artist APIs
const uploadMusicApi = (musicData) => {
  const URL_API = '/v1/api/upload-music';
  return axios.post(URL_API, musicData);
};

const deleteMusicApi = (id) => {
  const URL_API = `/v1/api/music/${id}`;
  return axios.delete(URL_API);
};

// Admin APIs
const createUserByAdminApi = (data) => {
  const URL_API = '/v1/api/createuser';
  return axios.post(URL_API, data);
};

const deleteAccountApi = (data) => {
  const URL_API = '/v1/api/deleteaccount';
  return axios.post(URL_API, data);
};

export {
  // User APIs
  createUserApi,
  LoginApi,
  getUserApi,
  updateUserApi,
  updatePasswordApi,
  getAccountApi,
  sendOtpApi,
  verifyOtpApi,
  sendEmailApi,

  // Playlist APIs
  createPlaylistApi,
  getPlaylistsApi,
  addMusicToPlaylistApi,
  removeMusicFromPlaylistApi,
  deletePlaylistApi,
  getMusicInPlaylistApi,

  // Music APIs
  getMusicsApi,
  uploadMusicApi,
  deleteMusicApi,

  // Album APIs
  createAlbumApi,
  addMusicToAlbumApi,
  removeMusicFromAlbumApi,
  deleteAlbumApi,
  getUserAlbumsApi,
  getMusicInAlbumApi,

  // Search API
  searchMusicApi,

  // Admin APIs
  createUserByAdminApi,
  deleteAccountApi,
};
