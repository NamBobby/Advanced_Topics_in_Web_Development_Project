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
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await getFollowedItemsApi();
        const isFollowed = response.followedItems.some(
          (item) => item.followType === followType && item.followId === followId
        );
        setIsFollowing(isFollowed);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };
    fetchFollowStatus();
  }, [followType, followId]);
  

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
