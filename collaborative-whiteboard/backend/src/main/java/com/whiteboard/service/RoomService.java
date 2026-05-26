package com.whiteboard.service;

import com.whiteboard.dto.RoomDTO;
import com.whiteboard.entity.Room;
import com.whiteboard.entity.RoomMember;
import com.whiteboard.repository.RoomMemberRepository;
import com.whiteboard.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * RoomService - contains all the business logic for room management
 */
@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMemberRepository roomMemberRepository;

    /**
     * Create a new room with a unique code
     * Returns room details including the generated code
     */
    public RoomDTO createRoom(String username) {
        // Generate a unique 6-character room code
        String roomCode = generateUniqueRoomCode();

        // Create and save the room
        Room room = new Room();
        room.setRoomCode(roomCode);
        roomRepository.save(room);

        // Add the creator as the first member
        RoomMember member = new RoomMember();
        member.setUsername(username);
        member.setRoom(room);
        roomMemberRepository.save(member);

        // Get all member names
        List<String> members = List.of(username);

        return new RoomDTO(roomCode, members, "Room created successfully!");
    }

    /**
     * Join an existing room
     * Returns room details if found, error message if not
     */
    public RoomDTO joinRoom(String roomCode, String username) {
        // Find the room by code
        Optional<Room> optRoom = roomRepository.findByRoomCode(roomCode);

        if (optRoom.isEmpty()) {
            return new RoomDTO(null, null, "Room not found! Check the room code.");
        }

        Room room = optRoom.get();

        // Add user as a member (avoid duplicate entries)
        List<RoomMember> existingMembers = roomMemberRepository.findByRoom_RoomCode(roomCode);
        boolean alreadyMember = existingMembers.stream()
                .anyMatch(m -> m.getUsername().equalsIgnoreCase(username));

        if (!alreadyMember) {
            RoomMember member = new RoomMember();
            member.setUsername(username);
            member.setRoom(room);
            roomMemberRepository.save(member);
        }

        // Get updated member list
        List<String> memberNames = roomMemberRepository.findByRoom_RoomCode(roomCode)
                .stream()
                .map(RoomMember::getUsername)
                .collect(Collectors.toList());

        return new RoomDTO(roomCode, memberNames, "Joined successfully!");
    }

    /**
     * Get room data - room code and all members
     */
    public RoomDTO getRoomData(String roomCode) {
        Optional<Room> optRoom = roomRepository.findByRoomCode(roomCode);

        if (optRoom.isEmpty()) {
            return new RoomDTO(null, null, "Room not found!");
        }

        List<String> memberNames = roomMemberRepository.findByRoom_RoomCode(roomCode)
                .stream()
                .map(RoomMember::getUsername)
                .collect(Collectors.toList());

        return new RoomDTO(roomCode, memberNames, "Success");
    }

    /**
     * Generate a unique 6-character alphanumeric room code
     */
    private String generateUniqueRoomCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        String code;

        // Keep generating until we find a unique one
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 6; i++) {
                sb.append(characters.charAt(random.nextInt(characters.length())));
            }
            code = sb.toString();
        } while (roomRepository.existsByRoomCode(code));

        return code;
    }
}
