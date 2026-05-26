// api.js - Axios service to call Spring Boot REST APIs
// All backend API calls go through this file

import axios from 'axios';

// Base URL of your Spring Boot backend
// Reads from .env file (VITE_API_BASE_URL) — works locally AND in production
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a new whiteboard room
 * @param {string} username - The creator's username
 * @returns {Promise} - Room data including roomCode
 */
export const createRoom = async (username) => {
  const response = await api.post('/rooms/create', { username });
  return response.data;
};

/**
 * Join an existing room with a room code
 * @param {string} roomCode - The 6-character room code
 * @param {string} username - The joining user's username
 * @returns {Promise} - Room data including members list
 */
export const joinRoom = async (roomCode, username) => {
  const response = await api.post('/rooms/join', { roomCode, username });
  return response.data;
};

/**
 * Get room data (room code + members list)
 * @param {string} roomCode - The room code to fetch
 * @returns {Promise} - Room data
 */
export const getRoomData = async (roomCode) => {
  const response = await api.get(`/rooms/${roomCode}`);
  return response.data;
};

export default api;
