// src/utils/token.js
export const validateToken = (token) => {
  if (!token) return false;

  // Check if it's a JWT (should have 3 parts separated by dots)
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    // Try to decode the payload
    const payload = JSON.parse(atob(parts[1]));

    // Check if it has required fields
    if (!payload.userId || !payload.exp) return false;

    // Check expiration
    if (Date.now() >= payload.exp * 1000) return false;

    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

export const decodeToken = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
};
