require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const owner = "NamBobby";
const repo = "music-streaming-file";
const branch = "main";

const uploadToGitHub = async (fileContent, path) => {
  try {
    const { Octokit } = await import("@octokit/rest");

    const octokit = new Octokit({
      auth: process.env.TOKEN,
    });

    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Upload file ${path}`,
      content: fileContent.toString("base64"),
      branch,
    });
    return response.data.content.html_url.replace("blob", "raw");
  } catch (error) {
    console.error("Error uploading to GitHub:", error);
    throw new Error("Failed to upload file to GitHub");
  }
};

const deleteFromGitHub = async (path) => {
  try {
    const { Octokit } = await import("@octokit/rest");

    const octokit = new Octokit({
      auth: process.env.TOKEN,
    });

    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    await octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message: `Delete file ${path}`,
      sha: response.data.sha,
      branch,
    });
  } catch (error) {
    console.error("Error deleting from GitHub:", error);
    throw new Error("Failed to delete file from GitHub");
  }
};

module.exports = {
  uploadToGitHub,
  deleteFromGitHub,
  uuidv4,
};
