package com.whiteboard.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DrawingMessage - represents a drawing action sent via WebSocket
 * This is what gets sent between the React frontend and Spring Boot backend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawingMessage {

    // Room this drawing belongs to
    private String roomCode;

    // Who drew this
    private String username;

    // Type of action: "draw", "erase", "clear"
    private String type;

    // Drawing coordinates
    private double x0;
    private double y0;
    private double x1;
    private double y1;

    // Drawing properties
    private String color;
    private double lineWidth;
}
