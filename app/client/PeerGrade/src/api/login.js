// src/api/login.js

export const loginUser = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }
  
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  