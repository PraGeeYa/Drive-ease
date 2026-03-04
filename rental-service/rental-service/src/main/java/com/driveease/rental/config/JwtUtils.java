package com.driveease.rental.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JwtUtils - A utility class for handling all JWT operations.
 * This class is responsible for generating, parsing, and validating security tokens.
 */
@Component
public class JwtUtils {

    // The secret key used for signing the token. Should be kept highly secure.
    private final String jwtSecret = "DriveEaseSecretKeyDriveEaseSecretKeyDriveEaseSecretKey";

    // Token validity period set to 24 hours (in milliseconds).
    private final int jwtExpirationMs = 86400000;

    /**
     * Internal helper to convert the secret string into a cryptographic SecretKey.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * GENERATE TOKEN
     * Creates a signed JWT for a specific user, embedding their username and role.
     * @param username - The unique username of the user.
     * @param role - The user's authority (e.g., ADMIN, AGENT, CUSTOMER).
     */
    public String generateToken(String username, String role) {
        // Map to store additional info inside the token (Claims)
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role); // Embedding the role so frontend/filter can read it later

        return Jwts.builder()
                .claims(claims) // Attach custom data (role)
                .subject(username) // Set the identity of the user
                .issuedAt(new Date()) // Current timestamp
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Expiry timestamp
                .signWith(getSigningKey()) // Sign the token with our secret key
                .compact(); // Finalize and return the encrypted string
    }

    /**
     * EXTRACT USERNAME
     * Decodes the token to find out which user it belongs to.
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject(); // Returns the 'subject' (username)
    }

    /**
     * VALIDATE TOKEN
     * Checks if the token is properly signed and hasn't expired.
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true; // Token is legitimate and active
        } catch (Exception e) {
            // Logs why the token failed (e.g., ExpiredJwtException, MalformedJwtException)
            System.out.println("JWT Validation Error: " + e.getMessage());
            return false;
        }
    }
}