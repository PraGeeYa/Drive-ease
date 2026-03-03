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

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final String jwtSecret = "DriveEaseSecretKeyDriveEaseSecretKeyDriveEaseSecretKey";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String username = claims.getSubject();
                // 🔥 Claims walin role eka gannawa. Meka token eka hadana thanadi 'role' kiyala danna oni.
                Object roleObj = claims.get("role");
                String role = roleObj != null ? roleObj.toString() : null;

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Authority eka ROLE_ADMIN wage lassanata hadagannawa
                    String authorityName = (role != null) ? "ROLE_" + role : "ROLE_USER";

                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            username, null, Collections.singletonList(new SimpleGrantedAuthority(authorityName))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                System.out.println("JWT Validation Error: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}