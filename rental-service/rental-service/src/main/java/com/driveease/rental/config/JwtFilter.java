package com.driveease.rental.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import javax.crypto.SecretKey;

/**
 * JwtFilter intercepts every HTTP request to validate the JWT token.
 * It ensures that the user is authenticated before reaching the API endpoints.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    // Secret Key used for digital signature verification.
    // IMPORTANT: In production, store this in an environment variable or config file.
    private final String jwtSecret = "DriveEaseSecretKeyDriveEaseSecretKeyDriveEaseSecretKey";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Step 1: Look for the 'Authorization' header in the incoming request
        String authHeader = request.getHeader("Authorization");

        // Step 2: Validate if the header exists and follows the 'Bearer <token>' format
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Extract the token string after "Bearer "

            try {
                // Convert the plain text secret into a cryptographic SecretKey object
                SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

                // Step 3: Parse the token and verify its signature/validity
                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                // Step 4: Extract user identity and permissions (claims) from the token
                String username = claims.getSubject();
                Object roleObj = claims.get("role");
                String role = roleObj != null ? roleObj.toString() : null;

                // Step 5: Check if the user is valid and not already authenticated in the current context
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Step 6: Map the role to a Spring Security Authority (e.g., ADMIN -> ROLE_ADMIN)
                    String authorityName = (role != null) ? "ROLE_" + role : "ROLE_USER";

                    // Step 7: Create a formal Authentication object with user details and roles
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            username, null, Collections.singletonList(new SimpleGrantedAuthority(authorityName))
                    );

                    // Step 8: Set the authentication into the Security Context for the duration of the request
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                // Log any errors (expired tokens, invalid signatures, etc.)
                System.out.println("JWT Validation Error: " + e.getMessage());
            }
        }

        // Final Step: Hand over the request to the next filter in the chain (or the controller)
        filterChain.doFilter(request, response);
    }
}