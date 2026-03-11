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
 * It provides methods to create, parse, and verify JSON Web Tokens.
 */
@Component
public class JwtUtils {

    // Secret key used to digitally sign the JWT.
    // This must be kept secret to prevent unauthorized token generation.
    private final String jwtSecret = "DriveEaseSecretKeyDriveEaseSecretKeyDriveEaseSecretKey";

    // Token expiration time set to 24 hours (86,400,000 milliseconds).
    private final int jwtExpirationMs = 86400000;

    /**
     * Converts the plain text secret string into a HMAC-SHA SecretKey object.
     * This key is used for both signing and verifying tokens.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * OPERATION: GENERATE TOKEN
     * Creates a new JWT string for an authenticated user.
     * * @param username - The identity of the user.
     * @param role - The user's role (to be stored in the 'claims' section).
     * @return A signed JWT string.
     */
    public String generateToken(String username, String role) {
        // 'Claims' are pieces of information shared between the server and client.
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .claims(claims)                // Add custom user data (role)
                .subject(username)             // Set the 'sub' (subject) claim as the username
                .issuedAt(new Date())          // Set the token creation timestamp
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs)) // Set expiration
                .signWith(getSigningKey())     // Sign the token using the secret key
                .compact();                    // Serialize the JWT into a URL-safe string
    }

    /**
     * OPERATION: EXTRACT USERNAME
     * Decodes the token to retrieve the 'subject' (username) claim.
     * * @param token - The JWT string sent by the client.
     * @return The username embedded in the token.
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())   // Verify signature before reading
                .build()
                .parseSignedClaims(token)      // Parse the token components
                .getPayload()
                .getSubject();                 // Extract the subject field
    }

    /**
     * OPERATION: VALIDATE TOKEN
     * Checks if the token is structurally correct, has a valid signature, and is not expired.
     * * @param authToken - The JWT to validate.
     * @return true if valid, false otherwise.
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true; // Token passed all security checks
        } catch (Exception e) {
            // Log the specific reason for failure (e.g., Expired, Malformed, Unsupported)
            System.out.println("JWT Validation Error: " + e.getMessage());
            return false;
        }
    }
}