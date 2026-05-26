package com.whiteboard.controller;

import com.whiteboard.dto.RoomDTO;
import com.whiteboard.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * RoomController - REST API endpoints for room management
 * Frontend calls these endpoints using Axios
 */
@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173") // Allow React dev server
public class RoomController {

    @Autowired
    private RoomService roomService;

    /**
     * POST /api/rooms/create
     * Creates a new room. Expects: { "username": "Alice" }
     * Returns: room code, members list
     */
    @PostMapping("/create")
    public ResponseEntity<RoomDTO> createRoom(@RequestBody Map<String, String> request) {
        String username = request.get("username");

        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new RoomDTO(null, null, "Username is required!"));
        }

        RoomDTO result = roomService.createRoom(username.trim());
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/rooms/join
     * Join an existing room. Expects: { "roomCode": "ABC123", "username": "Bob" }
     * Returns: room code, members list
     */
    @PostMapping("/join")
    public ResponseEntity<RoomDTO> joinRoom(@RequestBody Map<String, String> request) {
        String roomCode = request.get("roomCode");
        String username = request.get("username");

        if (roomCode == null || roomCode.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new RoomDTO(null, null, "Room code is required!"));
        }
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new RoomDTO(null, null, "Username is required!"));
        }

        RoomDTO result = roomService.joinRoom(roomCode.trim().toUpperCase(), username.trim());

        // If room not found, return 404
        if (result.getRoomCode() == null) {
            return ResponseEntity.status(404).body(result);
        }

        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/rooms/{roomCode}
     * Get room details and member list
     */
    @GetMapping("/{roomCode}")
    public ResponseEntity<RoomDTO> getRoomData(@PathVariable String roomCode) {
        RoomDTO result = roomService.getRoomData(roomCode.toUpperCase());

        if (result.getRoomCode() == null) {
            return ResponseEntity.status(404).body(result);
        }

        return ResponseEntity.ok(result);
    }
}
