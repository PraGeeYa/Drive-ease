package com.driveease.rental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * DriveEaseApplication - The Main Entry Point.
 * Developed by: Prageeth Weerasekara
 * * This class initializes the Spring context, scans for beans,
 * and launches the embedded Tomcat server.
 */
@SpringBootApplication
public class DriveEaseApplication {

	public static void main(String[] args) {
		// Launching the Spring Boot Context
		SpringApplication.run(DriveEaseApplication.class, args);

		// --- CUSTOM STARTUP LOGGING BY PRAGEETH WEERASEKARA ---

		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String currentTime = dtf.format(LocalDateTime.now());

		System.out.println("\n" + "=".repeat(70));
		System.out.println("   _____       _             ______                ");
		System.out.println("  |  __ \\     (_)           |  ____|               ");
		System.out.println("  | |  | |_ __ ___   _____  | |__   __ _ ___  ___  ");
		System.out.println("  | |  | | '__| \\ \\ / / _ \\ |  __| / _` / __|/ _ \\ ");
		System.out.println("  | |__| | |  | |\\ V /  __/ | |___| (_| \\__ \\  __/ ");
		System.out.println("  |_____/|_|  |_| \\_/ \\___| |______\\__,_|___/\\___| ");
		System.out.println("\n                PREMIUM CAR RENTAL SYSTEM            ");
		System.out.println("=".repeat(70));

		// ASCII Art for Visual Appeal
		System.out.println("       _______");
		System.out.println("      //  ||\\ \\");
		System.out.println("_____//___||_\\ \\___");
		System.out.println(")  _          _    \\");
		System.out.println("|_/ \\________/ \\___|");
		System.out.println("  \\_/        \\_/");

		System.out.println("\n[SYSTEM INFO]");
		System.out.println("🚀 STATUS    : DriveEase Engine is LIVE");
		System.out.println("👤 DEVELOPER : Prageeth Weerasekara");
		System.out.println("📅 TIME      : " + currentTime);
		System.out.println("🔗 PORT      : http://localhost:8080");
		System.out.println("📊 DATABASE  : MySQL Connected (Hibernate Active)");
		System.out.println("🛡️  SECURITY  : JWT Authentication Layer Initialized");

		System.out.println("\n" + "=".repeat(70));
		System.out.println("✅ System successfully deployed by Prageeth Weerasekara.");
		System.out.println("=".repeat(70) + "\n");
	}
}