// websocket.js - WebSocket service to connect to Spring Boot WebSocket
// Handles real-time drawing communication

// WebSocket URL of your Spring Boot backend
// Reads from .env file (VITE_WS_URL) — works locally AND in production
// Note: use wss:// in production (secure WebSocket), ws:// locally
const configuredWsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/drawing';

const resolveWebSocketUrl = (url) => {
  if (url.startsWith('ws://') || url.startsWith('wss://')) {
    return url;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}${url.startsWith('/') ? url : `/${url}`}`;
};

const WS_URL = resolveWebSocketUrl(configuredWsUrl);

let socket = null; // The WebSocket connection
let onMessageCallback = null; // Function called when a drawing message arrives

/**
 * Connect to the Spring Boot WebSocket server
 * @param {function} onMessage - Callback function called when drawing data is received
 */
export const connectWebSocket = (onMessage) => {
  // Store the callback
  onMessageCallback = onMessage;

  // Create WebSocket connection
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('WebSocket connected to Spring Boot!');
  };

  socket.onmessage = (event) => {
    // Parse incoming drawing message
    const data = JSON.parse(event.data);
    // Call the callback with the drawing data
    if (onMessageCallback) {
      onMessageCallback(data);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };
};

/**
 * Send a drawing message to Spring Boot (which broadcasts to all users in room)
 * @param {object} drawingData - Drawing coordinates, color, roomCode, etc.
 */
export const sendDrawing = (drawingData) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(drawingData));
  }
};

/**
 * Disconnect the WebSocket (call when user leaves the whiteboard)
 */
export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export default { connectWebSocket, sendDrawing, disconnectWebSocket };
