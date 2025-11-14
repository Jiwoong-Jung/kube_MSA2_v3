FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY build/libs/*.jar eureka-server.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "eureka-server.jar"]
