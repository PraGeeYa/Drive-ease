package com.driveease.rental.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor  // 🔥 JPA ekata aniwaaryenma empty constructor ekak oni
@AllArgsConstructor // 🔥 Testing waladi lesi wenna
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // 🔥 Database eke thiyena 'user_id' ekata manual map kala
    private Long userId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false) // 🔥 Role ekak aniwaaryenma thiyenna oni
    private Role role;

    public enum Role {
        ADMIN,
        AGENT,
        CUSTOMER
    }
}