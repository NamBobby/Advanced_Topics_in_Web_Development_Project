const fs = require("fs").promises;
const path = require("path"); 

const deleteOldAvatar = async (avatarPath) => {
  try {
    const normalizedPath = avatarPath.startsWith("src/")
      ? avatarPath.replace("src/", "")
      : avatarPath;

    const oldAvatarPath = path.join(__dirname, "..", normalizedPath);

    await fs.access(oldAvatarPath); 
    await fs.unlink(oldAvatarPath); 
  } catch (error) {
    console.warn(`Failed to delete old avatar: ${error.message}`);
  }
};

module.exports = { deleteOldAvatar };
