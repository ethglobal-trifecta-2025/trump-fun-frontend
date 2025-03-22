'use client';

// Helper to manage local storage for comment likes persistence
export const LIKED_COMMENTS_KEY = 'trump_fun_liked_comments';

// Save a liked comment to local storage
export const saveCommentLike = (commentId: number, liked: boolean) => {
  try {
    // Get current liked comments
    const currentLikedStr = localStorage.getItem(LIKED_COMMENTS_KEY);
    let likedComments: Record<number, boolean> = {};

    if (currentLikedStr) {
      try {
        likedComments = JSON.parse(currentLikedStr);
      } catch (e) {
        console.error('Error parsing liked comments from localStorage:', e);
      }
    }

    // Update the like status
    if (liked) {
      likedComments[commentId] = true;
    } else {
      delete likedComments[commentId];
    }

    // Save back to localStorage
    localStorage.setItem(LIKED_COMMENTS_KEY, JSON.stringify(likedComments));
    return true;
  } catch (e) {
    console.error('Error saving comment like to localStorage:', e);
    return false;
  }
};

// Check if a comment is liked in local storage
export const isCommentLiked = (commentId: number): boolean => {
  try {
    const currentLikedStr = localStorage.getItem(LIKED_COMMENTS_KEY);
    if (!currentLikedStr) return false;

    const likedComments = JSON.parse(currentLikedStr);
    return Boolean(likedComments[commentId]);
  } catch (e) {
    console.error('Error checking comment like status from localStorage:', e);
    return false;
  }
};

// Get all liked comments
export const getAllLikedComments = (): Record<number, boolean> => {
  try {
    const currentLikedStr = localStorage.getItem(LIKED_COMMENTS_KEY);
    if (!currentLikedStr) return {};

    return JSON.parse(currentLikedStr);
  } catch (e) {
    console.error('Error getting all liked comments from localStorage:', e);
    return {};
  }
};
