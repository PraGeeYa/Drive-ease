package com.driveease.rental.service;

import com.driveease.rental.model.User;
import com.driveease.rental.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * CustomUserDetailsService - The bridge between Spring Security and your Database.
 * This service tells Spring Security how to look up user information
 * from the 'user' table during the authentication process.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * CONSTRUCTOR INJECTION:
     * Injecting the UserRepository to perform database lookups.
     */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * LOAD USER BY USERNAME:
     * Core method required by Spring Security's UserDetailsService interface.
     * It maps your custom 'User' entity to Spring Security's 'UserDetails' object.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1. DATABASE LOOKUP: Attempt to find the user in the repository.
        // Throws an exception if the username doesn't exist.
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        /**
         * 2. SECURITY OBJECT MAPPING:
         * We wrap our database user into a Spring Security 'User' object.
         * * Important: We prefix the role with "ROLE_" (e.g., ROLE_ADMIN)
         * because Spring Security's hasRole() method expects this standard.
         */
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}