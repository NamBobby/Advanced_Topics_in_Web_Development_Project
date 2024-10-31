const Account = require('./Account'); 
const Album = require('./Album');
const Music = require('./Music');

// Setup dynamic associations
Album.hasMany(Music, { foreignKey: 'albumRef', as: 'MusicTracks' });
Music.belongsTo(Album, { foreignKey: 'albumRef', as: 'AlbumDetails' });

module.exports = { Account, Album, Music };
