const API_BASE_URL = 'http://localhost:5001/api';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signupUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Logout failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/createItem`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create item');
    }

    return await response.json();
  } catch (error) {
    console.error('Create item error:', error);
    throw error;
  }
};

export const getItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/items/getItems`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch items');
    }

    return await response.json();
  } catch (error) {
    console.error('Get items error:', error);
    throw error;
  }
};

export const getConversations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/users`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch conversations');
    }

    return await response.json();
  } catch (error) {
    console.error('Get conversations error:', error);
    throw error;
  }
};

export const getMessages = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/${userId}`, {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch messages');
    }

    return await response.json();
  } catch (error) {
    console.error('Get messages error:', error);
    throw error;
  }
};

export const sendMessage = async (receiverId, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/send/${receiverId}`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

export const startItemConversation = async (itemId, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/item/${itemId}`, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      credentials: 'include',
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to start conversation');
    }

    return await response.json();
  } catch (error) {
    console.error('Start conversation error:', error);
    throw error;
  }
}; 