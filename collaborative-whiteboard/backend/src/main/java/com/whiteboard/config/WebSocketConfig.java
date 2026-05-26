package com.whiteboard.config;

import com.whiteboard.websocket.DrawingWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * WebSocketConfig - registers the WebSocket endpoint
 *
 * The frontend connects to: ws://localhost:8080/ws/drawing
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private DrawingWebSocketHandler drawingWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
            .addHandler(drawingWebSocketHandler, "/ws/drawing")
            .setAllowedOriginPatterns("*"); // Allow any frontend URL
    }
}
