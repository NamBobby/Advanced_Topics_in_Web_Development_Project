import React, { useState, useEffect } from "react";
import { followApi, unfollowApi, getFollowedItemsApi } from "../services/apiService";
import "../assets/styles/followButton.css"; 

const FollowButton = ({ followType, followId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowApi({ followType, followId });
        setIsFollowing(false);
      } else {
        await followApi({ followType, followId });
        setIsFollowing(true);
      }

      const response = await getFollowedItemsApi();
      const isFollowed = response.followedItems.some((item) => {
        if (followType === "Artist") {
          return item.followType === "Artist" && item.artistId === followId;
        } else if (followType === "Album") {
          return item.followType === "Album" && item.albumId === followId;
        }
        return false;
      });
      setIsFollowing(isFollowed);

      window.dispatchEvent(new CustomEvent("authUpdate"));
    } catch (error) {
      console.error("Error toggling follow:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await getFollowedItemsApi();
        console.log("Followed Items Response:", response.followedItems);
        const isFollowed = response.followedItems.some((item) => {
          if (followType === "Artist") {
            return item.followType === "Artist" && item.artistId === followId;
          } else if (followType === "Album") {
            return item.followType === "Album" && item.albumId === followId;
          }
          return false;
        });
        setIsFollowing(isFollowed);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    if (followId) {
      fetchFollowStatus();
    } else {
      console.warn("Follow ID is undefined:", { followType, followId });
    }
  }, [followType, followId]);

  if (!followId) {
    return null; 
  }

  return (
    <div
      className={`follow-button ${isFollowing ? "following" : "follow"}`}
      onClick={handleFollowToggle}
    >
      {isFollowing ? "Following" : "Follow"}
    </div>
  );
};

export default FollowButton;
