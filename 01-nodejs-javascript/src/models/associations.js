const { User, Artist, Administrator, Account } = require("./account");
const Album = require("./album");
const Music = require("./music");
const Playlist = require("./playlist");
const PlaylistMusic = require("./playlistMusic");
const UserFollow = require("./userFollow");
const UserOTPVerification = require("./userOTPVerification");

Account.hasOne(User, {
  foreignKey: { name: "accountId", allowNull: false, unique: true },
  onDelete: "CASCADE",
});
User.belongsTo(Account, {
  foreignKey: { name: "accountId", allowNull: false },
  onDelete: "CASCADE",
});

Account.hasOne(Artist, {
  foreignKey: { name: "accountId", allowNull: false, unique: true },
  onDelete: "CASCADE",
});
Artist.belongsTo(Account, {
  foreignKey: { name: "accountId", allowNull: false },
  onDelete: "CASCADE",
});

Account.hasOne(Administrator, {
  foreignKey: { name: "accountId", allowNull: false, unique: true },
  onDelete: "CASCADE",
});
Administrator.belongsTo(Account, {
  foreignKey: { name: "accountId", allowNull: false },
  onDelete: "CASCADE",
});

// UserFollow associations
Account.hasMany(UserFollow, { foreignKey: "accountId", onDelete: "CASCADE" });
UserFollow.belongsTo(Account, { foreignKey: "accountId", onDelete: "CASCADE" });

Album.hasMany(UserFollow, { foreignKey: "albumId", constraints: false });
UserFollow.belongsTo(Album, { foreignKey: "albumId", constraints: false });

// Associations for Artist
Artist.hasMany(Music, { foreignKey: "accountId", onDelete: "CASCADE" });
Music.belongsTo(Artist, { foreignKey: "accountId", onDelete: "CASCADE" });

Artist.hasMany(Album, { foreignKey: "accountId", onDelete: "CASCADE" });
Album.belongsTo(Artist, { foreignKey: "accountId", onDelete: "CASCADE" });

Account.hasMany(Playlist, { foreignKey: "accountId", onDelete: "CASCADE" });
Playlist.belongsTo(Account, { foreignKey: "accountId", onDelete: "CASCADE" });

Artist.hasMany(UserFollow, {
  foreignKey: { name: "artistId", allowNull: false },
  onDelete: "CASCADE",
});
UserFollow.belongsTo(Artist, {
  foreignKey: { name: "artistId", allowNull: false },
  onDelete: "CASCADE",
});

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
Account.hasMany(UserOTPVerification, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
});
UserOTPVerification.belongsTo(Account, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
});

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
