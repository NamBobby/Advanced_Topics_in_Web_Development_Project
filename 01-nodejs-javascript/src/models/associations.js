const User = require('./user');
const Album = require('./album');
const Music = require('./music');
const Playlist = require('./playlist'); 
const PlaylistMusic = require('./playlistMusic');
const UserFollow = require('./userFollow');

// Setup dynamic associations
User.hasMany(Album, { foreignKey: "accountId" });
Album.belongsTo(User, { foreignKey: "accountId" });

User.hasMany(Music, { foreignKey: "accountId" });
Music.belongsTo(User, { foreignKey: "accountId" });

User.hasMany(Playlist, { foreignKey: "accountId" });
Playlist.belongsTo(User, { foreignKey: "accountId" });

Album.hasMany(Music, { foreignKey: 'albumId', as: 'MusicTracks' });
Music.belongsTo(Album, { foreignKey: 'albumId', as: 'AlbumDetails' });

Playlist.belongsToMany(Music, { through: PlaylistMusic, foreignKey: 'playlistId'}); 
Music.belongsToMany(Playlist, { through: PlaylistMusic, foreignKey: 'musicId'}); 

User.hasMany(UserFollow, { foreignKey: "userId" });
UserFollow.belongsTo(User, { foreignKey: "userId" });

Album.hasMany(UserFollow, { foreignKey: "followId", constraints: false });
UserFollow.belongsTo(Album, { foreignKey: "followId", constraints: false });

module.exports = { User, Album, Music, Playlist, PlaylistMusic, UserFollow };
