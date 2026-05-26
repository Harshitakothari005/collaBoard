package com.whiteboard.repository;

import com.whiteboard.entity.RoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * RoomMemberRepository - handles database operations for RoomMember entity
 */
@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {

    // Find all members in a room by room code
    List<RoomMember> findByRoom_RoomCode(String roomCode);
}
