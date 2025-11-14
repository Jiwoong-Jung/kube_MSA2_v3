FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY build/libs/*.jar gateway.jar

EXPOSE 9898

ENTRYPOINT ["java", "-jar", "gateway.jar"]
