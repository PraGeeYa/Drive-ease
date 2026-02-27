package com.driveease.rental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * DriveEaseApplication is the main entry point for the Spring Boot application.
 * The @SpringBootApplication annotation enables auto-configuration, component scanning,
 * and allows the application to start an embedded web server (like Tomcat).
 */
@SpringBootApplication
public class DriveEaseApplication {

	/**
	 * The main method is the standard Java entry point that launches the application.
	 * It uses SpringApplication.run() to bootstrap the Spring context and start the server.
	 */
	public static void main(String[] args) {
		// Launching the DriveEase Rental System
		SpringApplication.run(DriveEaseApplication.class, args);
	}
}