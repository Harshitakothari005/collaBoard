package com.whiteboard.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.whiteboard.dto.DrawingMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * DrawingWebSocketHandler - handles real-time drawing communication
 *
 * How it works:
 * 1. When a user opens the whiteboard, their browser connects via WebSocket
 * 2. They join a "room" (identified by roomCode)
 * 3. When they draw, a message is sent to this handler
 * 4. This handler broadcasts that drawing to ALL other users in the same room
 * 5. Every user's canvas updates in real time!
 */
@Component
public class DrawingWebSocketHandler extends TextWebSocketHandler {

    // Maps roomCode -> Set of WebSocket sessions (connected users)
    private final Map<String, Set<WebSocketSession>> roomSessions = new ConcurrentHashMap<>();

    // Jackson ObjectMapper to convert JSON <-> Java objects
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Called when a new WebSocket connection is established
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("New WebSocket connection: " + session.getId());
        // We don't add the session to a room yet - that happens when they send the first message
    }

    /**
     * Called when a message is received from a client (browser)
     * The message contains drawing data as JSON
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Parse the incoming JSON message into DrawingMessage object
        DrawingMessage drawingMessage = objectMapper.readValue(message.getPayload(), DrawingMessage.class);

        String roomCode = drawingMessage.getRoomCode();

        // Add this session to the room if not already added
        roomSessions.computeIfAbsent(roomCode, k -> ConcurrentHashMap.newKeySet()).add(session);

        // Store the roomCode in session attributes for cleanup later
        session.getAttributes().put("roomCode", roomCode);

        // Broadcast the drawing to ALL sessions in the same room (except sender)
        Set<WebSocketSession> sessions = roomSessions.get(roomCode);
        if (sessions != null) {
            String jsonMessage = message.getPayload(); // Send the original JSON
            for (WebSocketSession s : sessions) {
                // Send to everyone EXCEPT the person who drew it
                if (s.isOpen() && !s.getId().equals(session.getId())) {
                    s.sendMessage(new TextMessage(jsonMessage));
                }
            }
        }
    }

    /**
     * Called when a WebSocket connection is closed (user leaves/disconnects)
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("WebSocket connection closed: " + session.getId());

        // Remove session from its room
        String roomCode = (String) session.getAttributes().get("roomCode");
        if (roomCode != null && roomSessions.containsKey(roomCode)) {
            roomSessions.get(roomCode).remove(session);

            // Clean up empty rooms
            if (roomSessions.get(roomCode).isEmpty()) {
                roomSessions.remove(roomCode);
            }
        }
    }

    /**
     * Called when a transport error occurs
     */
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("WebSocket error: " + exception.getMessage());
        session.close(CloseStatus.SERVER_ERROR);
    }
}
