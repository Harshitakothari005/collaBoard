package com.whiteboard.repository;

import com.whiteboard.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * RoomRepository - handles database operations for Room entity
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Find room by its code
    Optional<Room> findByRoomCode(String roomCode);

    // Check if room code already exists
    boolean existsByRoomCode(String roomCode);
}
