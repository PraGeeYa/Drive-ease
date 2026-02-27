🚗 DriveEase - Enterprise-Grade Car Rental Management System
DriveEase is a high-performance, full-stack web application designed to automate the lifecycle of car rentals. Developed with an emphasis on role-based security, real-time analytics, and automated customer communication, it serves as a robust solution for modern vehicle fleet management.

👨‍💻 Developer & Professional Profile
Name: Prageeth Weerasekara

Current Role: IT Trainee at Capital Maharaja Group (CMG)

Education: BSc (Hons) in Information Technology (Undergraduate)

Institute: Sri Lanka Institute of Information Technology (SLIIT)

Employee ID: 90580

🌟 Key Features
Multi-User Access Control: Secure and distinct dashboards for Admins, Support Agents, and Customers.

Fleet Management Engine: Real-time search functionality with availability tracking and category-based filtering.

Dynamic Pricing Logic: Automated calculation of rental costs based on duration, vehicle count, and service markups.

Professional HTML Emailing: Integrated Spring Boot & Thymeleaf workflow to dispatch responsive, brand-styled email confirmations upon booking approval.

Business Intelligence Dashboards: Interactive data visualization powered by Chart.js for monitoring fleet statistics.

Provider Management: A dedicated module for tracking third-party vehicle suppliers and their contracts.

🛠️ Technology Stack
Backend (Micro-Service Ready)
Framework: Spring Boot 3.5.10 (Java 17)

Persistence: Spring Data JPA with Hibernate ORM

Database: MySQL 8.0

Email Engine: Thymeleaf & JavaMailSender (For high-fidelity HTML templates)

Lombok: Used for cleaner, more maintainable code.

Frontend (Modern SPA)
Library: React.js

Styling: Tailwind CSS (Responsive Design)

Visualization: Chart.js for data-driven insights.

📁 System Architecture
Plaintext
src/main/java/com/driveease/rental/
├── controller/     # REST API Endpoints for frontend communication
├── model/          # Persistence Entities (User, Booking, VehicleContract)
├── repository/     # Data Access Layer (JPA Interfaces)
├── service/        # Core Business Logic & Automated Workflows
└── DriveEaseApplication.java  # Main Application Entry Point
📧 Automated Booking Workflow
DriveEase ensures seamless communication. When an Agent approves a booking:

The EmailService fetches a responsive HTML template.

Dynamic data (Customer Name, Vehicle Model, Total Price) is injected via Thymeleaf.

A secure connection is established with Gmail SMTP to dispatch a professional confirmation to the customer.

🚀 Installation & Setup
1. Environment Configuration
Configure your src/main/resources/application.properties:

Properties
spring.datasource.url=jdbc:mysql://localhost:3306/driveease_db
spring.datasource.username=your_mysql_user
spring.datasource.password=your_mysql_password

# Email Configuration
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-digit-app-password
2. Launching the System

Bash

# Run Backend
mvn spring-boot:run

# Run Frontend
npm install
npm start
📜 License & Acknowledgement
© 2026 Prageeth Weerasekara.

Developed during my academic journey at SLIIT while gaining industrial experience as an IT Trainee at Capital Maharaja Group. All rights reserved.
