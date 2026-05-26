package com.whiteboard.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * RoomMember entity - represents a user who joined a room
 */
@Entity
@Table(name = "room_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    // Many members belong to one room
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @PrePersist
    public void prePersist() {
        this.joinedAt = LocalDateTime.now();
    }
}
