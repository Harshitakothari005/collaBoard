import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../services/api';

/**
 * HomePage - Landing page with username input, create room, and join room
 */
function HomePage() {
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle Create Room button click
   * Calls POST /api/rooms/create via Spring Boot
   */
  const handleCreateRoom = async () => {
    setError('');

    // Basic validation
    if (!username.trim()) {
      setError('Please enter your username first!');
      return;
    }

    setLoading(true);
    try {
      // Call Spring Boot REST API to create room
      const data = await createRoom(username.trim());

      // Navigate to the whiteboard with room info
      navigate('/whiteboard', {
        state: {
          roomCode: data.roomCode,
          username: username.trim(),
          members: data.members,
        },
      });
    } catch (err) {
      setError('Could not connect to server. Is the Spring Boot backend running?');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Join Room button click
   * Calls POST /api/rooms/join via Spring Boot
   */
  const handleJoinRoom = async () => {
    setError('');

    if (!username.trim()) {
      setError('Please enter your username first!');
      return;
    }
    if (!roomCode.trim()) {
      setError('Please enter a room code!');
      return;
    }

    setLoading(true);
    try {
      // Call Spring Boot REST API to join room
      const data = await joinRoom(roomCode.trim().toUpperCase(), username.trim());

      if (!data.roomCode) {
        setError(data.message || 'Room not found!');
        return;
      }

      // Navigate to whiteboard
      navigate('/whiteboard', {
        state: {
          roomCode: data.roomCode,
          username: username.trim(),
          members: data.members,
        },
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Room not found! Check the room code and try again.');
      } else {
        setError('Could not connect to server. Is the Spring Boot backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        {/* Header */}
        <h1 className="home-title">🎨 Whiteboard</h1>
        <p className="home-subtitle">Draw together in real-time with your classmates</p>

        {/* Error message */}
        {error && <div className="error-msg">⚠️ {error}</div>}

        {/* Username Input */}
        <div className="form-group">
          <label className="form-label">Your Username</label>
          <input
            id="username-input"
            className="form-input"
            type="text"
            placeholder="Enter your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateRoom()}
          />
        </div>

        {/* Create Room Button */}
        <button
          id="create-room-btn"
          className="btn-primary"
          onClick={handleCreateRoom}
          disabled={loading}
        >
          {loading ? '⏳ Connecting...' : '✨ Create New Room'}
        </button>

        {/* Divider */}
        <div className="divider">or join existing</div>

        {/* Room Code Input */}
        <div className="form-group">
          <label className="form-label">Room Code</label>
          <input
            id="room-code-input"
            className="form-input"
            type="text"
            placeholder="Enter 6-character code..."
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={6}
            onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
          />
        </div>

        {/* Join Room Button */}
        <button
          id="join-room-btn"
          className="btn-secondary"
          onClick={handleJoinRoom}
          disabled={loading}
        >
          {loading ? '⏳ Joining...' : '🚀 Join Room'}
        </button>
      </div>
    </div>
  );
}

export default HomePage;
