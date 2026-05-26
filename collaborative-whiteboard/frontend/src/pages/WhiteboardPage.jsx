import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { connectWebSocket, sendDrawing, disconnectWebSocket } from '../services/websocket';
import { getRoomData } from '../services/api';

/**
 * WhiteboardPage - The main drawing page with canvas, toolbar, and members list
 * Connects to Spring Boot WebSocket for real-time collaboration
 */
function WhiteboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get room info passed from HomePage
  const { roomCode, username, members: initialMembers } = location.state || {};

  // Canvas ref for drawing
  const canvasRef = useRef(null);

  // State
  const [members, setMembers] = useState(initialMembers || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('draw'); // 'draw' or 'erase'
  const [color, setColor] = useState('#2563eb'); // Default blue
  const [brushSize, setBrushSize] = useState(4);
  const [wsConnected, setWsConnected] = useState(false);

  // Track last mouse position for drawing lines
  const lastPos = useRef({ x: 0, y: 0 });

  // Redirect if no room info (user refreshed page)
  useEffect(() => {
    if (!roomCode || !username) {
      navigate('/');
    }
  }, [roomCode, username, navigate]);

  // Set up canvas and WebSocket on mount
  useEffect(() => {
    if (!roomCode || !username) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to full size of its container
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Connect to Spring Boot WebSocket
    connectWebSocket((data) => {
      // Called when another user draws something
      handleRemoteDrawing(data);

      // If it's a member update, refresh member list
      if (data.type === 'member_update') {
        fetchMembers();
      }
    });

    setWsConnected(true);

    // Fetch updated member list from Spring Boot
    fetchMembers();

    // Cleanup on unmount
    return () => {
      disconnectWebSocket();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [roomCode, username]);

  /**
   * Fetch the latest member list from Spring Boot REST API
   */
  const fetchMembers = async () => {
    try {
      const data = await getRoomData(roomCode);
      if (data.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error('Could not fetch members:', err);
    }
  };

  /**
   * Get mouse position relative to canvas
   */
  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Handle both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  /**
   * Draw a line on the canvas (used for both local and remote drawing)
   */
  const drawLine = useCallback((ctx, x0, y0, x1, y1, drawColor, size, isEraser) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = isEraser ? '#ffffff' : drawColor;
    ctx.lineWidth = isEraser ? size * 4 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, []);

  /**
   * Handle drawing received from another user via WebSocket
   */
  const handleRemoteDrawing = useCallback((data) => {
    const canvas = canvasRef.current;
    if (!canvas || data.type === 'member_update') return;

    const ctx = canvas.getContext('2d');

    if (data.type === 'clear') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    drawLine(
      ctx,
      data.x0, data.y0,
      data.x1, data.y1,
      data.color,
      data.lineWidth,
      data.type === 'erase'
    );
  }, [drawLine]);

  /**
   * Mouse Down - start drawing
   */
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;
  };

  /**
   * Mouse Move - draw while moving
   */
  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    const isEraser = tool === 'erase';

    // Draw locally on our canvas
    drawLine(ctx, lastPos.current.x, lastPos.current.y, pos.x, pos.y, color, brushSize, isEraser);

    // Send drawing data to Spring Boot WebSocket (which broadcasts to others)
    sendDrawing({
      roomCode,
      username,
      type: isEraser ? 'erase' : 'draw',
      x0: lastPos.current.x,
      y0: lastPos.current.y,
      x1: pos.x,
      y1: pos.y,
      color,
      lineWidth: brushSize,
    });

    lastPos.current = pos;
  };

  /**
   * Mouse Up - stop drawing
   */
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  /**
   * Clear the entire canvas
   */
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Notify other users to clear their canvas too
    sendDrawing({
      roomCode,
      username,
      type: 'clear',
      x0: 0, y0: 0, x1: 0, y1: 0,
      color: '#ffffff',
      lineWidth: 0,
    });
  };

  /**
   * Export the canvas as PNG image
   */
  const handleExport = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `whiteboard-${roomCode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  /**
   * Leave the whiteboard and go back to home
   */
  const handleLeave = () => {
    disconnectWebSocket();
    navigate('/');
  };

  if (!roomCode || !username) return null;

  return (
    <div className="whiteboard-container">

      {/* === SIDEBAR === */}
      <div className="sidebar">
        <div className="sidebar-logo">🎨 Whiteboard</div>

        {/* Room Code Display */}
        <div className="room-code-box">
          <div className="room-code-label">Room Code</div>
          <div className="room-code-value">{roomCode}</div>
        </div>

        {/* Members List */}
        <div className="members-section">
          <div className="members-title">👥 Members ({members.length})</div>
          {members.map((member, index) => (
            <div key={index} className="member-item">
              <div className="member-avatar">
                {member.charAt(0).toUpperCase()}
              </div>
              <span className="member-name">
                {member} {member === username ? '(you)' : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Sidebar Buttons */}
        <div className="sidebar-actions">
          <button id="export-btn" className="btn-export" onClick={handleExport}>
            📥 Download PNG
          </button>
          <button id="leave-btn" className="btn-leave" onClick={handleLeave}>
            🚪 Leave Room
          </button>
        </div>
      </div>

      {/* === CANVAS AREA === */}
      <div className="canvas-area">

        {/* Toolbar */}
        <div className="toolbar">
          {/* Draw Tool */}
          <button
            id="draw-tool-btn"
            className={`toolbar-btn ${tool === 'draw' ? 'active' : ''}`}
            onClick={() => setTool('draw')}
          >
            ✏️ Draw
          </button>

          {/* Eraser Tool */}
          <button
            id="eraser-tool-btn"
            className={`toolbar-btn ${tool === 'erase' ? 'active' : ''}`}
            onClick={() => setTool('erase')}
          >
            🧹 Eraser
          </button>

          {/* Color Picker */}
          <div className="color-picker-wrapper">
            <span className="color-picker-label">Color</span>
            <input
              id="color-picker"
              className="color-input"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          {/* Brush Size */}
          <div className="brush-size-wrapper">
            <span className="brush-size-label">Size: {brushSize}</span>
            <input
              id="brush-size-slider"
              className="brush-size-input"
              type="range"
              min="1"
              max="30"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
          </div>

          {/* Clear Board */}
          <button
            id="clear-board-btn"
            className="toolbar-btn clear-btn"
            onClick={handleClear}
          >
            🗑️ Clear
          </button>
        </div>

        {/* The drawing canvas */}
        <canvas
          ref={canvasRef}
          id="whiteboard-canvas"
          className={`whiteboard-canvas ${tool === 'erase' ? 'eraser-mode' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        />

        {/* WebSocket Connection Status */}
        <div className="connection-status">
          <div className={`status-dot ${wsConnected ? '' : 'disconnected'}`}></div>
          {wsConnected ? 'Live' : 'Disconnected'}
        </div>
      </div>
    </div>
  );
}

export default WhiteboardPage;
