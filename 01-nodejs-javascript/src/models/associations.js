const Account = require('./Account');
const Album = require('./Album');
const Music = require('./Music');
const Playlist = require('./Playlist'); 
const PlaylistMusic = require('./playlistMusic');

// Setup dynamic associations
Account.hasMany(Album, { foreignKey: "accountId" });
Album.belongsTo(Account, { foreignKey: "accountId" });

Account.hasMany(Music, { foreignKey: "accountId" });
Music.belongsTo(Account, { foreignKey: "accountId" });

Account.hasMany(Playlist, { foreignKey: "accountId" });
Playlist.belongsTo(Account, { foreignKey: "accountId" });

Album.hasMany(Music, { foreignKey: 'albumId', as: 'MusicTracks' });
Music.belongsTo(Album, { foreignKey: 'albumId', as: 'AlbumDetails' });

Playlist.belongsToMany(Music, { through: PlaylistMusic, foreignKey: 'playlistId'}); 
Music.belongsToMany(Playlist, { through: PlaylistMusic, foreignKey: 'musicId'}); 

module.exports = { Account, Album, Music, Playlist, PlaylistMusic };
