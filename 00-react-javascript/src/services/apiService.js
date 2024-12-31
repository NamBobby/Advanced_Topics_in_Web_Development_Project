import axios from './axios.customize';

// User APIs
const createUserApi = async (name, email, password, dateOfBirth, gender) => {
  const URL_API = '/v1/api/register';
  const data = { name, email, password, dateOfBirth, gender };
  return await axios.post(URL_API, data);
};

const LoginApi = async (email, password) => {
  const URL_API = '/v1/api/login';
  const data = { email, password };
  return await axios.post(URL_API, data);
};

const getUserApi = async () => {
  const URL_API = '/v1/api/user';
  return await axios.get(URL_API);
};

const updateUserApi = async (id, userData) => {
  const URL_API = `/v1/api/profile`;
  return await axios.patch(URL_API, userData);
};

const updatePasswordApi = async (id, passwordData) => {
  const URL_API = `/v1/api/password`;
  return await axios.patch(URL_API, passwordData);
};

const getAccountApi = async () => {
  const URL_API = '/v1/api/account';
  return await axios.get(URL_API);
};

const sendOtpApi = async (data) => {
  const URL_API = '/v1/api/sendotp';
  return await axios.post(URL_API, data);
};

const verifyOtpApi = async (otpData) => {
  const URL_API = '/v1/api/verifyotp';
  return await axios.post(URL_API, otpData);
};

const followApi = async (data) => {
  const URL_API = "/v1/api/follow";
  return await axios.post(URL_API, data);
};

const getFollowedItemsApi = async () => {
  const URL_API = "/v1/api/followed-items";
  return await axios.get(URL_API);
};

const unfollowApi = async (data) => {
  const URL_API = "/v1/api/unfollow";
  return await axios.post(URL_API, data);
};

// Playlist APIs
const createPlaylistApi = async (playlistData) => {
  const URL_API = '/v1/api/create-playlist';
  return await axios.post(URL_API, playlistData);
};

const getPlaylistsApi = async () => {
  const URL_API = '/v1/api/playlists';
  return await axios.get(URL_API);
};

const addMusicToPlaylistApi = async (data) => {
  const URL_API = '/v1/api/add-music-to-playlist';
  return await axios.post(URL_API, data);
};

const removeMusicFromPlaylistApi = async (data) => {
  const URL_API = '/v1/api/remove-music-from-playlist';
  return await axios.post(URL_API, data);
};

const deletePlaylistApi = async (id) => {
  const URL_API = `/v1/api/delete-playlist/${id}`;
  return await axios.delete(URL_API);
};

const getMusicInPlaylistApi = async (data) => {
  const URL_API = '/v1/api/playlists/music';
  return await axios.post(URL_API, data);
};

// Music APIs
const getMusicsApi = async () => {
  const URL_API = '/v1/api/musics';
  return await axios.get(URL_API);
};

// Album APIs
const getAlbumsApi = async () => {
  const URL_API = '/v1/api/albums';
  return await axios.get(URL_API);
};

const createAlbumApi = async (albumData) => {
  const URL_API = '/v1/api/create-album';
  return await axios.post(URL_API, albumData);
};

const addMusicToAlbumApi = async (data) => {
  const URL_API = '/v1/api/add-music-to-album';
  return await axios.post(URL_API, data);
};

const removeMusicFromAlbumApi = async (data) => {
  const URL_API = '/v1/api/remove-music-from-album';
  return await axios.post(URL_API, data);
};

const deleteAlbumApi = async (id) => {
  const URL_API = `/v1/api/delete-album/${id}`;
  return await axios.delete(URL_API);
};

const getUserAlbumsApi = async () => {
  const URL_API = '/v1/api/albums/artist';
  return await axios.post(URL_API);
};

const getMusicInAlbumApi = async (data) => {
  const URL_API = '/v1/api/albums/music'; 
  return await axios.post(URL_API, data); 
};

// Search API
const searchAllApi = async (query) => {
  const URL_API = '/v1/api/search/music';
  return await axios.post(URL_API, { searchTerm: query });
};


// Artist APIs
const uploadMusicApi = async (musicData) => {
  const URL_API = '/v1/api/upload-music';
  return await axios.post(URL_API, musicData);
};

const deleteMusicApi = async (id) => {
  const URL_API = `/v1/api/music/${id}`;
  return await axios.delete(URL_API);
};

// Admin APIs
const createUserByAdminApi = async (data) => {
  const URL_API = '/v1/api/createuser';
  return await axios.post(URL_API, data);
};

const deleteAccountApi = async (data) => {
  const URL_API = '/v1/api/deleteaccount';
  return await axios.post(URL_API, data);
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
  followApi, 
  getFollowedItemsApi,
  unfollowApi,

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
  getAlbumsApi,
  createAlbumApi,
  addMusicToAlbumApi,
  removeMusicFromAlbumApi,
  deleteAlbumApi,
  getUserAlbumsApi,
  getMusicInAlbumApi,

  // Search API
  searchAllApi,

  // Admin APIs
  createUserByAdminApi,
  deleteAccountApi,
};
