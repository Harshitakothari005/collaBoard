package com.whiteboard.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * RoomDTO - Data Transfer Object to send room info to frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private String roomCode;
    private List<String> members;
    private String message;

    // Convenience constructor for success response
    public RoomDTO(String roomCode, List<String> members) {
        this.roomCode = roomCode;
        this.members = members;
    }
}
