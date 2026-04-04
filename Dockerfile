# Use Eclipse Temurin as base image (modern, well-maintained Java image)
FROM eclipse-temurin:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built JAR file
COPY target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
