const { User, Artist, Administrator, Account } = require("./account");
const Album = require("./album");
const Music = require("./music");
const Playlist = require("./playlist");
const PlaylistMusic = require("./playlistMusic");
const UserFollow = require("./userFollow");
const UserOTPVerification = require("./userOTPVerification");

Account.hasOne(User, { foreignKey: "accountId" });
Account.hasOne(Artist, { foreignKey: "accountId" });
Account.hasOne(Administrator, { foreignKey: "accountId" });

User.belongsTo(Account, { foreignKey: "accountId" });
Artist.belongsTo(Account, { foreignKey: "accountId" });
Administrator.belongsTo(Account, { foreignKey: "accountId" });

// UserFollow associations
Account.hasMany(UserFollow, { foreignKey: "accountId", onDelete: "CASCADE" });
UserFollow.belongsTo(Account, { foreignKey: "accountId", onDelete: "CASCADE" });

Account.hasMany(UserFollow, { foreignKey: "artistId", constraints: false });
UserFollow.belongsTo(Account, { foreignKey: "artistId", constraints: false });

Album.hasMany(UserFollow, { foreignKey: "albumId", constraints: false });
UserFollow.belongsTo(Album, { foreignKey: "albumId", constraints: false });

// Associations for Administrator (No additional associations)

// Associations for Artist
Artist.hasMany(Music, { foreignKey: "artistId", onDelete: "CASCADE" });
Music.belongsTo(Artist, { foreignKey: "artistId", onDelete: "CASCADE" });

Artist.hasMany(Album, { foreignKey: "artistId", onDelete: "CASCADE" });
Album.belongsTo(Artist, { foreignKey: "artistId", onDelete: "CASCADE" });

Artist.hasMany(Playlist, { foreignKey: "accountId", onDelete: "CASCADE" });
Playlist.belongsTo(Artist, { foreignKey: "accountId", onDelete: "CASCADE" });

// Associations for User
User.hasMany(Playlist, { foreignKey: "accountId", onDelete: "CASCADE" });
Playlist.belongsTo(User, { foreignKey: "accountId", onDelete: "CASCADE" });


// Associations for Music with Album and Playlist
Album.hasMany(Music, { foreignKey: "albumId", as: "MusicTracks" });
Music.belongsTo(Album, { foreignKey: "albumId", as: "AlbumDetails" });

Playlist.belongsToMany(Music, {
  through: PlaylistMusic,
  foreignKey: "playlistId",
});
Music.belongsToMany(Playlist, {
  through: PlaylistMusic,
  foreignKey: "musicId",
});

// Associations for OTP Verification
Account.hasMany(UserOTPVerification, { foreignKey: "accountId" , onDelete: "CASCADE"});
UserOTPVerification.belongsTo(Account, { foreignKey: "accountId" , onDelete: "CASCADE"});

module.exports = {
  User,
  Artist,
  Administrator,
  Account,
  Album,
  Music,
  Playlist,
  PlaylistMusic,
  UserFollow,
  UserOTPVerification,
};
